import seedReviews from "../data/reviews.mock.json";
import { readStorage, writeStorage } from "./storage";

const KEY = "reviews";

function seedIfEmpty() {
  const existing = readStorage(KEY, null);
  if (!existing) {
    writeStorage(KEY, seedReviews);
    return seedReviews;
  }
  return existing;
}

export async function getReviewsByProduct(productId) {
  const reviews = seedIfEmpty();
  return reviews.filter((r) => r.productId === productId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addReview(review) {
  const reviews = seedIfEmpty();
  const newReview = {
    ...review,
    id: `r${String(Date.now()).slice(-6)}`,
    date: new Date().toISOString().slice(0, 10),
  };
  writeStorage(KEY, [...reviews, newReview]);
  return newReview;
}
