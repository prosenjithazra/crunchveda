import { create } from "zustand";

export type StoreConfig = {
  _id?: string;
  key?: string;
  brandName: string;
  phoneNumber: string;
  supportEmail: string;
  address: string;
  operatingHours: string;
  whatsappNo: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
  createdAt?: string;
  updatedAt?: string;
};

const DEFAULT_CONFIG: StoreConfig = {
  brandName: "Crunchvedastore",
  phoneNumber: "",
  supportEmail: "info@crunchvedastore.com",
  address: "",
  operatingHours: "Mon - Fri, 9am - 6pm EST",
  whatsappNo: "",
  facebookLink: "",
  instagramLink: "",
  twitterLink: "",
};

type StoreConfigState = {
  config: StoreConfig;
  loading: boolean;
  fetched: boolean;
  fetchConfig: () => Promise<void>;
  setConfig: (config: Partial<StoreConfig>) => void;
};

export const useStoreConfigStore = create<StoreConfigState>((set, get) => ({
  config: DEFAULT_CONFIG,
  loading: false,
  fetched: false,

  fetchConfig: async () => {
    if (get().fetched) return; // already loaded — skip
    set({ loading: true });
    try {
      const res = await fetch("/api/store-config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const raw: StoreConfig =
          data.data?.storeConfig || data.storeConfig || data.data || {};
        set({
          config: { ...DEFAULT_CONFIG, ...raw },
          fetched: true,
        });
      }
    } catch (err) {
      console.error("Failed to load store config:", err);
    } finally {
      set({ loading: false });
    }
  },

  setConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),
}));
