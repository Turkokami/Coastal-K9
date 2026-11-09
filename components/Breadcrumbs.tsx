import Link from 'next/link';
export default function Breadcrumbs({ crumbs }: { crumbs: { label: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs wrap">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.href}>{i < crumbs.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}
