export const BRAND_NAME = "BUZZED.404";

export const CATEGORIES = ["Hoodies", "Tees", "Sweatshirts", "Bottoms", "Accessories"];

export const NAV_LINKS = [
  { label: "Shop All", to: "/shop" },
  { label: "Hoodies", to: "/shop/Hoodies" },
  { label: "Tees", to: "/shop/Tees" },
  { label: "Bottoms", to: "/shop/Bottoms" },
  { label: "Offers", to: "/offers" },
];

export const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", to: "/shop" },
    { label: "New Arrivals", to: "/shop?sort=newest" },
    { label: "Offers", to: "/offers" },
    { label: "Wishlist", to: "/wishlist" },
  ],
  Support: [
    { label: "Contact Us", to: "/contact" },
    { label: "Delivery & Returns", to: "/delivery-returns" },
    { label: "FAQs", to: "/contact#faq" },
    { label: "Track Order", to: "/account" },
  ],
  Company: [
    { label: "Our Story", to: "/#brand-story" },
    { label: "Admin", to: "/admin/login" },
  ],
};

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
];

export const ADMIN_DEMO_CREDENTIALS = {
  email: "admin@buzzed404.com",
  password: "admin123",
};

export const ORDER_STATUSES = ["Pending", "Packed", "Shipped", "Delivered"];

export const COLOR_SWATCHES = {
  Black: "#0c0c0c",
  White: "#f5fbf9",
  Olive: "#4b5a3f",
  Charcoal: "#39433f",
};
