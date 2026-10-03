import Button from './Button.jsx';

export default function Modal({ title, children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </header>
        {children}
      </section>
    </div>
  );
}

