import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { axiosConfig } from "@/config/axiosConfig";

type ConfigMap = Record<string, string>;

interface ConfigContextType {
  configValues: ConfigMap;
  getConfigValue: (keys: string[]) => Promise<ConfigMap>;
  updateConfigValues: (config: ConfigMap) => void;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [configValues, setConfigValues] = useState<ConfigMap>({});

  const loadConfig = useCallback(
    async (keys: string[]) => {
      const missingKeys = keys.filter((key) => configValues[key] === undefined);
      if (missingKeys.length === 0) {
        return configValues;
      }

      try {
        const res = await axiosConfig.get(`/config?keys=${missingKeys.join(",")}`);
        const configMap: ConfigMap = Object.fromEntries(res.data.config.map((c: { key: string; value: string }) => [c.key, c.value]));
        setConfigValues((prevConfig) => ({ ...prevConfig, ...configMap }));
        return { ...configValues, ...configMap };
      } catch (err: any) {
        console.error("Config fetch failed:", err.response?.status, err.response?.data);
        return configValues;
      }
    },
    [configValues],
  );

  const getConfigValue = useCallback(
    async (keys: string[]): Promise<ConfigMap> => {
      return loadConfig(keys);
    },
    [loadConfig],
  );

  const updateConfigValues = useCallback((config: ConfigMap) => {
    setConfigValues((prevConfig) => ({ ...prevConfig, ...config }));
  }, []);

  return <ConfigContext.Provider value={{ configValues, getConfigValue, updateConfigValues }}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === null) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
