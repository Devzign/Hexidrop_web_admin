import { cn } from "@/lib/utils";
import markAsset from "@/assets/hexidrop-mark-trim.png.asset.json";
import wordAsset from "@/assets/hexidrop-wordmark.png.asset.json";
import lockupAsset from "@/assets/hexidrop-lockup.png.asset.json";

export function HexiLogo({
  className,
  size = 40,
  showWord = true,
  layout = "horizontal",
}: {
  className?: string;
  size?: number;
  showWord?: boolean;
  layout?: "horizontal" | "stacked";
}) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <span className="relative flex items-center justify-center rounded-xl bg-card border border-border shadow-sm overflow-hidden p-1 shrink-0" style={{ height: size, width: size }}>
        <img
          src="/favicon.png"
          alt="HexiDrop"
          className="h-full w-full object-contain"
          onError={(e) => {
            if (markAsset?.url) e.currentTarget.src = markAsset.url;
          }}
        />
      </span>
      {showWord && (
        <span className="flex flex-col leading-tight">
          <span className="font-extrabold tracking-tight" style={{ fontSize: Math.max(16, Math.round(size * 0.45)) }}>
            <span className="text-primary">HEXI</span>
            <span className="text-brand-navy dark:text-foreground">DROP</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground -mt-0.5">
            Logistics & Moving
          </span>
        </span>
      )}
    </div>
  );
}

export default HexiLogo;
