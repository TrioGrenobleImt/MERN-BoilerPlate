import { create } from "zustand";
import { axiosConfig } from "@/config/axiosConfig";

type ConfigMap = Record<string, string>;

interface ConfigStore {
  config: ConfigMap;
  isLoaded: boolean;
  loadConfig: (keys?: string[]) => Promise<void>;
  getConfigValue: (key: string) => string | undefined;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: {},
  isLoaded: false,

  loadConfig: async (keys) => {
    try {
      const query = keys?.length ? `?keys=${keys.join(",")}` : "";
      const res = await axiosConfig.get(`/config${query}`);
      const configMap: ConfigMap = Object.fromEntries(res.data.config.map((c: { key: string; value: string }) => [c.key, c.value]));
      set((state) => ({
        config: { ...state.config, ...configMap },
        isLoaded: true,
      }));
    } catch (err: any) {
      console.error("Config fetch failed:", err.response?.status, err.response?.data);
    }
  },

  getConfigValue: (key) => {
    const { config, isLoaded, loadConfig } = get();

    if (!isLoaded) {
      loadConfig([key]);
    }

    return config[key];
  },
}));
