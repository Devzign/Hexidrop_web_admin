import { useState, useEffect, useCallback } from "react";
import { DRIVERS, type Driver } from "@/lib/mock-data";
import { toast } from "sonner";

export type { Driver } from "@/lib/mock-data";

const STORAGE_KEY = "hexidrop_drivers_store_v1";
const EVENT_KEY = "hexidrop-drivers-update";

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

export function getDriverById(id: string): Driver | undefined {
  const drivers = getStoredDrivers();
  return drivers.find((d) => d.id.toLowerCase() === id.toLowerCase());
}

export function updateDriver(id: string, updates: Partial<Driver>): Driver | undefined {
  const drivers = getStoredDrivers();
  let updated: Driver | undefined;
  const nextDrivers = drivers.map((d) => {
    if (d.id.toLowerCase() === id.toLowerCase()) {
      updated = { ...d, ...updates };
      return updated;
    }
    return d;
  });

  if (updated) {
    saveStoredDrivers(nextDrivers);
  }
  return updated;
}

export function updateDriverPhoto(
  id: string,
  field: "avatar" | "driverPhoto" | "nationalIdPhoto" | "licensePhoto" | "ztsaCertificatePhoto" | "policeClearancePhoto" | "vehiclePhoto",
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
  }
  return updated;
}

export function deleteDriver(id: string): boolean {
  const drivers = getStoredDrivers();
  const next = drivers.filter((d) => d.id.toLowerCase() !== id.toLowerCase());
  saveStoredDrivers(next);
  toast.success("Driver removed from fleet");
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
  return driver;
}

/** Hook for listening to all drivers */
export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>(getStoredDrivers);

  useEffect(() => {
    const handleUpdate = () => {
      setDrivers(getStoredDrivers());
    };
    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    drivers,
    setDrivers: saveStoredDrivers,
    updateDriver,
    updateDriverPhoto,
    toggleDriverKyc,
    deleteDriver,
    createDriver,
  };
}

/** Hook for subscribing to a single driver by ID */
export function useDriver(id: string | undefined) {
  const [driver, setDriver] = useState<Driver | undefined>(() => (id ? getDriverById(id) : undefined));

  useEffect(() => {
    if (!id) return;
    setDriver(getDriverById(id));

    const handleUpdate = () => {
      setDriver(getDriverById(id));
    };
    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [id]);

  const savePhoto = useCallback(
    (
      field: "avatar" | "driverPhoto" | "nationalIdPhoto" | "licensePhoto" | "ztsaCertificatePhoto" | "policeClearancePhoto" | "vehiclePhoto",
      dataUrl: string
    ) => {
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
    savePhoto,
    toggleKyc,
    update,
  };
}
