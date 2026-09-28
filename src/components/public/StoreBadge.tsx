import { cn } from "@/lib/utils";

export interface StoreBadgeProps {
  store: "apple" | "google";
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function StoreBadge({
  store,
  className,
  href = "#",
  size = "md",
}: StoreBadgeProps) {
  const isApple = store === "apple";

  const sizeClasses = {
    sm: "gap-2.5 px-4 py-2",
    md: "gap-3 px-5 py-2.5",
    lg: "gap-3.5 px-6 py-3.5",
  }[size];

  const iconClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6 sm:h-7 sm:w-7",
    lg: "h-7 w-7 sm:h-8 sm:w-8",
  }[size];

  const topTextClasses = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
  }[size];

  const bottomTextClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={isApple ? "Download on the App Store" : "Get it on Google Play"}
      className={cn(
        "group inline-flex items-center rounded-full border border-white/20 bg-black/45 backdrop-blur-md transition-all duration-200 hover:bg-black/65 hover:border-white/40 hover:scale-[1.02] shadow-sm select-none",
        sizeClasses,
        className
      )}
    >
      {isApple ? (
        <svg
          viewBox="0 0 384 512"
          className={cn(iconClasses, "fill-white shrink-0")}
          aria-hidden="true"
        >
          <path d="M318.7 268c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-92.6zM248.5 82.5c22.2-26.4 20.2-50.4 19.6-59.1-19.7 1.1-42.5 13.4-55.5 28.5-14.3 16.2-22.7 36.2-20.9 58.7 21.3 1.6 40.7-9.4 56.8-28.1z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 512 512"
          className={cn(iconClasses, "shrink-0")}
          aria-hidden="true"
        >
          <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2z" />
          <path fill="#FBBC04" d="M104.6 499l220.7-221.3-58-58.4L104.6 13z" />
          <path fill="#4285F4" d="M480.6 232L385.4 174.2 325.3 234.3l60.1 60.1 95.2-57.8c19.2-11.6 19.2-32.6 0-44.2z" />
          <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1z" />
        </svg>
      )}
      <div className="text-left">
        <div
          className={cn(
            topTextClasses,
            "font-semibold uppercase tracking-wider text-white/75 leading-none"
          )}
        >
          {isApple ? "Download on the" : "Get it on"}
        </div>
        <div
          className={cn(
            bottomTextClasses,
            "font-bold text-white leading-tight mt-0.5 whitespace-nowrap"
          )}
        >
          {isApple ? "App Store" : "Google Play"}
        </div>
      </div>
    </a>
  );
}

export default StoreBadge;
