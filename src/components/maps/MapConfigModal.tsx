import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KeyRound, MapPin, Globe, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import type { MapConfig } from "@/hooks/use-map-config";

interface MapConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: MapConfig;
}

export function MapConfigModal({ open, onOpenChange, config }: MapConfigModalProps) {
  const [keyInput, setKeyInput] = useState(config.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    config.setApiKey(keyInput);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onOpenChange(false);
    }, 800);
  };

  const handleSwitchToOsm = () => {
    config.setEngine("osm");
    onOpenChange(false);
  };

  const handleSwitchToGoogle = () => {
    if (config.apiKey || keyInput) {
      if (keyInput) config.setApiKey(keyInput);
      config.setEngine("google");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-base font-bold">Map API & Provider Settings</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure Google Maps Platform or OpenStreetMap for fleet operations
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Engine Selector */}
          <div>
            <label className="text-xs font-semibold text-foreground">Active Map Provider</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => config.setEngine("google")}
                className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${
                  config.engine === "google"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:bg-accent/40"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Globe className="h-3.5 w-3.5 text-primary" /> Google Maps
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Advanced markers, traffic layer, satellite hybrid
                </div>
              </button>

              <button
                type="button"
                onClick={() => config.setEngine("osm")}
                className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${
                  config.engine === "osm"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:bg-accent/40"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" /> OpenStreetMap
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Zero-key instant real map tiles & zones
                </div>
              </button>
            </div>
          </div>

          {/* Google Maps API Key input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Google Maps API Key
              </label>
              {config.apiKey ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <ShieldCheck className="h-3 w-3" /> Key active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                  <AlertCircle className="h-3 w-3" /> No key set (OSM fallback active)
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 pr-20 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Maps JavaScript API, Places API, and Geocoding API are supported with region code <code className="font-semibold text-foreground">ZW</code> (Zimbabwe).
            </p>
          </div>

          {/* Help & Links */}
          <div className="rounded-xl border bg-accent/30 p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Need a Google Maps Key?</span>
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Google Cloud Console <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-1 text-[11px]">
              Enable <span className="font-medium text-foreground">Maps JavaScript API</span> in your GCP project and paste the credential key above.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-2 flex flex-row items-center justify-between gap-2 border-t pt-4">
          {config.engine === "google" && !config.apiKey ? (
            <button
              type="button"
              onClick={handleSwitchToOsm}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Use OSM Instead
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setKeyInput("");
                config.setApiKey("");
              }}
              className="text-xs font-medium text-destructive hover:underline"
            >
              Clear Key
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-lg border bg-background px-3 text-xs font-medium hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gradient-primary px-3.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-95"
            >
              {savedNotice ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Saved!
                </>
              ) : (
                "Save & Apply"
              )}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
