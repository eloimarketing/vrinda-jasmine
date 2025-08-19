import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log('Session:', session);
    
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    console.log('Looking for user with email:', session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return NextResponse.json({ error: 'User not found - Please check your login status' }, { status: 404 });
    }

    const formData = await request.formData();
    
    // Extract basic product data
    const productData = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
      subcategory: formData.get('subcategory') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      // Legacy fields for backward compatibility
      productImage: formData.get('productImage') as string,
      productVideo: formData.get('productVideo') as string,
      mediaType: formData.get('mediaType') as string,
      ownerId: user.id,
    };

    // Validate required fields
    if (!productData.name || !productData.price || !productData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle multiple images and videos
    const imageFiles = formData.getAll('images') as (File | string)[];
    const videoFiles = formData.getAll('videos') as (File | string)[];
    
    // Upload images to Cloudinary
    const imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      const imageUploadPromises = imageFiles.map(async (file) => {
        // If it's already a URL (string), use it directly
        if (typeof file === 'string') {
          return file;
        }
        
        // If it's a File object, upload it
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new Promise<string>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            }
          ).end(buffer);
        });
      });
      
      imageUrls.push(...await Promise.all(imageUploadPromises));
    }

    // Upload videos to Cloudinary
    const videoUrls: string[] = [];
    if (videoFiles.length > 0) {
      const videoUploadPromises = videoFiles.map(async (file) => {
        // If it's already a URL (string), use it directly
        if (typeof file === 'string') {
          return file;
        }
        
        // If it's a File object, upload it
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new Promise<string>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'video' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            }
          ).end(buffer);
        });
      });
      
      videoUrls.push(...await Promise.all(videoUploadPromises));
    }

    // Use legacy single image/video if no multiple files provided
    if (imageUrls.length === 0 && productData.productImage) {
      imageUrls.push(productData.productImage);
    }
    if (videoUrls.length === 0 && productData.productVideo) {
      videoUrls.push(productData.productVideo);
    }

    // Validate that at least one image or video is provided
    if (imageUrls.length === 0 && videoUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one product image or video is required' },
        { status: 400 }
      );
    }

    // Map category names to enum values
    const categoryMap: { [key: string]: string } = {
      'Refrigeration': 'REFRIGERATION',
      'Cooking Appliances': 'COOKING_APPLIANCES',
      'Appliances': 'APPLIANCES',
      'Kitchenware & Equipment': 'KITCHENWARE_EQUIPMENT',
      'Consumables': 'CONSUMABLES',
      'Kitchen Furniture': 'KITCHEN_FURNITURE',
      'Cleaning': 'CLEANING',
      'Graded Equipment': 'GRADED_EQUIPMENT',
      'Barware': 'BARWARE',
      'Tableware': 'TABLEWARE',
      'Kitchen Accessories': 'KITCHEN_ACCESSORIES',
      'Catering Supplies': 'CATERING_SUPPLIES',
    };

    const categoryEnum = categoryMap[productData.category];
    if (!categoryEnum) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        category: categoryEnum as any,
        subcategory: productData.subcategory || null,
        price: productData.price,
        description: productData.description,
        // Legacy fields
        productImage: imageUrls[0] || null, // Use first image as legacy field
        productVideo: videoUrls[0] || null, // Use first video as legacy field
        mediaType: imageUrls.length > 0 ? 'image' : 'video',
        // New multiple media fields
        images: imageUrls,
        videos: videoUrls,
        owner: {
          connect: {
            id: user.id
          }
        }
      } as any
    });

    // Extract and create dynamic attributes
    const attributesJson = formData.get('attributes') as string;
    if (attributesJson) {
      try {
        const attributes = JSON.parse(attributesJson);
        
        // Create product attributes
        const attributePromises = Object.entries(attributes).map(([name, value]) => {
          return prisma.productAttribute.create({
            data: {
              productId: product.id,
              attributeName: name,
              attributeValue: String(value),
              attributeType: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string',
            }
          });
        });

        await Promise.all(attributePromises);
      } catch (error) {
        console.error('Error parsing attributes:', error);
        // Continue without attributes if there's an error
      }
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        images: (product as any).images,
        videos: (product as any).videos,
      }
    });

  } catch (error) {
    console.error('Error creating product:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const approved = searchParams.get('approved');

    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (subcategory) {
      where.subcategory = subcategory;
    }
    
    if (approved !== null) {
      where.isApproved = approved === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        attributes: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      products: products.map(product => ({
        ...product,
        attributes: product.attributes.reduce((acc: any, attr: any) => {
          acc[attr.attributeName] = attr.attributeValue;
          return acc;
        }, {})
      }))
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}