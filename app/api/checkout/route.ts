import { NextResponse } from 'next/server'
import { PRODUCTS, type Size } from '@/data/products'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

type CheckoutRequest = {
  productId?: unknown
  size?: unknown
}

function getSiteUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const baseUrl = configuredUrl && configuredUrl.length > 0 ? configuredUrl : new URL(request.url).origin

  return baseUrl.replace(/\/$/, '')
}

export async function POST(request: Request) {
  let body: CheckoutRequest

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid checkout request.' }, { status: 400 })
  }

  const productId =
    typeof body.productId === 'number'
      ? body.productId
      : typeof body.productId === 'string'
        ? Number(body.productId)
        : NaN
  const product =
    Number.isInteger(productId) && productId > 0 ? PRODUCTS.find((item) => item.id === productId) : undefined
  const size = body.size

  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }

  if (typeof size !== 'string' || !product.sizes.includes(size as Size)) {
    return NextResponse.json({ error: 'Choose a valid size.' }, { status: 400 })
  }

  try {
    const siteUrl = getSiteUrl(request)
    const imageUrl = new URL(product.image, siteUrl).toString()
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.name,
              description: `Size ${size}`,
              images: [imageUrl],
            },
          },
        },
      ],
      metadata: {
        productId: String(product.id),
        size,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?id=${product.id}`,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a Checkout URL.' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[Stripe Checkout] Failed to create session:', error)
    return NextResponse.json({ error: 'Unable to start checkout. Please try again.' }, { status: 500 })
  }
}
