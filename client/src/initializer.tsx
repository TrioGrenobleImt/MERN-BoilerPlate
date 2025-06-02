import React, { useEffect, useState } from "react";
import { useConfigContext } from "./contexts/configContext.js";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const { getConfigValue } = useConfigContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      const values = await getConfigValue(["ACCENT_COLOR"]);
      const accent = values["ACCENT_COLOR"];
      if (accent && accent !== "__NOT_FOUND__") {
        document.documentElement.style.setProperty("--accent", accent);
      }
      setReady(true);
    }

    fetchConfig();
  }, [getConfigValue]);

  if (!ready) {
    return <div>Loading config...</div>;
  }

  return <>{children}</>;
}
