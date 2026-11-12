export default function Loading({ text = 'Sila tunggu sebentar…' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
