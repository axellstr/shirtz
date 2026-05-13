'use client'

import { Suspense, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { PRODUCTS } from '@/data/products'
import type { Size } from '@/data/products'

gsap.registerPlugin(SplitText)

function CheckoutFallback() {
  return (
    <main className="checkout checkout--fallback">
      <header className="site-header">
        <Link href="/" className="site-header__brand" aria-label="Home">
          <img src="/logos/text.svg" alt="" className="site-header__logo" width={529} height={137} />
        </Link>
      </header>
      <p className="checkout__fallback-text">Loading…</p>
    </main>
  )
}

function CheckoutInner() {
  const searchParams = useSearchParams()
  const mainRef = useRef<HTMLElement>(null)

  const idParam = searchParams.get('id')
  const productId = idParam ? parseInt(idParam, 10) : NaN
  const product = Number.isFinite(productId) ? PRODUCTS.find((p) => p.id === productId) : undefined

  type SizePick = { productId: number; size: Size }
  const [sizePick, setSizePick] = useState<SizePick | null>(null)
  const size: Size =
    sizePick != null && product != null && sizePick.productId === product.id
      ? sizePick.size
      : product?.sizes[0] ?? 'M'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (!product || !mainRef.current) return

    const main = mainRef.current
    const preview = main.querySelector<HTMLElement>('.checkout__preview')
    if (!preview) return
    const previewImage = preview.querySelector<HTMLElement>('.checkout__preview-img')

    let splitTitle: SplitText | null = null
    let splitPrice: SplitText | null = null
    let splitDesc: SplitText | null = null
    let splitLegend: SplitText | null = null

    const ctx = gsap.context(() => {
      const panel = main.querySelector<HTMLElement>('.checkout__panel')
      if (!panel) return

      panel.classList.remove('checkout__panel--ready')

      const backLink = panel.querySelector<HTMLElement>('.checkout__back-link')
      const title = panel.querySelector<HTMLElement>('.checkout__title')
      const price = panel.querySelector<HTMLElement>('.checkout__price')
      const desc = panel.querySelector<HTMLElement>('.checkout__desc')
      const legend = panel.querySelector<HTMLElement>('legend.checkout__sizes-label')
      const sizeButtons = panel.querySelectorAll<HTMLElement>('.checkout__size')
      const submit = panel.querySelector<HTMLElement>('.checkout__submit')

      if (!title || !price || !desc || !submit) return

      splitTitle = new SplitText(title, {
        type: 'lines, chars',
        mask: 'lines',
        charsClass: 'char',
      })
      splitPrice = new SplitText(price, {
        type: 'lines, chars',
        mask: 'lines',
        charsClass: 'char',
      })
      splitDesc = new SplitText(desc, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
      })
      if (legend?.textContent?.trim()) {
        splitLegend = new SplitText(legend, {
          type: 'lines, chars',
          mask: 'lines',
          charsClass: 'char',
        })
      }

      const titleChars = title.querySelectorAll<HTMLElement>('.char')
      const priceChars = price.querySelectorAll<HTMLElement>('.char')
      const descLines = desc.querySelectorAll<HTMLElement>('.line')
      const legendChars = legend?.querySelectorAll<HTMLElement>('.char') ?? []
      const controls = [
        backLink,
        ...Array.from(sizeButtons),
        submit,
      ].filter((node): node is HTMLElement => node != null)

      gsap.set([titleChars, priceChars, descLines, legendChars], { y: '100%' })
      gsap.set(preview, { autoAlpha: 0, scale: 0.985 })
      if (previewImage) {
        gsap.set(previewImage, { autoAlpha: 0, scale: 1.06, yPercent: 2 })
      }
      gsap.set(controls, { autoAlpha: 0, y: 18 })
      if (backLink) gsap.set(backLink, { y: 10 })

      panel.classList.add('checkout__panel--ready')

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(preview, { autoAlpha: 1, scale: 1, duration: 0.95 }, 0)

      if (previewImage) {
        tl.to(
          previewImage,
          {
            autoAlpha: 1,
            scale: 1,
            yPercent: 0,
            duration: 1.05,
            ease: 'power4.out',
          },
          0.08
        )
      }

      if (backLink) {
        tl.to(backLink, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.1)
      }

      tl.to(
        titleChars,
        {
          y: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          stagger: 0.025,
        },
        0.12
      )

      tl.to(
        priceChars,
        {
          y: 0,
          duration: 0.85,
          ease: 'power3.inOut',
          stagger: 0.022,
        },
        0.22
      )

      tl.to(
        descLines,
        {
          y: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          stagger: 0.05,
        },
        0.28
      )

      if (splitLegend && legend) {
        tl.to(
          legendChars,
          {
            y: 0,
            duration: 0.7,
            ease: 'power3.inOut',
            stagger: 0.035,
          },
          0.42
        )
      }

      tl.to(
        sizeButtons,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.065,
        },
        0.48
      )

      tl.to(
        submit,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        0.72
      )
    }, main)

    return () => {
      ctx.revert()
      main.querySelector('.checkout__panel')?.classList.remove('checkout__panel--ready')
      try {
        splitTitle?.revert()
        splitPrice?.revert()
        splitDesc?.revert()
        splitLegend?.revert()
      } catch {
        /* SplitText nodes may already be detached during a route transition. */
      }
    }
  }, [product?.id])

  if (!product) {
    return (
      <main ref={mainRef} className="checkout checkout--empty">
        <header className="site-header">
          <Link href="/" className="site-header__brand" aria-label="Home">
            <img src="/logos/text.svg" alt="" className="site-header__logo" width={529} height={137} />
          </Link>
        </header>

        <div className="checkout__inner">
          <p className="checkout__empty-title">Product not found</p>
          <p className="checkout__empty-copy">Check the link or pick another tee from the grid.</p>
          <Link href="/" className="checkout__back-link">
            Back to shop
          </Link>
        </div>
      </main>
    )
  }

  async function handleComplete() {
    if (!product || !size) return

    setIsSubmitting(true)
    setCheckoutError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, size }),
      })
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null

      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to start checkout. Please try again.')
      }

      if (!data?.url) {
        throw new Error('Stripe did not return a Checkout URL.')
      }

      window.location.assign(data.url)
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to start checkout. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <main ref={mainRef} className="checkout">
      <header className="site-header">
        <Link href="/" className="site-header__brand" aria-label="Home">
          <img src="/logos/text.svg" alt="" className="site-header__logo" width={529} height={137} />
        </Link>
      </header>

      <div className="checkout__inner">
        <div className="checkout__anim checkout__columns">
          <div className="checkout__preview">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="checkout__preview-img"
              priority
            />
          </div>

          <div className="checkout__panel">
            <Link href="/" className="checkout__back-link checkout__back-link--subtle">
              ← Back
            </Link>

            <h1 className="checkout__title">{product.name}</h1>
            <p className="checkout__price">${product.price.toFixed(2)}</p>
            <p className="checkout__desc">{product.description}</p>

            <fieldset className="checkout__sizes" disabled={isSubmitting}>
              <legend className="checkout__sizes-label">Size</legend>
              <div className="checkout__size-list" role="group" aria-label="Choose size">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`checkout__size ${size === s ? 'checkout__size--active' : ''}`}
                    aria-pressed={size === s}
                    onClick={() => setSizePick({ productId: product.id, size: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              className="checkout__submit"
              onClick={handleComplete}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Redirecting…' : 'Complete order'}
            </button>

            {checkoutError ? (
              <p className="checkout__error" role="alert">
                {checkoutError}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutInner />
    </Suspense>
  )
}
