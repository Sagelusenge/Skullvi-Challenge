export default function Loader({ label = 'Loading' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-dot" />
      {label}
    </div>
  );
}

