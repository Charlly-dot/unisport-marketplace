"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Star,
  Package,
  Clock,
  MapPin,
  MessageCircle,
} from "lucide-react";
import type { Seller } from "@/types/product";

interface SellerCardProps {
  seller: Seller;
}

export default function SellerCard({ seller }: SellerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/60 p-6 space-y-5"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-700">
          <Image
            src={seller.avatar}
            alt={seller.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white truncate">
              {seller.name}
            </h3>
            {seller.verified && (
              <CheckCircle2 size={16} className="flex-shrink-0 text-sky-400" />
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-white">
              {seller.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/50 px-3.5 py-2.5">
          <Package size={15} className="flex-shrink-0 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Items Sold</p>
            <p className="text-sm font-semibold text-white">{seller.itemsSold}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/50 px-3.5 py-2.5">
          <Clock size={15} className="flex-shrink-0 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Response Time</p>
            <p className="text-sm font-semibold text-white">{seller.responseTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/50 px-3.5 py-2.5">
          <MapPin size={15} className="flex-shrink-0 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Campus</p>
            <p className="text-sm font-semibold text-white truncate">{seller.campus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/60 bg-slate-950/50 px-3.5 py-2.5">
          <Clock size={15} className="flex-shrink-0 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Member Since</p>
            <p className="text-sm font-semibold text-white">{seller.memberSince}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white"
      >
        <MessageCircle size={16} />
        View Seller
      </button>
    </motion.div>
  );
}
