import { Link } from "react-router-dom";
import "./ui.css";

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  children,
  ...rest
}) {
  const classes = `btn btn--${variant} ${size === "sm" ? "btn--sm" : ""} ${full ? "btn--full" : ""} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const Component = as || "button";
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
