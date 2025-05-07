import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

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

    const buffer = Buffer.from(await file.arrayBuffer());

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'product-images',
          resource_type: mediaType === 'video' ? 'video' : 'image',
          allowed_formats: mediaType === 'video' ? ['mp4', 'mov'] : ['jpg', 'png', 'webp']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });

    return NextResponse.json({
      permanentUrl: result.secure_url,
      mediaType,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
