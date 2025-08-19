import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const uploadOptions = {
      resource_type: type === 'video' ? 'video' : 'image',
      folder: 'vrindajasmin/products',
      allowed_formats: type === 'video' 
        ? ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'] 
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: type === 'image' ? [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ] : undefined
    };

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      public_id: (result as any).public_id,
      resource_type: (result as any).resource_type,
      format: (result as any).format,
      width: (result as any).width,
      height: (result as any).height,
      duration: (result as any).duration, // for videos
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 