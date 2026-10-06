import { useState, useEffect, useCallback } from "react";
import { DRIVERS, type Driver } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { toast } from "sonner";

export type { Driver } from "@/lib/mock-data";

const STORAGE_KEY = "hexidrop_drivers_store_v1";
const EVENT_KEY = "hexidrop-drivers-update";

export type PhotoField =
  | "avatar"
  | "driverPhoto"
  | "nationalIdPhoto"
  | "licensePhoto"
  | "ztsaCertificatePhoto"
  | "policeClearancePhoto"
  | "vehiclePhoto";

/**
 * Transforms backend API driver record to Frontend Driver model
 */
export function transformApiDriverToDriver(apiD: any): Driver {
  const v = apiD.vehicle || {};
  const docs = Array.isArray(apiD.documents) ? apiD.documents : [];
  const getDocUrl = (t: string) => docs.find((d: any) => d.type === t)?.file_url;

  const rawId = apiD.id ?? "";
  const idStr = String(rawId);

  return {
    id: idStr,
    name: apiD.name || "Driver",
    phone: apiD.phone_display || apiD.phone || "+263 77 000 0000",
    email: apiD.email || "driver@hexidrop.co.zw",
    city: apiD.city || "Harare",
    address: apiD.address_line || apiD.address || "Harare, Zimbabwe",
    vehicle: v.type || apiD.vehicle_type || "Courier Bike",
    vehicleType: v.type || apiD.vehicle_type || "Courier Bike",
    vehicleModel: v.model ? `${v.make || ""} ${v.model}`.trim() : (apiD.vehicle_model || "Yamaha YBR 125"),
    vehicleYear: String(v.year || apiD.vehicle_year || "2024"),
    vehicleColor: v.color || apiD.vehicle_color || "Hexidrop Navy",
    plate: v.plate || apiD.vehicle_plate || "ADK-0000",
    rating: Number(apiD.rating || 5.0),
    trips: Number(apiD.total_trips ?? apiD.trips ?? 0),
    earnings: Number(apiD.total_earnings ?? apiD.earnings ?? 0),
    status: apiD.is_online ? "Online" : (apiD.status === "suspended" ? "Offline" : "Offline"),
    verified: apiD.verification_status === "verified",
    lat: Number(apiD.current_lat || apiD.lat || -17.824858),
    lng: Number(apiD.current_lng || apiD.lng || 31.053028),
    currentSuburb: apiD.suburb || "Harare CBD",
    avatar: apiD.avatar_url || apiD.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=85",
    driverPhoto: apiD.avatar_url || apiD.driverPhoto || getDocUrl("profile_photo") || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=85",
    nationalId: apiD.national_id_number || "63-280000-K-40",
    nationalIdPhoto: getDocUrl("national_id") || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    licenseNumber: "ZW-DL-" + (990000 + (Number(idStr) || 1)),
    licenseClass: "Class 4 (Light Delivery)",
    licensePhoto: getDocUrl("drivers_license") || "https://images.unsplash.com/photo-1554415707-9e44667014f8?w=600&auto=format&fit=crop&q=80",
    ztsaCertificatePhoto: getDocUrl("vehicle_registration") || "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    policeClearancePhoto: getDocUrl("police_clearance") || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    vehiclePhoto: getDocUrl("vehicle_photo") || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
    joinedDate: apiD.joined_at ? new Date(apiD.joined_at).toLocaleDateString() : "Recent",
    acceptanceRate: 98.0,
    completionRate: 99.0,
    onTimeRate: 97.5,
    ecoCashNumber: apiD.ecocash_phone || apiD.phone || "+263 77 000 0000",
    bankName: "Stanbic Bank Zimbabwe",
    bankAccount: "100-294810-01",
    emergencyContact: {
      name: "Emergency Contact",
      relation: "Family",
      phone: "+263 77 111 2222",
    },
  };
}

export function getStoredDrivers(): Driver[] {
  if (typeof window === "undefined") return DRIVERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DRIVERS));
      return DRIVERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DRIVERS));
      return DRIVERS;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to read drivers from localStorage:", err);
    return DRIVERS;
  }
}

