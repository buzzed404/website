import { useState } from "react";
import StarRating from "../ui/StarRating";
import Field from "../ui/Field";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as reviewService from "../../services/reviewService";
import "./product.css";

export default function ReviewForm({ productId, onSubmitted }) {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !title.trim() || !body.trim()) {
      showToast("Please fill in a rating, title and review.", { type: "error" });
      return;
    }
    setSubmitting(true);
    const review = await reviewService.addReview({
      productId,
      author: session?.name || "Guest Shopper",
      rating,
      title: title.trim(),
      body: body.trim(),
    });
    setSubmitting(false);
    setRating(0);
    setTitle("");
    setBody("");
    showToast("Thanks for your review!");
    onSubmitted?.(review);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
      <div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
          Your Rating
        </span>
        <div style={{ marginTop: "8px" }}>
          <StarRating value={rating} onChange={setRating} readOnly={false} size="lg" />
        </div>
      </div>
      <Field label="Review Title" id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sums it up in a few words" />
      <Field label="Your Review" id="review-body" as="textarea" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What did you like or dislike?" />
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
