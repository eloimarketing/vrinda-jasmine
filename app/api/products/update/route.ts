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

export async function PUT(request: NextRequest) {
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
      productId: formData.get('productId') as string,
      productType: formData.get('productType') as string,
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

    console.log('Received product data:', productData);

    // Validate required fields
    if (!productData.name || !productData.price || !productData.description || !productData.productId) {
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

    // Map category names to enum values (handle both display names and enum values)
    const categoryMap: { [key: string]: string } = {
      // Display names to enum values
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
      // Enum values to enum values (for direct mapping)
      'REFRIGERATION': 'REFRIGERATION',
      'COOKING_APPLIANCES': 'COOKING_APPLIANCES',
      'APPLIANCES': 'APPLIANCES',
      'KITCHENWARE_EQUIPMENT': 'KITCHENWARE_EQUIPMENT',
      'CONSUMABLES': 'CONSUMABLES',
      'KITCHEN_FURNITURE': 'KITCHEN_FURNITURE',
      'CLEANING': 'CLEANING',
      'GRADED_EQUIPMENT': 'GRADED_EQUIPMENT',
      'BARWARE': 'BARWARE',
      'TABLEWARE': 'TABLEWARE',
      'KITCHEN_ACCESSORIES': 'KITCHEN_ACCESSORIES',
      'CATERING_SUPPLIES': 'CATERING_SUPPLIES',
    };

    const categoryEnum = categoryMap[productData.category];
    if (!categoryEnum) {
      console.log('Invalid category received:', productData.category);
      console.log('Available categories:', Object.keys(categoryMap));
      return NextResponse.json(
        { error: `Invalid category: ${productData.category}` },
        { status: 400 }
      );
    }

    let updatedProduct;

    if (productData.productType === 'unified') {
      // Update unified product
      updatedProduct = await prisma.product.update({
        where: { 
          id: productData.productId,
          ownerId: user.id // Ensure the product belongs to the current user
        },
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
        } as any
      });

      // Update dynamic attributes
      const attributesJson = formData.get('attributes') as string;
      if (attributesJson) {
        try {
          const attributes = JSON.parse(attributesJson);
          
          // Delete existing attributes
          await prisma.productAttribute.deleteMany({
            where: { productId: productData.productId }
          });
          
          // Create new attributes
          const attributePromises = Object.entries(attributes).map(([name, value]) => {
            return prisma.productAttribute.create({
              data: {
                productId: productData.productId,
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
    } else {
      // Update legacy product
      // Find which legacy table the product belongs to
      const legacyTables = [
        'glassDoorRefrigeration',
        'iceCreamFreezers',
        'drinksFridgesBottleCoolers',
        'serveOverCounters',
        'multideckDisplays',
        'uprightUndercounterFridges',
        'freezersChestAndUpright',
        'rangeCookersInductionCookersHobs',
        'ovens',
        'gnPansAccessories',
        'cookware',
        'beverageMachines',
        'blendersMixers',
        'slushMachines',
        'allAppliances',
        'generalEquipment',
        'generalConsumables',
        'allFurniture',
        'dishwashersGlasswashers',
        'hygieneAccessories',
        'laundryMachines',
        'allGradedProducts'
      ];

      let found = false;
      for (const tableName of legacyTables) {
        try {
          const existingProduct = await (prisma as any)[tableName].findUnique({
            where: { 
              id: productData.productId,
              ownerId: user.id
            }
          });
          
          if (existingProduct) {
            updatedProduct = await (prisma as any)[tableName].update({
              where: { 
                id: productData.productId,
                ownerId: user.id
              },
              data: {
                productName: productData.name,
                brand: productData.brand,
                price: productData.price,
                description: productData.description,
                productImage: imageUrls[0] || null,
                // Add other fields as needed based on the table structure
              }
            });
            found = true;
            break;
          }
        } catch (error) {
          // Continue to next table if this one doesn't exist
          continue;
        }
      }

      if (!found) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name || updatedProduct.productName,
        category: updatedProduct.category,
        subcategory: updatedProduct.subcategory,
        price: updatedProduct.price,
        images: (updatedProduct as any).images,
        videos: (updatedProduct as any).videos,
      }
    });

  } catch (error) {
    console.error('Error updating product:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 