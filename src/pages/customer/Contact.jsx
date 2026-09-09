import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { ChevronDownIcon } from "../../components/ui/Icons";
import { isRequired, isValidEmail } from "../../utils/validators";
import { useToast } from "../../context/ToastContext";
import "../pages.css";

const FAQS = [
  { q: "How long does shipping take?", a: "Standard delivery takes 3–6 business days across India. See our Delivery & Returns page for full details." },
  { q: "What's your return policy?", a: "We accept returns within 7 days of delivery for unworn, tagged items. Sale items are final sale." },
  { q: "Do you ship internationally?", a: "Not yet — we currently ship within India only, with international shipping planned for a future drop." },
  { q: "How do I track my order?", a: "You'll get a tracking link by email once your order ships, or check status anytime in your account dashboard." },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-item__question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {faq.q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon width={18} height={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-item__answer"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <p>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!isRequired(form.name)) next.name = "Required";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email";
    if (!isRequired(form.message)) next.message = "Required";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      showToast("Message sent — we'll get back to you soon.");
    }
  };

  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Contact</span>
          <h1 className="section-heading">Get In Touch</h1>
        </div>
      </div>

      <div className="contact-layout">
        {sent ? (
          <p style={{ gridArea: "name", color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>
            ✓ Thanks — your message has been received.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            <div style={{ gridArea: "name" }}>
              <Field label="Name" id="contact-name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ gridArea: "email" }}>
              <Field label="Email" id="contact-email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ gridArea: "message" }}>
              <Field label="Message" id="contact-message" as="textarea" rows={5} value={form.message} error={errors.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <div style={{ gridArea: "button" }}>
              <Button type="submit" variant="primary">
                Send Message
              </Button>
            </div>
          </form>
        )}

        <div className="contact-info-row" style={{ gridArea: "info-email" }}>
          <div>
            <strong>Email</strong>
            <p style={{ color: "var(--color-text-muted)" }}>buzzed.404@gmail.com</p>
          </div>
        </div>
        <div className="contact-info-row" style={{ gridArea: "info-hours" }}>
          <div>
            <strong>Hours</strong>
            <p style={{ color: "var(--color-text-muted)" }}>24 × 7</p>
          </div>
        </div>
        <div className="contact-info-row" style={{ gridArea: "info-studio" }}>
          <div>
            <strong>Studio</strong>
            <p style={{ color: "var(--color-text-muted)" }}>Buzzed404, CRC Road, Yogalsal, K. Kannapuram</p>
          </div>
        </div>
      </div>

      <div id="faq" style={{ marginTop: "var(--space-9)" }}>
        <div className="section-header">
          <div>
            <span className="eyebrow">// FAQ</span>
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>
        </div>
        <div>
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} faq={faq} />
          ))}
        </div>
      </div>
    </div>
  );
}
