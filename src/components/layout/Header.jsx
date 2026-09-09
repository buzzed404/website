import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND_NAME, NAV_LINKS } from "../../utils/constants";
import { SearchIcon, UserIcon, HeartIcon, BagIcon, MenuIcon, CloseIcon } from "../ui/Icons";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import * as productService from "../../services/productService";
import CartDrawer from "../cart/CartDrawer";
import WishlistDrawer from "../cart/WishlistDrawer";
import MobileMenu from "./MobileMenu";
import ProductVisual from "../product/ProductVisual";
import PriceTag from "../ui/PriceTag";
import "./layout.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { itemCount } = useCart();
  const { productIds } = useWishlist();
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      productService.searchProducts(query).then((data) => setResults(data.slice(0, 6)));
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      setResults([]);
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (!cartOpen && !wishlistOpen) document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const accountLink = session?.role === "admin" ? "/admin/dashboard" : "/account";

  return (
    <>
      <div className="announcement-bar">Free shipping on orders over ₹2,999 // Drop 001 is live</div>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="container site-header__inner">
          <button className="hamburger icon-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>

          <Link to="/" className="site-header__logo">
            BUZZ<span>ED</span>.404
          </Link>

          <nav className="site-header__nav">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <SearchIcon />
            </button>
            <Link to={accountLink} className="icon-btn" aria-label="Account">
              <UserIcon />
            </Link>
            <button className="icon-btn" onClick={() => setWishlistOpen(true)} aria-label="Wishlist">
              <HeartIcon />
              {productIds.length > 0 && <span className="icon-btn__count">{productIds.length}</span>}
            </button>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              <BagIcon />
              {itemCount > 0 && <span className="icon-btn__count">{itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              className="search-overlay__box"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
            >
              <form className="search-overlay__input-row" onSubmit={handleSearchSubmit}>
                <SearchIcon />
                <input
                  autoFocus
                  type="search"
                  placeholder="Search hoodies, tees, drops..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="button" className="icon-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <CloseIcon />
                </button>
              </form>
              <div className="search-overlay__results">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="search-result-row"
                    onClick={() => setSearchOpen(false)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: 48 }}>
                        <ProductVisual category={product.category} sku={product.sku} size="sm" />
                      </div>
                      <span>{product.name}</span>
                    </div>
                    <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
                  </Link>
                ))}
                {query.trim() && results.length === 0 && (
                  <p style={{ color: "var(--color-text-muted)", padding: "12px" }}>No products match “{query}”.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  );
}
