import { Outlet, ScrollRestoration } from "react-router-dom";
import { SiteNav } from "@/components/public/SiteNav";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollRestoration />
      <ScrollToTop />
      <SiteNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export default PublicLayout;
