import Image from "next/image";
import Link from "next/link";
import { formatPrice, getFeaturedProducts } from "@/lib/products";

const categories = [
  { name: "Football", caption: "Pitch-ready", style: "bg-[#ff684f]" },
  { name: "Basketball", caption: "Court control", style: "bg-[#3757df] text-white" },
  { name: "Training", caption: "Everyday movement", style: "bg-[#d8ff35]" },
];

export default function MarketplaceLanding() {
  const featuredProducts = getFeaturedProducts().slice(0, 3);

  return (
    <div className="overflow-hidden bg-[#f6f4ee] text-[#202024]">
      <section className="relative isolate min-h-[650px] overflow-hidden bg-[#d8ff35] px-5 py-16 sm:px-8 sm:py-24 lg:min-h-[720px] lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] sm:text-xs">UniSport / Campus marketplace</p>
          <div className="relative z-10 mt-12 max-w-5xl lg:mt-16">
            <h1 className="max-w-4xl text-6xl font-black leading-[0.84] tracking-[-0.075em] sm:text-7xl lg:text-[8.3rem]">
              Your campus.<br />Your kit. <span className="font-serif font-normal italic">Your game.</span>
            </h1>
            <div className="mt-10 flex max-w-lg flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xs text-sm font-medium leading-6 sm:text-base">Buy and sell the gear that keeps campus moving — from your next pair of boots to a ball for match day.</p>
              <Link href="/shop" className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[#202024] text-2xl transition-transform hover:translate-y-1" aria-label="Explore the shop">↓</Link>
            </div>
          </div>
          <div className="absolute bottom-[-4rem] right-[-6rem] h-72 w-72 rounded-full bg-[#ff684f] sm:bottom-[-8rem] sm:right-[8%] sm:h-[28rem] sm:w-[28rem]" />
          <div className="absolute right-[6%] top-24 hidden h-28 w-28 rounded-full bg-[#3757df] lg:block" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:px-12 lg:py-28">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em]">01 / Made for students</p>
        <div>
          <h2 className="max-w-3xl text-4xl font-black leading-[.92] tracking-[-0.06em] sm:text-5xl lg:text-7xl">The easiest way to find the gear you&apos;ll actually use.</h2>
          <p className="mt-8 max-w-xl text-base leading-7 text-[#55545a] sm:text-lg">Discover trusted campus sellers, official sportswear, and pre-loved essentials. Pick up nearby or have it delivered — all in one place.</p>
          <Link href="/sell" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#202024] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#3757df]">Start selling <span aria-hidden>↗</span></Link>
        </div>
      </section>

      <section className="bg-[#202024] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#d8ff35]">02 / Shop by sport</p><h2 className="mt-5 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Find your field.</h2></div>
            <Link href="/shop" className="text-sm font-bold text-[#d8ff35] hover:text-white">View all gear →</Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} href={`/shop?sport=${category.name}`} className={`group flex min-h-72 flex-col justify-between p-6 transition-transform hover:-translate-y-2 ${category.style}`}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]">{category.caption}</span>
                <div className="flex items-end justify-between"><h3 className="text-4xl font-black tracking-[-0.06em]">{category.name}</h3><span className="text-3xl transition-transform group-hover:translate-x-1">↗</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em]">03 / Fresh on campus</p><h2 className="mt-5 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Good gear, ready to go.</h2></div><Link href="/shop" className="text-sm font-bold underline decoration-2 underline-offset-4">Shop all products</Link></div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group">
              <div className={`relative aspect-[4/4.5] overflow-hidden ${index === 0 ? "bg-[#ff684f]" : index === 1 ? "bg-[#d8ff35]" : "bg-[#3757df]"}`}>
                <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-[#f6f4ee] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#202024]">{product.condition}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#77757a]">{product.sport} / {product.brand}</p><h3 className="mt-1 text-xl font-extrabold tracking-[-0.04em]">{product.title}</h3></div><p className="whitespace-nowrap text-sm font-bold">{formatPrice(product.price)}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#ff684f] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em]">04 / Your next move</p><h2 className="mt-6 max-w-4xl text-5xl font-black leading-[.88] tracking-[-0.07em] sm:text-7xl lg:text-8xl">Clear out your locker. <span className="font-serif font-normal italic">Fund your next win.</span></h2></div>
          <div><p className="max-w-sm text-base font-medium leading-7">Turn the gear you no longer need into money for the things you do. Listing takes minutes.</p><Link href="/sell" className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#202024] px-6 py-3.5 text-sm font-bold transition hover:bg-[#202024] hover:text-white">Sell your gear <span aria-hidden>↗</span></Link></div>
        </div>
      </section>
    </div>
  );
}
