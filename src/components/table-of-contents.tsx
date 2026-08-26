import type { ReactNode } from 'react';

export interface TableOfContentsItem {
  id: string;
  label: string;
}

export function headingText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(headingText).join('');
  return '';
}

export function headingId(children: ReactNode): string {
  return headingText(children)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function tableOfContents(markdown: string): TableOfContentsItem[] {
  return Array.from(markdown.matchAll(/^##\s+(.+)$/gm)).map((match) => ({
    id: headingId(match[1]),
    label: match[1].replace(/[*_`]/g, ''),
  }));
}

export function TableOfContents({ items, locale }: { items: TableOfContentsItem[]; locale: 'vi' | 'en' }) {
  if (items.length === 0) return null;

  return (
    <nav className="table-of-contents" aria-label={locale === 'vi' ? 'Mục lục tài liệu' : 'Document contents'}>
      <p>{locale === 'vi' ? 'Trong tài liệu này' : 'In this document'}</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
