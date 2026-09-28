import { useState, useEffect, useCallback } from "react";

export type MapEngine = "google" | "osm";
export type MapTypeOption = "roadmap" | "satellite" | "hybrid" | "terrain";

const STORAGE_KEY_API_KEY = "hexidrop_gmaps_api_key";
const STORAGE_KEY_ENGINE = "hexidrop_map_engine";

export interface MapConfig {
  apiKey: string;
  engine: MapEngine;
  mapType: MapTypeOption;
  traffic: boolean;
  showPins: boolean;
  showRoutes: boolean;
  showZones: boolean;
  setApiKey: (key: string) => void;
  setEngine: (engine: MapEngine) => void;
  setMapType: (mapType: MapTypeOption) => void;
  setTraffic: (traffic: boolean | ((prev: boolean) => boolean)) => void;
  setShowPins: (pins: boolean | ((prev: boolean) => boolean)) => void;
  setShowRoutes: (routes: boolean | ((prev: boolean) => boolean)) => void;
  setShowZones: (zones: boolean | ((prev: boolean) => boolean)) => void;
}

export function useMapConfig(): MapConfig {
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "";
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || envKey;
  });

  const [engine, setEngineState] = useState<MapEngine>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ENGINE) as MapEngine | null;
    if (saved === "google" || saved === "osm") return saved;
    // Default to google if apiKey is present, otherwise OpenStreetMap
    return (localStorage.getItem(STORAGE_KEY_API_KEY) || envKey) ? "google" : "osm";
  });

  const [mapType, setMapType] = useState<MapTypeOption>("roadmap");
  const [traffic, setTraffic] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showZones, setShowZones] = useState(false);

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    setApiKeyState(trimmed);
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY_API_KEY, trimmed);
      setEngineState("google");
      localStorage.setItem(STORAGE_KEY_ENGINE, "google");
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
      setEngineState("osm");
      localStorage.setItem(STORAGE_KEY_ENGINE, "osm");
    }
  }, []);

  const setEngine = useCallback((eng: MapEngine) => {
    setEngineState(eng);
    localStorage.setItem(STORAGE_KEY_ENGINE, eng);
  }, []);

  // Synchronize if env key becomes available
  useEffect(() => {
    if (envKey && !apiKey) {
      setApiKey(envKey);
    }
  }, [envKey, apiKey, setApiKey]);

  return {
    apiKey,
    engine,
    mapType,
    traffic,
    showPins,
    showRoutes,
    showZones,
    setApiKey,
    setEngine,
    setMapType,
    setTraffic,
    setShowPins,
    setShowRoutes,
    setShowZones,
  };
}
