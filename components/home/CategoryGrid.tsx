import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

const categories = [
  { title: "Apparel", description: "Official jerseys, training wear, and hoodies.", tag: "Popular" },
  { title: "Footwear", description: "Running, training, and lifestyle sneakers.", tag: "New" },
  { title: "Equipment", description: "Balls, weights, and accessories for every sport.", tag: "Campus" },
];

export default function CategoryGrid() {
  return (
    <section className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Campus categories</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Shop by student essentials</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">Find gear for practice, game day, recovery, and campus lifestyle in one place.</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.title} className="group overflow-hidden p-6 transition hover:-translate-y-1 hover:bg-slate-900/95">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{category.description}</p>
                </div>
                <Badge variant="secondary">{category.tag}</Badge>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-sky-300 transition group-hover:text-sky-200">
                <span>Browse</span>
                <ArrowRight size={16} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}