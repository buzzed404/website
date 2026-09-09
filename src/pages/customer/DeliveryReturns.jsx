import "../pages.css";

const SECTIONS = [
  {
    id: "shipping",
    title: "Shipping",
    body: (
      <>
        <p>We ship across India via trusted courier partners. Orders are processed within 1–2 business days.</p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          <li>Standard delivery: 3–6 business days</li>
          <li>Express delivery: 1–3 business days (select cities)</li>
          <li>Free standard shipping on orders over ₹2,999</li>
        </ul>
      </>
    ),
  },
  {
    id: "returns",
    title: "Returns",
    body: (
      <>
        <p>Not the right fit? We offer a 7-day return window from the date of delivery.</p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          <li>Items must be unworn, unwashed, with tags attached</li>
          <li>Refunds are processed within 5–7 business days of receiving the return</li>
          <li>Sale items are final and not eligible for return</li>
        </ul>
      </>
    ),
  },
  {
    id: "exchanges",
    title: "Exchanges",
    body: <p>Need a different size or colour? Request an exchange from your order history in your account, and we'll ship the replacement once the original is received.</p>,
  },
  {
    id: "tracking",
    title: "Order Tracking",
    body: <p>Once your order ships, you'll receive a tracking link by email. You can also check order status anytime from your account dashboard.</p>,
  },
];

export default function DeliveryReturns() {
  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Support</span>
          <h1 className="section-heading">Delivery &amp; Returns</h1>
        </div>
      </div>

      <div className="info-page">
        <nav>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>
        <div>
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="info-block">
              <h3>{s.title}</h3>
              {s.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
