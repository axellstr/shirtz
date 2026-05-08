'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'
import imagesLoaded from 'imagesloaded'

gsap.registerPlugin(Draggable, Flip, SplitText)

// Grid column layout — original demo column order
const COLUMNS: number[][] = [
  [3, 7, 1, 5, 2],
  [4, 6, 3, 7, 1],
  [5, 2, 4, 6, 1],
  [3, 5, 1, 6, 2],
  [4, 6, 3, 5, 1],
  [5, 6, 2, 1, 4],
  [3, 4, 1, 2, 6],
  [5, 2, 4, 6, 1],
  [3, 5, 1, 6, 2],
  [4, 6, 3, 5, 1],
]

const PRODUCTS: Record<number, { title: string; price: string; desc: string }> = {
  1: {
    title: 'Crimson Crew',
    price: '$300,00',
    desc: 'A saturated red tee that reads confident from across the room. Clean crew neckline, soft ring-spun cotton, and a fit that works tucked or loose—pair it with denim, cargos, or layered under a jacket when you want one loud pop of color.',
  },
  2: {
    title: 'Granite Heather',
    price: '$220,00',
    desc: 'Earthy heather with subtle flecks for a worn-in, vintage feel straight off the rack. Mid-weight fabric holds its shape wash after wash—ideal for weekends, studio days, or anywhere you want effortless texture without shouting.',
  },
  3: {
    title: 'Sunbeam Standard',
    price: '$240,00',
    desc: 'Bright golden yellow that lifts neutrals and cheers up all-black fits. Breathable jersey with a smooth hand; wear it solo on sunny days or as the optimistic layer under open shirts and hoodies.',
  },
  4: {
    title: 'Solar Oversized',
    price: '$300,00',
    desc: 'Roomy drop-shoulder cut in the same sunny palette—extra drape, extra ease. Built for relaxed silhouettes and streetwear proportions; great with bike shorts, wide trousers, or layered over a long tee.',
  },
  5: {
    title: 'Midnight Essential',
    price: '$390,00',
    desc: 'Deep black, minimal branding, maximum mileage. Premium cotton with a dense hand so it stays sharp—your default for evenings out, travel, or monochrome stacks where fit and fabric do the talking.',
  },
  6: {
    title: 'Golden Fleck',
    price: '$340,00',
    desc: 'Speckled knit that mixes warm yellow with tonal dots for depth and personality. A conversation starter that still plays nice with basics—think festivals, coffee runs, or anytime plain tees feel too quiet.',
  },
  7: {
    title: 'Trailhead Organic',
    price: '$240,00',
    desc: 'Warm natural shade inspired by bark and trail dust—organic cotton with a soft, matte finish. Versatile with olive, cream, or charcoal; equally at home on a hike, at a desk, or layered under flannel when the temperature drops.',
  },
}

const PRODUCT_IMAGES: Record<number, string> = {
  1: '/BUntitled.png',
  2: '/GUntitled.png',
  3: '/OUntitled.png',
  4: '/PUntitled.png',
  5: '/Untitled.png',
  6: '/VUntitled.png',
  7: '/WUntitled.png',
}

