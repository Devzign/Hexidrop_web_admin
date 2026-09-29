import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component:
 * Listens to route changes across the entire app and ensures every newly
 * loaded screen starts at the top (scrollY: 0, scrollX: 0), fixing the issue
 * where clicking navigation links from the bottom of a page leaves the user
 * stuck at the bottom of the next screen.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If navigation targets an in-page anchor (e.g. #faq or #pricing), scroll to that element
    if (hash) {
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Instantly scroll window, document and body to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });

    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });

    document.body.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });

    // Also reset any scrollable main containers
    const mainEl = document.querySelector("main");
    if (mainEl && mainEl.scrollTop > 0) {
      mainEl.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;
