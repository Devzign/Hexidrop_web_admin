import { Outlet } from "react-router-dom";
import { SiteNav } from "@/components/public/SiteNav";
import { SiteFooter } from "@/components/public/SiteFooter";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export default PublicLayout;
