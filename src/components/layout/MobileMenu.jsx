import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import { useEffect } from "react";
import { NAV_LINKS, BRAND_NAME } from "../../utils/constants";
import { CloseIcon } from "../ui/Icons";
import { useAuth } from "../../context/AuthContext";
import "./layout.css";

export default function MobileMenu({ open, onClose }) {
  const { session } = useAuth();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="mobile-menu__backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <button className="mobile-menu__close" onClick={onClose} aria-label="Close menu">
              <CloseIcon />
            </button>
            <nav>
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={onClose}>
                  {link.label}
                </NavLink>
              ))}
              <NavLink to={session?.role === "admin" ? "/admin/dashboard" : "/account"} onClick={onClose}>
                {session ? "My Account" : "Sign In"}
              </NavLink>
              <NavLink to="/contact" onClick={onClose}>
                Contact
              </NavLink>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
