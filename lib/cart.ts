import { create } from 'zustand'

export type CartItem = {
  productId: number
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: number, size: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.size === item.size
      )

      if (existing) {
        const updated = state.items.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
        console.log('[Cart] Incremented quantity:', updated.find(
          (i) => i.productId === item.productId && i.size === item.size
        ))
        return { items: updated }
      }

      const newItem: CartItem = { ...item, quantity: 1 }
      console.log('[Cart] Added new item:', newItem)
      return { items: [...state.items, newItem] }
    })
  },

  removeItem: (productId, size) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.size === size)
      ),
    }))
  },

  clearCart: () => set({ items: [] }),
}))
