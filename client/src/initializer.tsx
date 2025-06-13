import React, { useEffect, useState } from "react";
import { useConfigContext } from "./contexts/configContext.js";
import { Loading } from "./components/customs/loading.js";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const { getConfigValue } = useConfigContext();
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      const configKeys = ["APP_NAME", "ACCENT_COLOR"];
      const values = await getConfigValue(configKeys);

      const accent = values["ACCENT_COLOR"];
      if (accent && accent !== "__NOT_FOUND__") {
        document.documentElement.style.setProperty("--accent", accent);
      }

      if (values["APP_NAME"]) {
        document.title = values["APP_NAME"];
        setConfigValues(values);
      }

      setReady(true);
    }

    fetchConfig();
  }, [getConfigValue]);

  if (!ready) {
    return <Loading />;
  }

  return <>{children}</>;
}
