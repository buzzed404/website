import "./ui.css";

export default function Field({ label, id, error, as = "input", children, ...rest }) {
  const Tag = as;
  return (
    <div className={`field ${error ? "field--invalid" : ""}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {as === "select" ? (
        <select id={id} {...rest}>
          {children}
        </select>
      ) : (
        <Tag id={id} {...rest} />
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
