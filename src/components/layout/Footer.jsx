import { Link } from "react-router-dom";
import { FOOTER_LINKS, SOCIAL_LINKS } from "../../utils/constants";
import { InstagramIcon, XIcon, TiktokIcon, YoutubeIcon } from "../ui/Icons";
import NewsletterSignup from "./NewsletterSignup";
import "./layout.css";

const SOCIAL_ICON = { instagram: InstagramIcon, x: XIcon, tiktok: TiktokIcon, youtube: YoutubeIcon };

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container newsletter-footer">
        <NewsletterSignup variant="footer" />
      </div>
      <div className="container footer-top">
        <div className="footer-col footer-brand">
          <Link to="/" className="site-header__logo">
            BUZZ<span style={{ color: "var(--color-accent)" }}>ED</span>.404
          </Link>
          <p>Buzzed by nature. 404 by choice. Unisex streetwear for the perpetually offline.</p>
          <div className="footer-socials">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICON[social.icon];
              return (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div className="footer-col" key={title}>
            <h4>{title}</h4>
            <ul>
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BUZZED.404 // SS1. All rights reserved.</span>
        <div className="payment-icons">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>UPI</span>
          <span>PAYPAL</span>
        </div>
      </div>
    </footer>
  );
}
