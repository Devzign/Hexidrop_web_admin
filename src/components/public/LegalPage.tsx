import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: ReactNode }[];
}) {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Legal
          </div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{updated}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-xl font-extrabold text-foreground">
                {s.heading}
              </h2>
              <div className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
