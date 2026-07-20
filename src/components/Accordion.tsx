import { useState, type ReactNode } from 'react';

interface AccordionProps {
  emoji: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Accordion({ emoji, title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`accordion${open ? ' open' : ''}`}>
      <button className="accordion-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="accordion-emoji" aria-hidden>{emoji}</span>
        <span className="accordion-title">{title}</span>
        <span className="accordion-chevron" aria-hidden>{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </section>
  );
}
