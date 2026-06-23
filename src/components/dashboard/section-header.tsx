import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  linkLabel: string;
  linkHref: string;
};

export function SectionHeader({
  title,
  linkLabel,
  linkHref,
}: SectionHeaderProps) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <h2 className="truncate text-[12px] font-semibold tracking-wide text-text-primary">
        {title}
      </h2>
      <Link
        href={linkHref}
        className="shrink-0 whitespace-nowrap text-[11px] font-medium text-brand-text hover:text-brand"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
