import { Topbar } from "@/components/layout/topbar";

type PlaceholderPageProps = {
  title: string;
  subtitle: string;
};

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <div className="flex-1 px-5 py-4">
        <p className="text-sm text-text-secondary">Em breve.</p>
      </div>
    </>
  );
}
