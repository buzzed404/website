import StarRating from "../ui/StarRating";
import { formatDate } from "../../utils/format";
import "./product.css";

export default function ReviewList({ reviews, rating, reviewCount }) {
  if (!reviews.length) {
    return (
      <div className="empty-state">
        <h3>No reviews yet</h3>
        <p>Be the first to share what you think.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="review-summary">
        <span className="review-summary__score">{rating.toFixed(1)}</span>
        <div>
          <StarRating value={rating} size="lg" />
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--fs-sm)", marginTop: "4px" }}>
            Based on {reviewCount} reviews
          </p>
        </div>
      </div>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-card__header">
              <span className="review-card__author">{review.author}</span>
              <span className="review-card__date">{formatDate(review.date)}</span>
            </div>
            <StarRating value={review.rating} />
            <strong>{review.title}</strong>
            <p style={{ color: "var(--color-text-muted)" }}>{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
