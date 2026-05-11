export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL'

export type Product = {
  id: number
  name: string
  price: number
  description: string
  image: string
  sizes: Size[]
}

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL']

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Crimson Crew',
    price: 300,
    description:
      'A saturated red tee that reads confident from across the room. Clean crew neckline, soft ring-spun cotton, and a fit that works tucked or loose—pair it with denim, cargos, or layered under a jacket when you want one loud pop of color.',
    image: '/BUntitled.png',
    sizes: ALL_SIZES,
  },
  {
    id: 2,
    name: 'Granite Heather',
    price: 220,
    description:
      'Earthy heather with subtle flecks for a worn-in, vintage feel straight off the rack. Mid-weight fabric holds its shape wash after wash—ideal for weekends, studio days, or anywhere you want effortless texture without shouting.',
    image: '/GUntitled.png',
    sizes: ALL_SIZES,
  },
  {
    id: 3,
    name: 'Sunbeam Standard',
    price: 240,
    description:
      'Bright golden yellow that lifts neutrals and cheers up all-black fits. Breathable jersey with a smooth hand; wear it solo on sunny days or as the optimistic layer under open shirts and hoodies.',
    image: '/OUntitled.png',
    sizes: ALL_SIZES,
  },
  {
    id: 4,
    name: 'Solar Oversized',
    price: 300,
    description:
      'Roomy drop-shoulder cut in the same sunny palette—extra drape, extra ease. Built for relaxed silhouettes and streetwear proportions; great with bike shorts, wide trousers, or layered over a long tee.',
    image: '/PUntitled.png',
    sizes: ALL_SIZES,
  },
  {
    id: 5,
    name: 'Midnight Essential',
    price: 390,
    description:
      'Deep black, minimal branding, maximum mileage. Premium cotton with a dense hand so it stays sharp—your default for evenings out, travel, or monochrome stacks where fit and fabric do the talking.',
    image: '/Untitled.png',
    sizes: ALL_SIZES,
  },
  {
    id: 6,
    name: 'Golden Fleck',
    price: 340,
    description:
      'Speckled knit that mixes warm yellow with tonal dots for depth and personality. A conversation starter that still plays nice with basics—think festivals, coffee runs, or anytime plain tees feel too quiet.',
    image: '/VUntitled.png',
    sizes: ALL_SIZES,
  },
  {
    id: 7,
    name: 'Trailhead Organic',
    price: 240,
    description:
      'Warm natural shade inspired by bark and trail dust—organic cotton with a soft, matte finish. Versatile with olive, cream, or charcoal; equally at home on a hike, at a desk, or layered under flannel when the temperature drops.',
    image: '/WUntitled.png',
    sizes: ALL_SIZES,
  },
]
