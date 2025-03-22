import { NextApiRequest, NextApiResponse } from 'next'
import { ProductDetails, ShopDetails } from '../../../redux/templatesPreview/freePreviewSlice'
import { v4 as uuidv4 } from 'uuid'

import { products } from '../get-free-product/route'

interface GenerateRequest {
  productDetails: ProductDetails
  shopDetails: ShopDetails
  faqList: any[]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const content = req.body as GenerateRequest
        const id = uuidv4()

        products.set(id, {
          id,
          content,
          createdAt: new Date()
        })
        return res.status(200).json({ id })
      } catch (error) {
        console.error('Generate URL error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).json({ error: `Method ${method} not allowed` })
  }
}