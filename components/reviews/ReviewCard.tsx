"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ThumbsUp, CheckCircle2 } from "lucide-react";
import type { Review } from "@/types/product";

interface ReviewCardProps {
  review: Review;
  index: number;
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasHelped, setHasHelped] = useState(false);

  const handleHelpful = () => {
    if (!hasHelped) {
      setHelpfulCount((c) => c + 1);
      setHasHelped(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/60 p-6 space-y-4"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-slate-700">
          <Image
            src={review.avatar}
            alt={review.studentName}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">
              {review.studentName}
            </p>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 size={12} />
                <span className="hidden sm:inline">Verified Student</span>
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-700 text-slate-700"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {new Date(review.date).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-7 text-slate-300">{review.review}</p>

      <button
        type="button"
        onClick={handleHelpful}
        disabled={hasHelped}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ThumbsUp size={14} className={hasHelped ? "fill-sky-400 text-sky-400" : ""} />
        Helpful ({helpfulCount})
      </button>
    </motion.div>
  );
}
