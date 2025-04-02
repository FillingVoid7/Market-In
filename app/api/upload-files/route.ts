import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Custom config to prevent body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    // Use formidable to parse the incoming form data
    const form = formidable();
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Check if the file exists in the request
    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file[0];
    
    // Upload the file to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'product-images',
          resource_type: 'auto', // Automatically detect if it's an image or video
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as { secure_url: string; public_id: string }); // Ensure the return value matches the type
          }
        }
      );

      const readStream = createReadStream(file.filepath);
      readStream.pipe(uploadStream);
    });

    // Return both the temporary blob URL and the secure Cloudinary URL
    res.status(200).json({
      tempUrl: file.filepath,
      permanentUrl: result.secure_url,
      mediaType: file.mimetype, 
      publicId: result.public_id, 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: (error as any).message || 'Server error',
    });
  }
}