export function saveStoredDrivers(drivers: Driver[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: drivers }));
  } catch (err) {
    console.error("Failed to save drivers to localStorage:", err);
  }
}

/**
 * Fetch drivers directly from the Laravel REST API backend.
 * Falls back safely to localStorage / mock if API server is offline.
 */
export async function syncDriversFromApi(): Promise<Driver[]> {
  try {
    const res = await api.drivers.list({ per_page: 100 });
    const rawList = Array.isArray(res.data)
      ? res.data
      : Array.isArray((res.data as any)?.data)
        ? (res.data as any).data
        : [];

    if (rawList.length > 0) {
      const mapped = rawList.map(transformApiDriverToDriver);
      saveStoredDrivers(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("API drivers list unreachable, using stored local cache:", err);
  }
  return getStoredDrivers();
}

/**
 * Extract numeric or clean database ID from various ID formats
 */
function extractNumericId(id: string): number | null {
  const digits = id.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : null;
}

export function getDriverById(id: string): Driver | undefined {
  const drivers = getStoredDrivers();
  const cleanId = id.trim().toLowerCase();
  const numId = cleanId.replace(/^drv-?/, "");

  return drivers.find((d) => {
    const dClean = d.id.trim().toLowerCase();
    const dNum = dClean.replace(/^drv-?/, "");
    return dClean === cleanId || dNum === numId || d.id === id;
  });
}

export function updateDriver(id: string, updates: Partial<Driver>): Driver | undefined {
  const drivers = getStoredDrivers();
  let updated: Driver | undefined;
  const nextDrivers = drivers.map((d) => {
    const dClean = d.id.trim().toLowerCase();
    const cleanId = id.trim().toLowerCase();
    const dNum = dClean.replace(/^drv-?/, "");
    const targetNum = cleanId.replace(/^drv-?/, "");

    if (dClean === cleanId || dNum === targetNum || d.id === id) {
      updated = { ...d, ...updates };
      return updated;
    }
    return d;
  });

  if (updated) {
    saveStoredDrivers(nextDrivers);

    // Synchronize to backend API asynchronously
    const numId = extractNumericId(id);
    if (numId) {
      const payload: Record<string, any> = {};
      if (updates.name) payload.name = updates.name;
      if (updates.phone) payload.phone = updates.phone;
      if (updates.email) payload.email = updates.email;
      if (updates.city) payload.city = updates.city;
      if (updates.address) payload.address_line = updates.address;
      if (updates.vehicleModel) payload.vehicle_model = updates.vehicleModel;
      if (updates.plate) payload.vehicle_plate = updates.plate;
      if (updates.status) payload.status = updates.status.toLowerCase() === "online" ? "active" : "active";
      if (updates.verified !== undefined) payload.verification_status = updates.verified ? "verified" : "pending";
      if (updates.rating !== undefined) payload.rating = updates.rating;
      if (updates.avatar) payload.avatar_url = updates.avatar;

      api.drivers.update(numId, payload).catch((err) => {
        console.warn("Backend driver update sync note:", err);
      });
    }
  }
  return updated;
}

export function updateDriverPhoto(
  id: string,
  field: PhotoField,
  dataUrl: string
): Driver | undefined {
  const updates: Partial<Driver> = { [field]: dataUrl };
  // If updating avatar or driverPhoto, synchronize both for profile view
  if (field === "avatar" || field === "driverPhoto") {
    updates.avatar = dataUrl;
    updates.driverPhoto = dataUrl;
  }
  const result = updateDriver(id, updates);

  if (result) {
    toast.success("Driver Image Captured & Saved", {
      description: `New ${field === "avatar" || field === "driverPhoto" ? "profile photo" : "document photo"} updated for ${result.name}.`,
    });

    // Sync image to backend API
    const numId = extractNumericId(id);
    if (numId) {
      if (field === "avatar" || field === "driverPhoto") {
        api.drivers.uploadPhoto(numId, dataUrl)
          .then((res) => {
            if (res?.data?.avatar_url) {
              updateDriver(id, { avatar: res.data.avatar_url, driverPhoto: res.data.avatar_url });
            }
          })
          .catch((err) => console.warn("Driver photo upload backend sync:", err));
      } else {
        const typeMap: Record<string, string> = {
          nationalIdPhoto: "national_id",
          licensePhoto: "drivers_license",
          vehiclePhoto: "vehicle_photo",
          ztsaCertificatePhoto: "vehicle_registration",
          policeClearancePhoto: "police_clearance",
        };
        const docType = typeMap[field] || "other";
        api.drivers.uploadDocument(numId, { type: docType, data_url: dataUrl })
          .catch((err) => console.warn("Driver document upload backend sync:", err));
      }
    }
  }
  return result;
}

export function toggleDriverKyc(id: string): Driver | undefined {
  const driver = getDriverById(id);
  if (!driver) return undefined;
  const nextStatus = !driver.verified;
  const updated = updateDriver(id, { verified: nextStatus });

  if (updated) {
    toast.success(
      nextStatus ? "Driver KYC Approved" : "Driver KYC Set to Pending",
      {
        description: `${driver.name} (${driver.id}) KYC verification status was updated.`,
      }
    );

    const numId = extractNumericId(id);
    if (numId) {
      if (nextStatus) {
        api.drivers.verify(numId).catch((err) => console.warn("Driver verify sync:", err));
      } else {
        api.drivers.reject(numId, "Revoked by administrator").catch((err) => console.warn("Driver reject sync:", err));
      }
    }
  }
  return updated;
}

export function deleteDriver(id: string): boolean {
  const drivers = getStoredDrivers();
  const next = drivers.filter((d) => {
    const dClean = d.id.trim().toLowerCase();
    const cleanId = id.trim().toLowerCase();
    const dNum = dClean.replace(/^drv-?/, "");
    const targetNum = cleanId.replace(/^drv-?/, "");
    return !(dClean === cleanId || dNum === targetNum || d.id === id);
  });

  saveStoredDrivers(next);
  toast.success("Driver removed from fleet");

  const numId = extractNumericId(id);
  if (numId) {
    api.drivers.delete(numId).catch((err) => console.warn("Driver delete backend sync:", err));
  }

  return true;
}

export function createDriver(newDriver: Partial<Driver>): Driver {
  const drivers = getStoredDrivers();
  const id = newDriver.id || `DRV-${1200 + Math.floor(Math.random() * 800)}`;
  const driver: Driver = {
    id,
    name: newDriver.name || "New Driver",
    phone: newDriver.phone || "+263 77 000 0000",
    email: newDriver.email || "driver@hexidrop.co.zw",
    city: newDriver.city || "Harare",
    address: newDriver.address || "Harare, Zimbabwe",
    vehicle: newDriver.vehicle || "Courier Bike",
    vehicleType: newDriver.vehicleType || "Courier Bike",
    vehicleModel: newDriver.vehicleModel || "Yamaha YBR 125",
    vehicleYear: newDriver.vehicleYear || "2024",
    vehicleColor: newDriver.vehicleColor || "Hexidrop Navy",
    plate: newDriver.plate || "AFK-0000",
    rating: newDriver.rating || 5.0,
    trips: newDriver.trips || 0,
    earnings: newDriver.earnings || 0,
    status: newDriver.status || "Online",
    verified: newDriver.verified ?? false,
    lat: newDriver.lat || -17.824858,
    lng: newDriver.lng || 31.053028,
    currentSuburb: newDriver.currentSuburb || "Harare CBD",
    avatar: newDriver.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=85",
    driverPhoto: newDriver.driverPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=85",
    nationalId: newDriver.nationalId || "63-294819-K-42",
    nationalIdPhoto: newDriver.nationalIdPhoto || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    licenseNumber: newDriver.licenseNumber || "ZW-DL-994821-B",
    licenseClass: newDriver.licenseClass || "Class 4 (Light Delivery)",
    licensePhoto: newDriver.licensePhoto || "https://images.unsplash.com/photo-1554415707-9e44667014f8?w=600&auto=format&fit=crop&q=80",
    ztsaCertificatePhoto: newDriver.ztsaCertificatePhoto || "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    policeClearancePhoto: newDriver.policeClearancePhoto || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    vehiclePhoto: newDriver.vehiclePhoto || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
    joinedDate: newDriver.joinedDate || "Today",
    acceptanceRate: newDriver.acceptanceRate || 98.0,
    completionRate: newDriver.completionRate || 99.0,
    onTimeRate: newDriver.onTimeRate || 97.5,
    ecoCashNumber: newDriver.ecoCashNumber || newDriver.phone || "+263 77 000 0000",
    bankName: newDriver.bankName || "Stanbic Bank Zimbabwe",
    bankAccount: newDriver.bankAccount || "100-294810-01",
    emergencyContact: newDriver.emergencyContact || {
      name: "Emergency Contact",
      relation: "Family",
      phone: "+263 77 111 2222",
    },
  };

  const updated = [driver, ...drivers];
  saveStoredDrivers(updated);
  toast.success("Driver Onboarded Successfully", { description: `${driver.name} (${driver.id}) added.` });

  // Post to backend API
  api.drivers.create({
    name: driver.name,
    phone: driver.phone,
    email: driver.email,
    city: driver.city,
    address_line: driver.address,
    vehicle_make: driver.vehicleModel?.split(" ")[0] || "Yamaha",
    vehicle_model: driver.vehicleModel?.split(" ").slice(1).join(" ") || "YBR 125",
    vehicle_plate: driver.plate,
    ecocash_phone: driver.ecoCashNumber,
    avatar_url: driver.avatar,
    status: "active",
    verification_status: driver.verified ? "verified" : "pending",
  }).then((res) => {
    if (res?.data?.id) {
      const serverDriver = transformApiDriverToDriver(res.data);
      // Replace optimistic record with server record
      const currentList = getStoredDrivers();
      const updatedList = currentList.map((d) => (d.id === id ? serverDriver : d));
      saveStoredDrivers(updatedList);
    }
  }).catch((err) => {
    console.warn("Backend driver creation sync note:", err);
  });

  return driver;
}

/** Hook for listening to all drivers with automatic backend API sync */
export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>(getStoredDrivers);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const apiDrivers = await syncDriversFromApi();
      setDrivers(apiDrivers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch from backend
    refresh();

    const handleUpdate = () => {
      setDrivers(getStoredDrivers());
    };
    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  return {
    drivers,
    loading,
    refresh,
    setDrivers: saveStoredDrivers,
    updateDriver,
    updateDriverPhoto,
    toggleDriverKyc,
    deleteDriver,
    createDriver,
  };
}

/** Hook for subscribing to a single driver by ID with automatic backend detail fetch */
export function useDriver(id: string | undefined) {
  const [driver, setDriver] = useState<Driver | undefined>(() => (id ? getDriverById(id) : undefined));
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!id) return;
    const numId = extractNumericId(id);
    if (!numId) return;

    setLoading(true);
    try {
      const res = await api.drivers.get(numId);
      if (res?.data) {
        const transformed = transformApiDriverToDriver(res.data);
        updateDriver(id, transformed);
        setDriver(transformed);
      }
    } catch (err) {
      console.warn("Could not fetch driver detail from API, using cached:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setDriver(getDriverById(id));
    refresh();

    const handleUpdate = () => {
      setDriver(getDriverById(id));
    };
    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [id, refresh]);

  const savePhoto = useCallback(
    (field: PhotoField, dataUrl: string) => {
      if (!id) return;
      updateDriverPhoto(id, field, dataUrl);
    },
    [id]
  );

  const toggleKyc = useCallback(() => {
    if (!id) return;
    toggleDriverKyc(id);
  }, [id]);

  const update = useCallback(
    (updates: Partial<Driver>) => {
      if (!id) return;
      updateDriver(id, updates);
    },
    [id]
  );

  return {
    driver,
    loading,
    refresh,
    savePhoto,
    toggleKyc,
    update,
  };
}
