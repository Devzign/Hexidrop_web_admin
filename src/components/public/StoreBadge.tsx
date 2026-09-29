import { cn } from "@/lib/utils";
import appleLogoImg from "@/assets/logo-apple-white-transparent.png";
import playStoreLogoImg from "@/assets/logo-playstore-transparent-hd.png";

export interface StoreBadgeProps {
  store: "apple" | "google";
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "pill";
}

/* ========================================================================== */
/* STORE BADGE COMPONENT                                                      */
/* ========================================================================== */
export function StoreBadge({
  store,
  className,
  href = "#",
  size = "md",
  variant = "badge",
}: StoreBadgeProps) {
  const isApple = store === "apple";

  const sizeClasses = {
    sm: "h-11 px-3.5 gap-2.5",
    md: "h-12 px-4.5 gap-3",
    lg: "h-14 px-5.5 gap-3.5",
  }[size];

  const iconClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6 sm:h-7 sm:w-7",
    lg: "h-8 w-8 sm:h-9 sm:w-9",
  }[size];

  const topTextClasses = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
  }[size];

  const bottomTextClasses = {
    sm: "text-xs",
    md: "text-sm sm:text-[15px]",
    lg: "text-base sm:text-lg",
  }[size];

  const shapeClasses =
    variant === "pill"
      ? "rounded-full"
      : "rounded-xl";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={isApple ? "Download on the App Store" : "Get it on Google Play"}
      className={cn(
        "group inline-flex items-center border border-white/25 bg-black text-white shadow-sm select-none transition-all duration-200 hover:bg-zinc-950 hover:border-white/45 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        shapeClasses,
        sizeClasses,
        className
      )}
    >
      <div className={cn("flex items-center justify-center shrink-0", iconClasses)}>
        <img
          src={isApple ? appleLogoImg : playStoreLogoImg}
          alt={isApple ? "Apple logo" : "Google Play logo"}
          className="h-full w-full object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="text-left flex flex-col justify-center">
        <div
          className={cn(
            topTextClasses,
            isApple
              ? "font-medium tracking-normal text-white/85 leading-none"
              : "font-semibold tracking-wider uppercase text-white/80 leading-none"
          )}
        >
          {isApple ? "Download on the" : "GET IT ON"}
        </div>
        <div
          className={cn(
            bottomTextClasses,
            "font-bold text-white tracking-tight leading-tight mt-0.5 whitespace-nowrap"
          )}
        >
          {isApple ? "App Store" : "Google Play"}
        </div>
      </div>
    </a>
  );
}

export default StoreBadge;
