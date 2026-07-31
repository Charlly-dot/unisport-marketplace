import reviewsData from "@/data/reviews.json";
import sellersData from "@/data/sellers.json";
import type { Review, Seller } from "@/types/product";

export const reviews: Review[] = reviewsData as Review[];
export const sellers: Seller[] = sellersData as Seller[];

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getSellerByName(name: string): Seller | undefined {
  return sellers.find((s) => s.name === name);
}

export function getAverageRating(productId: string): number {
  const productReviews = getReviewsByProductId(productId);
  if (!productReviews.length) return 0;
  return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
}
