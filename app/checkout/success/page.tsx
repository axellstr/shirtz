'use client'

import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <main className="checkout checkout--empty">
      <header className="site-header">
        <Link href="/" className="site-header__brand" aria-label="Home">
          <img src="/logos/text.svg" alt="" className="site-header__logo" width={529} height={137} />
        </Link>
      </header>

      <div className="checkout__inner">
        <div className="checkout__done">
          <p className="checkout__done-title">Order received</p>
          <p className="checkout__done-copy">
            Thanks for shopping Shirtz. Stripe sent you back after a completed Checkout session.
          </p>
          <Link href="/" className="checkout__back-link">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
