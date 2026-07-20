import { useState, type ReactNode } from 'react';
import { Icon, LuChevronDown, LuChevronRight } from '../lib/icons';

interface AccordionProps {
  /** 아이콘 레지스트리 키 */
  icon: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Accordion({ icon, title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`accordion${open ? ' open' : ''}`}>
      <button className="accordion-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="accordion-emoji"><Icon name={icon} size={20} /></span>
        <span className="accordion-title">{title}</span>
        <span className="accordion-chevron">
          {open ? <LuChevronDown size={18} /> : <LuChevronRight size={18} />}
        </span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </section>
  );
}
