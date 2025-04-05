import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const mediaType = formData.get('mediaType') as string;

    if (!file || !mediaType) {
      return NextResponse.json(
        { error: 'Missing file or mediaType' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'product-images',
          resource_type: mediaType === 'video' ? 'video' : 'image',
          allowed_formats: mediaType === 'video' ? ['mp4', 'mov'] : ['jpg', 'png', 'webp']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Create a readable stream from buffer
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
    console.log('Upload result:', result);
    return NextResponse.json({
      permanentUrl: (result as any).secure_url,
      mediaType,
      publicId: (result as any).public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}