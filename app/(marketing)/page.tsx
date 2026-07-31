import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BenefitsSection from "@/components/home/BenefitsSection";
import Newsletter from "@/components/home/Newsletter";
import { getFeaturedProducts, getTrendingProducts, formatPrice } from "@/lib/products";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const trendingProducts = getTrendingProducts();

  return (
    <div className="space-y-24 py-8 md:py-12">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <BenefitsSection />
      <Newsletter />
      <section className="space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Trending picks</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                What students are adding now
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Browse top rated gear curated for campus athletes and fitness lifestyles.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {trendingProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 transition hover:border-slate-700"
              >
                <div className="relative overflow-hidden rounded-3xl bg-slate-800 pb-[75%]">
                  <Image
                    src={product.image}
                    alt={product.title ?? "Product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-sky-300">
                    <span>{product.category}</span>
                    <span>•</span>
                    {product.campusPickup && <span>Campus pickup</span>}
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-sky-400 transition-colors">{product.title}</h3>
                  <p className="text-sm leading-6 text-slate-400 line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span className="font-semibold text-white">{formatPrice(product.price)}</span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{product.rating.toFixed(1)} ★</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