export default function ProductGrid() {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const main = mainRef.current
    if (!main) return

    // ── DOM refs (mirrors the original Grid constructor) ───────────────────
    const dom = main.querySelector<HTMLDivElement>('.container')!
    const grid = main.querySelector<HTMLDivElement>('.grid')!
    const products = Array.from(main.querySelectorAll<HTMLDivElement>('.product div'))
    const details = main.querySelector<HTMLDivElement>('.details')!
    const detailsThumb = details.querySelector<HTMLDivElement>('.details__thumb')!
    const cross = main.querySelector<HTMLDivElement>('.cross')!

    // ── Mutable state (mirrors the original class fields) ──────────────────
    let isDragging = false
    let SHOW_DETAILS = false
    let draggableInstance: Draggable | null = null
    let currentProduct: HTMLDivElement | null = null
    let originalParent: Element | null = null
    let titles: NodeListOf<HTMLParagraphElement>
    let texts: NodeListOf<HTMLElement>
    let splitTitlesInstance: SplitText | null = null
    let splitTextsInstance: SplitText | null = null
    let intersectionObserver: IntersectionObserver | null = null

    // Collect cleanup callbacks so all event listeners are removed on unmount
    const cleanupFns: Array<() => void> = []

    // ── centerGrid ─────────────────────────────────────────────────────────
    function centerGrid() {
      const gridWidth = grid.offsetWidth
      const gridHeight = grid.offsetHeight
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      const centerX = (windowWidth - gridWidth) / 2
      const centerY = (windowHeight - gridHeight) / 2

      gsap.set(grid, { x: centerX, y: centerY })
    }

    // ── setupDraggable ─────────────────────────────────────────────────────
    function setupDraggable() {
      dom.classList.add('--is-loaded')

      const isMobile = window.innerWidth <= 768
      const boundsBuffer = isMobile ? 100 : 200
      const boundsBufferY = isMobile ? 50 : 100

      draggableInstance = Draggable.create(grid, {
        type: 'x,y',
        bounds: {
          minX: -(grid.offsetWidth - window.innerWidth) - boundsBuffer,
          maxX: boundsBuffer,
          minY: -(grid.offsetHeight - window.innerHeight) - boundsBufferY,
          maxY: boundsBufferY,
        },
        inertia: true,
        allowEventDefault: true,
        edgeResistance: 0.9,
        onDragStart: () => {
          isDragging = true
          grid.classList.add('--is-dragging')
        },
        onDragEnd: () => {
          isDragging = false
          grid.classList.remove('--is-dragging')
        },
      })[0]
    }

    // ── updateBounds ───────────────────────────────────────────────────────
    function updateBounds() {
      if (draggableInstance) {
        const isMobile = window.innerWidth <= 768
        const buffer = isMobile ? 50 : 50

        draggableInstance.vars.bounds = {
          minX: -(grid.offsetWidth - window.innerWidth) - buffer,
          maxX: buffer,
          minY: -(grid.offsetHeight - window.innerHeight) - buffer,
          maxY: buffer,
        }
      }
    }

    // ── handleCursor ───────────────────────────────────────────────────────
    function handleCursor(e: MouseEvent) {
      const isMobile = window.innerWidth <= 768
      if (isMobile) return

      const x = e.clientX
      const y = e.clientY

      gsap.to(cross, {
        x: x - cross.offsetWidth / 2,
        y: y - cross.offsetHeight / 2,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    // ── addEvents ──────────────────────────────────────────────────────────
    function addEvents() {
      const onWheel = (e: WheelEvent) => {
        e.preventDefault()

        const deltaX = -e.deltaX * 7
        const deltaY = -e.deltaY * 7

        const currentX = gsap.getProperty(grid, 'x') as number
        const currentY = gsap.getProperty(grid, 'y') as number

        const newX = currentX + deltaX
        const newY = currentY + deltaY

        const bounds = draggableInstance!.vars.bounds as {
          minX: number
          maxX: number
          minY: number
          maxY: number
        }
        const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX))
        const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY))

        gsap.to(grid, { x: clampedX, y: clampedY, duration: 0.3, ease: 'power3.out' })
      }

      const onResize = () => updateBounds()

      const onMouseMove = (e: MouseEvent) => {
        if (SHOW_DETAILS) handleCursor(e)
      }

      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('resize', onResize)
      window.addEventListener('mousemove', onMouseMove)

      cleanupFns.push(() => {
        window.removeEventListener('wheel', onWheel)
        window.removeEventListener('resize', onResize)
        window.removeEventListener('mousemove', onMouseMove)
      })
    }

    // ── observeProducts ────────────────────────────────────────────────────
    function observeProducts() {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target === currentProduct) return

            if (entry.isIntersecting) {
              gsap.to(entry.target, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' })
            } else {
              gsap.to(entry.target, { opacity: 0, scale: 0.5, duration: 0.5, ease: 'power2.in' })
            }
          })
        },
        { root: null, threshold: 0.1 }
      )

      products.forEach((product) => intersectionObserver!.observe(product))

      cleanupFns.push(() => intersectionObserver?.disconnect())
    }

    // ── flipProduct ────────────────────────────────────────────────────────
    function flipProduct(product: HTMLDivElement) {
      currentProduct = product
      originalParent = product.parentNode as Element

      if (intersectionObserver) intersectionObserver.unobserve(product)

      const state = Flip.getState(product)
      detailsThumb.appendChild(product)
      Flip.from(state, { absolute: true, duration: 1.2, ease: 'power3.inOut' })

      const isMobile = window.innerWidth <= 768
      if (isMobile) {
        gsap.set(cross, { x: '', y: '' })
      }
      gsap.to(cross, { scale: 1, duration: 0.4, delay: 0.5, ease: 'power2.out' })
    }

    // ── unFlipProduct ──────────────────────────────────────────────────────
    // Manual getBoundingClientRect + gsap.set/to return animation.
    // Preserved exactly from the original — do not simplify.
    function unFlipProduct() {
      if (!currentProduct || !originalParent) return

      gsap.to(cross, { scale: 0, duration: 0.4, ease: 'power2.out' })

      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        // Mobile: fade out product, wait for grid to finish animating, then re-append
        const productToReturn = currentProduct
        const parentToReturn = originalParent

        // Fade out the product in details panel
        gsap.to(productToReturn, {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            // Re-append to original parent immediately
            parentToReturn.appendChild(productToReturn)

            // Clear any inline styles
            gsap.set(productToReturn, {
              position: '',
              top: '',
              left: '',
              width: '',
              height: '',
              zIndex: '',
              opacity: 0,
              scale: 0.8,
            })

            // After grid animation settles, fade the product back in
            gsap.to(productToReturn, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: 0.8,
              ease: 'power2.out',
            })
          },
        })

        currentProduct = null
        originalParent = null
      } else {
        // Desktop: original behavior relative to detailsThumb
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        Flip.getState(currentProduct)

        const finalRect = originalParent.getBoundingClientRect()
        const currentRect = currentProduct.getBoundingClientRect()

        gsap.set(currentProduct, {
          position: 'absolute',
          top: currentRect.top - detailsThumb.getBoundingClientRect().top + 'px',
          left: currentRect.left - detailsThumb.getBoundingClientRect().left + 'px',
          width: currentRect.width + 'px',
          height: currentRect.height + 'px',
          zIndex: 10000,
        })

        gsap.to(currentProduct, {
          top: finalRect.top - detailsThumb.getBoundingClientRect().top + 'px',
          left: finalRect.left - detailsThumb.getBoundingClientRect().left + 'px',
          width: finalRect.width + 'px',
          height: finalRect.height + 'px',
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.inOut',
          onComplete: () => {
            originalParent!.appendChild(currentProduct!)

            gsap.set(currentProduct!, {
              position: '',
              top: '',
              left: '',
              width: '',
              height: '',
              zIndex: '',
            })

            currentProduct = null
            originalParent = null
          },
        })
      }
    }

    // ── showDetails ────────────────────────────────────────────────────────
    function showDetails(product: HTMLDivElement) {
      if (SHOW_DETAILS) return
      SHOW_DETAILS = true
      details.classList.add('--is-showing')
      dom.classList.add('--is-details-showing')

      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        gsap.to(dom, { scale: 0.9, opacity: 0.3, duration: 1.2, ease: 'power3.inOut' })
        gsap.to(details, { x: 0, y: 0, duration: 1.2, ease: 'power3.inOut' })
      } else {
        gsap.to(dom, { x: '-50vw', duration: 1.2, ease: 'power3.inOut' })
        gsap.to(details, { x: 0, duration: 1.2, ease: 'power3.inOut' })
      }

      flipProduct(product)

      const id = product.dataset.id
      const title = details.querySelector<HTMLElement>(`[data-title="${id}"]`)
      const text = details.querySelector<HTMLElement>(`[data-desc="${id}"]`)

      if (title) {
        gsap.to(title.querySelectorAll('.char'), {
          y: 0,
          duration: 1.1,
          delay: 0.4,
          ease: 'power3.inOut',
          stagger: 0.025,
        })
      }

      if (text) {
        gsap.to(text.querySelectorAll('.line'), {
          y: 0,
          duration: 1.1,
          delay: 0.4,
          ease: 'power3.inOut',
          stagger: 0.05,
        })
      }
    }

    // ── hideDetails ────────────────────────────────────────────────────────
    function hideDetails() {
      SHOW_DETAILS = false
      dom.classList.remove('--is-details-showing')

      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        gsap.to(dom, {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.inOut',
          onComplete: () => {
            details.classList.remove('--is-showing')
          },
        })
        gsap.to(details, { x: 0, y: '100%', duration: 1.2, delay: 0.3, ease: 'power3.inOut' })
      } else {
        gsap.to(dom, {
          x: 0,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.inOut',
          onComplete: () => {
            details.classList.remove('--is-showing')
          },
        })
        gsap.to(details, { x: '50vw', duration: 1.2, delay: 0.3, ease: 'power3.inOut' })
      }

      unFlipProduct()

      titles.forEach((title) => {
        gsap.to(title.querySelectorAll('.char'), {
          y: '100%',
          duration: 0.6,
          ease: 'power3.inOut',
          stagger: { amount: 0.025, from: 'end' },
        })
      })

      texts.forEach((text) => {
        gsap.to(text.querySelectorAll('.line'), {
          y: '100%',
          duration: 0.6,
          ease: 'power3.inOut',
          stagger: 0.05,
        })
      })
    }

    // ── handleDetails ──────────────────────────────────────────────────────
    function handleDetails() {
      SHOW_DETAILS = false

      titles = details.querySelectorAll<HTMLParagraphElement>('.details__title p')
      texts = details.querySelectorAll<HTMLElement>('.details__body [data-text]')

      splitTitlesInstance = new SplitText(titles, {
        type: 'lines, chars',
        mask: 'lines',
        charsClass: 'char',
      })

      splitTextsInstance = new SplitText(texts, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
      })

      products.forEach((product) => {
        let touchMoved = false

        const onTouchStart = () => { touchMoved = false }
        const onTouchMove = () => { touchMoved = true }

        const onTouchEnd = (e: Event) => {
          if (touchMoved || isDragging) return
          e.stopPropagation()
          e.preventDefault()
          showDetails(product as HTMLDivElement)
        }

        const onClick = (e: Event) => {
          if (isDragging) return
          e.stopPropagation()
          showDetails(product as HTMLDivElement)
        }

        product.addEventListener('touchstart', onTouchStart, { passive: true })
        product.addEventListener('touchmove', onTouchMove, { passive: true })
        product.addEventListener('touchend', onTouchEnd)
        product.addEventListener('click', onClick)

        cleanupFns.push(() => {
          product.removeEventListener('touchstart', onTouchStart)
          product.removeEventListener('touchmove', onTouchMove)
          product.removeEventListener('touchend', onTouchEnd)
          product.removeEventListener('click', onClick)
        })
      })

      const onDomClick = () => {
        if (SHOW_DETAILS) hideDetails()
      }
      dom.addEventListener('click', onDomClick)
      cleanupFns.push(() => dom.removeEventListener('click', onDomClick))

      const onCrossClick = () => {
        if (SHOW_DETAILS) hideDetails()
      }
      const onCrossTouch = (e: Event) => {
        e.stopPropagation()
        if (SHOW_DETAILS) hideDetails()
      }
      cross.addEventListener('click', onCrossClick)
      cross.addEventListener('touchend', onCrossTouch)
      cleanupFns.push(() => {
        cross.removeEventListener('click', onCrossClick)
        cross.removeEventListener('touchend', onCrossTouch)
      })
    }

    // ── intro ──────────────────────────────────────────────────────────────
    function intro() {
      centerGrid()

      const timeline = gsap.timeline()

      timeline.set(dom, { scale: 0.5 })
      timeline.set(products, { scale: 0.5, opacity: 0 })

      timeline.to(products, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: { amount: 1.2, from: 'random' },
      })

      timeline.to(dom, {
        scale: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => {
          setupDraggable()
          addEvents()
          observeProducts()
          handleDetails()
        },
      })
    }

    // ── Bootstrap: preload images, then run intro ──────────────────────────
    const imgLoader = imagesLoaded(main.querySelectorAll<HTMLImageElement>('.grid img'))
    imgLoader.on('always', () => {
      intro()
      document.body.classList.remove('loading')
    })

    // ── Cleanup on unmount ─────────────────────────────────────────────────
    return () => {
      cleanupFns.forEach((fn) => fn())
      gsap.killTweensOf([dom, grid, details, cross, ...products])
      splitTitlesInstance?.revert()
      splitTextsInstance?.revert()
      draggableInstance?.kill()
    }
  }, [])

  return (
    <main ref={mainRef}>
      <header className="site-header">
        <a href="/" className="site-header__brand" aria-label="Home">
          <img src="/logos/text.svg" alt="" className="site-header__logo" width={529} height={137} />
        </a>
      </header>

      <div className="container">
        <div className="grid">
          {COLUMNS.map((ids, colIdx) => (
            <div key={colIdx} className="column">
              {ids.map((id, itemIdx) => (
                <div key={`${colIdx}-${itemIdx}`} className="product">
                  <div data-id={id}>
                    <Image
                      src={PRODUCT_IMAGES[id]}
                      alt={PRODUCTS[id]?.title ?? `Product ${id}`}
                      fill
                      sizes="(max-width: 600px) 90vw, 25vw"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="details">
        <div className="details__title">
          {Object.entries(PRODUCTS).map(([id, { title }]) => (
            <p key={id} data-title={id} data-text="">
              {title}
            </p>
          ))}
        </div>
        <div className="details__body">
          <div className="details__thumb" />
          <div className="details__texts">
            {Object.entries(PRODUCTS).map(([id, { price, desc }]) => (
              <p key={id} data-desc={id} data-text="">
                <span>{price}</span>
                {desc}
                <button type="button">Add to cart</button>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="cross">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18"
            stroke="#313131"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 6L18 18"
            stroke="#313131"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </main>
  )
}
