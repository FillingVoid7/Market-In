import { NextRequest, NextResponse } from 'next/server';
import { mongooseConnect } from '@lib/mongoose';
import { BasicPreviewModel } from '../../../../models/basicPreview.model';

export async function GET(
  request: NextRequest,
  { params } : { params: Promise<{ productId: string }> }

) {
  try {
    await mongooseConnect();
    
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const product = await BasicPreviewModel.findById(productId);
    return NextResponse.json(product);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}