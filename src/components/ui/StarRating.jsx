import "./ui.css";

function Star({ filled, half }) {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="half-fill">
          <stop offset="50%" stopColor="var(--color-accent)" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.9 6.13 6.6.68-4.9 4.6 1.3 6.6L12 17.6l-5.9 3.1 1.3-6.6-4.9-4.6 6.6-.68z"
        fill={half ? "url(#half-fill)" : filled ? "var(--color-accent)" : "none"}
        stroke={filled || half ? "var(--color-accent)" : "var(--color-text-faint)"}
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default function StarRating({ value = 0, onChange, size = "md", readOnly = true }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating ${size === "lg" ? "star-rating--lg" : ""}`} role="img" aria-label={`Rated ${value} out of 5`}>
      {stars.map((star) => {
        const filled = value >= star;
        const half = !filled && value >= star - 0.5;
        if (readOnly) {
          return <Star key={star} filled={filled} half={half} />;
        }
        return (
          <button key={star} type="button" onClick={() => onChange?.(star)} aria-label={`Rate ${star} stars`}>
            <Star filled={filled} half={false} />
          </button>
        );
      })}
    </div>
  );
}
