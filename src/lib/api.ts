/**
 * HexiDrop Centralized API Client for Web Admin Console.
 * Directly communicates with the Laravel REST API backend.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "hexidrop.admin.token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Universal authenticated fetch helper
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, errorMsg, data);
  }

  return data as T;
}

// =========================================================================
// API SERVICE CLIENTS
// =========================================================================

export const api = {
  // --- Admin Authentication ---
  auth: {
    login: async (email: string, password: string) => {
      return apiRequest<{
        success: boolean;
        message?: string;
        data: {
          user: {
            id: number;
            name: string;
            email: string;
            phone?: string;
            roles?: Array<{ id: number; name: string }>;
          };
          token: string;
        };
      }>("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },

    me: async () => {
      return apiRequest<{ success: boolean; data: any }>("/admin/auth/me");
    },

    logout: async () => {
      try {
        await apiRequest("/admin/auth/logout", { method: "POST" });
      } finally {
        setAuthToken(null);
      }
    },
  },

  // --- Real-time Operations Dashboard ---
  dashboard: {
    getLive: async () => {
      return apiRequest<{
        success: boolean;
        data: {
          active_deliveries: number;
          active_moves: number;
          drivers_online: number;
          drivers_on_job: number;
          drivers_available: number;
          todays_bookings: number;
          todays_revenue: number;
          pending_driver_assignments: number;
          alerts: any[];
        };
      }>("/admin/dashboard/live");
    },
    getSurgeStatus: async () => {
      return apiRequest<{ success: boolean; data: any }>("/admin/surge/status");
    },
    toggleSurge: async (active: boolean, multiplier?: number) => {
      return apiRequest("/admin/surge/toggle", {
        method: "PUT",
        body: JSON.stringify({ active, multiplier }),
      });
    },
  },

  // --- Drivers & Fleet Verification ---
  drivers: {
    list: async (params?: Record<string, string | number>) => {
      const q = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return apiRequest<{ success: boolean; data: any[] | { data: any[] } }>(
        `/admin/drivers${q}`,
      );
    },
    get: async (id: number | string) => {
      return apiRequest<{ success: boolean; data: any }>(`/admin/drivers/${id}`);
    },
    create: async (data: Record<string, any>) => {
      return apiRequest<{ success: boolean; data: any; message?: string }>(
        "/admin/drivers",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
    },
    update: async (id: number | string, data: Record<string, any>) => {
      return apiRequest<{ success: boolean; data: any; message?: string }>(
        `/admin/drivers/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
      );
    },
    delete: async (id: number | string) => {
      return apiRequest<{ success: boolean; message?: string }>(
        `/admin/drivers/${id}`,
        {
          method: "DELETE",
        },
      );
    },
    uploadPhoto: async (id: number | string, photo: string | File) => {
      if (typeof photo === "string") {
        return apiRequest<{ success: boolean; data: { driver_id: number; avatar_url: string } }>(
          `/admin/drivers/${id}/photo`,
          {
            method: "POST",
            body: JSON.stringify({ photo }),
          },
        );
      }
      const formData = new FormData();
      formData.append("photo", photo);
      return apiRequest<{ success: boolean; data: { driver_id: number; avatar_url: string } }>(
        `/admin/drivers/${id}/photo`,
        {
          method: "POST",
          body: formData,
        },
      );
    },
    uploadDocument: async (
      id: number | string,
      data: { type: string; file?: File; file_url?: string; data_url?: string; expiry_date?: string },
    ) => {
      if (data.file) {
        const formData = new FormData();
        formData.append("type", data.type);
        formData.append("file", data.file);
        if (data.expiry_date) formData.append("expiry_date", data.expiry_date);
        return apiRequest<{ success: boolean; data: any }>(
          `/admin/drivers/${id}/documents`,
          {
            method: "POST",
            body: formData,
          },
        );
      }
      return apiRequest<{ success: boolean; data: any }>(
        `/admin/drivers/${id}/documents`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
    },
    verifyDocument: async (id: number | string, docIdentifier: string | number) => {
      return apiRequest<{ success: boolean; data: any }>(
        `/admin/drivers/${id}/documents/${docIdentifier}/verify`,
        { method: "PUT" },
      );
    },
    rejectDocument: async (
      id: number | string,
      docIdentifier: string | number,
      reason: string,
    ) => {
      return apiRequest<{ success: boolean; data: any }>(
        `/admin/drivers/${id}/documents/${docIdentifier}/reject`,
        {
          method: "PUT",
          body: JSON.stringify({ reason }),
        },
      );
    },
    updateStatus: async (id: number | string, status: string, is_online?: boolean) => {
      return apiRequest(`/admin/drivers/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, ...(is_online !== undefined ? { is_online } : {}) }),
      });
    },
    verify: async (id: number | string) => {
      return apiRequest(`/admin/drivers/${id}/verify`, { method: "POST" });
    },
    reject: async (id: number | string, reason?: string) => {
      return apiRequest(`/admin/drivers/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
    },
    assignVehicle: async (id: number | string, vehicleData: Record<string, any>) => {
      return apiRequest(`/admin/drivers/${id}/assign-vehicle`, {
        method: "POST",
        body: JSON.stringify(vehicleData),
      });
    },
    updateCommission: async (id: number | string, commission_percent: number) => {
      return apiRequest(`/admin/drivers/${id}/commission`, {
        method: "PUT",
        body: JSON.stringify({ commission_percent }),
      });
    },
    getPending: async () => {
      return apiRequest<{ success: boolean; data: any[] }>(
        "/admin/drivers/pending-verification",
      );
    },
    getLiveMap: async () => {
      return apiRequest<{ success: boolean; data: any[] }>(
        "/admin/drivers/live-map",
      );
    },
  },

  // --- Customers & User Management ---
  users: {
    list: async (params?: Record<string, string | number>) => {
      const q = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return apiRequest<{ success: boolean; data: any[] | { data: any[] } }>(
        `/admin/users${q}`,
      );
    },
    get: async (id: number | string) => {
      return apiRequest<{ success: boolean; data: any }>(`/admin/users/${id}`);
    },
    updateStatus: async (id: number | string, status: string) => {
      return apiRequest(`/admin/users/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
  },

  // --- Orders & Dispatches ---
  parcels: {
    list: async (params?: Record<string, string | number>) => {
      const q = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return apiRequest<{ success: boolean; data: any[] | { data: any[] } }>(
        `/admin/parcels${q}`,
      );
    },
    get: async (id: number | string) => {
      return apiRequest<{ success: boolean; data: any }>(`/admin/parcels/${id}`);
    },
    updateStatus: async (id: number | string, status: string) => {
      return apiRequest(`/admin/parcels/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
    assignDriver: async (id: number | string, driver_id: number | string) => {
      return apiRequest(`/admin/parcels/${id}/assign-driver`, {
        method: "PUT",
        body: JSON.stringify({ driver_id }),
      });
    },
  },

  moves: {
    list: async (params?: Record<string, string | number>) => {
      const q = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return apiRequest<{ success: boolean; data: any[] | { data: any[] } }>(
        `/admin/moves${q}`,
      );
    },
    get: async (id: number | string) => {
      return apiRequest<{ success: boolean; data: any }>(`/admin/moves/${id}`);
    },
    updateStatus: async (id: number | string, status: string) => {
      return apiRequest(`/admin/moves/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
  },

  // --- Vehicle Types & Pricing ---
  vehicles: {
    listTypes: async () => {
      return apiRequest<{ success: boolean; data: any[] }>(
        "/admin/vehicle-types",
      );
    },
    createType: async (data: any) => {
      return apiRequest("/admin/vehicle-types", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    updateType: async (id: number | string, data: any) => {
      return apiRequest(`/admin/vehicle-types/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    deleteType: async (id: number | string) => {
      return apiRequest(`/admin/vehicle-types/${id}`, {
        method: "DELETE",
      });
    },
    listServices: async () => {
      return apiRequest<{ success: boolean; data: any[] }>("/admin/services");
    },
  },

  // --- Financials & Payments ---
  payments: {
    list: async (params?: Record<string, string | number>) => {
      const q = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return apiRequest<{ success: boolean; data: any[] | { data: any[] } }>(
        `/admin/payments${q}`,
      );
    },
    getRevenueSummary: async () => {
      return apiRequest<{ success: boolean; data: any }>(
        "/admin/revenue/summary",
      );
    },
  },

  // --- App Configuration & Geography ---
  config: {
    getAppConfig: async () => {
      return apiRequest<{ success: boolean; data: any }>("/app-config");
    },
    getCities: async () => {
      return apiRequest<{ success: boolean; data: any[] }>("/cities");
    },
    getAreas: async (city?: string) => {
      const q = city ? `?city=${encodeURIComponent(city)}` : "";
      return apiRequest<{ success: boolean; data: any[] }>(`/areas${q}`);
    },
  },
};
