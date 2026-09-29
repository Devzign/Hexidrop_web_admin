import { useId } from "react";
import { cn } from "@/lib/utils";

export interface StoreBadgeProps {
  store: "apple" | "google";
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "pill";
}

/* ========================================================================== */
/* OFFICIAL APPLE LOGO VECTOR (Official Apple Inc. Silhouette)                */
/* ========================================================================== */
function OfficialAppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 170"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.78-11.65-14.23-5.87-9.35-10.43-19.78-13.68-31.3-3.26-11.51-4.89-22.39-4.89-32.61 0-14.35 3.48-26.3 10.43-35.87 6.96-9.56 15.65-14.46 26.09-14.67 4.78 0 10.33 1.25 16.63 3.75 6.3 2.5 10.22 3.8 11.74 3.91 2.39-.22 6.63-1.68 12.72-4.39 6.09-2.72 11.47-3.97 16.14-3.75 11.96.65 21.63 5.38 29.02 14.18-10.43 6.3-15.54 15.11-15.33 26.41.22 8.91 3.59 16.36 10.11 22.34 6.52 5.98 14.24 9.4 23.15 10.27-2.39 7.17-5.33 14.56-8.8 22.17zM119.22 31.8c0-7.39 2.66-14.35 7.99-20.87 5.33-6.52 11.9-10.65 19.73-12.39.22 1.3.33 2.5.33 3.59 0 7.39-2.83 14.46-8.48 21.2-5.65 6.74-12.39 10.76-20.22 12.06-.22-.98-.35-2.17-.35-3.59z" />
    </svg>
  );
}

/* ========================================================================== */
/* OFFICIAL GOOGLE PLAY LOGO VECTOR (Official Google Play 4-Color Gradients)  */
/* ========================================================================== */
function OfficialGooglePlayLogo({ className }: { className?: string }) {
  const id = useId();
  const blueId = `gplay-blue-${id}`;
  const greenId = `gplay-green-${id}`;
  const redId = `gplay-red-${id}`;
  const yellowId = `gplay-yellow-${id}`;

  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={blueId} x1="91.5%" y1="9.4%" x2="7.5%" y2="80.6%">
          <stop offset="0%" stopColor="#00A0FF" />
          <stop offset="100%" stopColor="#00E3FF" />
        </linearGradient>
        <linearGradient id={greenId} x1="107.7%" y1="44.2%" x2="-35.2%" y2="44.2%">
          <stop offset="0%" stopColor="#FFE000" />
          <stop offset="41%" stopColor="#FFBD00" />
          <stop offset="78%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF9C00" />
        </linearGradient>
        <linearGradient id={redId} x1="86.3%" y1="5.7%" x2="-18.8%" y2="93.8%">
          <stop offset="0%" stopColor="#FF3A44" />
          <stop offset="100%" stopColor="#C31162" />
        </linearGradient>
        <linearGradient id={yellowId} x1="-12.8%" y1="20.4%" x2="57.7%" y2="79.9%">
          <stop offset="0%" stopColor="#32A071" />
          <stop offset="100%" stopColor="#00F076" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${blueId})`}
        d="M48.7 18.2C44.8 22.3 42.6 28.5 42.6 36.6v438.8c0 8.1 2.2 14.3 6.1 18.4l1 1 245.7-245.7v-5.8L49.7 17.2l-1 1z"
      />
      <path
        fill={`url(#${greenId})`}
        d="M377.1 329.8l-81.7-81.7v-5.8l81.7-81.7 1.8 1 96.9 55.1c27.6 15.7 27.6 41.4 0 57.1l-96.9 55.1-1.8 1z"
      />
      <path
        fill={`url(#${redId})`}
        d="M295.4 242.3L48.7 494.8c9.1 9.6 24.1 10.8 40.8 1.4l289.4-164.5-83.5-89.4z"
      />
      <path
        fill={`url(#${yellowId})`}
        d="M295.4 242.3l83.5-89.4L89.5 15.8C72.8 6.4 57.8 7.6 48.7 17.2l246.7 225.1z"
      />
    </svg>
  );
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

  const appleIconClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6 sm:h-7 sm:w-7",
    lg: "h-7 w-7 sm:h-8 sm:w-8",
  }[size];

  const googleIconClasses = {
    sm: "h-4.5 w-4.5",
    md: "h-5 w-5 sm:h-6 sm:w-6",
    lg: "h-6 w-6 sm:h-7 sm:w-7",
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
      {isApple ? (
        <OfficialAppleLogo
          className={cn(appleIconClasses, "fill-white shrink-0 transition-transform duration-200 group-hover:scale-105")}
        />
      ) : (
        <OfficialGooglePlayLogo
          className={cn(googleIconClasses, "shrink-0 transition-transform duration-200 group-hover:scale-105")}
        />
      )}

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
