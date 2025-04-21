"use client";

import { axiosConfig } from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings2, Key, Database } from "lucide-react";
import type { ConfigInterface } from "@/interfaces/Config";

export const Config = () => {
  const [config, setConfig] = useState<ConfigInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get(`/config`);
      setConfig(response.data.config);
    } catch (error: any) {
      toast.error("Failed to load configuration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Settings2 className="w-8 h-8 text-primary" />
            Configuration Settings
          </h1>
          <p className="mt-1 text-muted-foreground">View your system configuration parameters</p>
        </div>
        <Button variant="outline" onClick={fetchConfig} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden border-none shadow-md">
              <CardHeader className="pb-2">
                <Skeleton className="w-1/2 h-5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {config.map((item) => (
            <Card key={item._id} className="overflow-hidden transition-shadow duration-200 border-none shadow-md hover:shadow-lg">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Key className="w-4 h-4 text-primary" />
                    {item.key}
                  </CardTitle>
                  Config
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative p-3 rounded-md bg-muted/50">
                  <div className="absolute px-2 text-xs -top-3 left-3 bg-background text-muted-foreground">Value</div>
                  <div className="font-mono text-sm break-all">
                    {item.value || <span className="italic text-muted-foreground">Empty value</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <Database className="w-3 h-3" />
                  <span className="truncate" title={item._id}>
                    ID: {item._id}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && config.length === 0 && (
        <Card className="w-full p-8 text-center border-none shadow-md">
          <div className="flex flex-col items-center gap-2">
            <Settings2 className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">No configuration items found.</p>
            <Button variant="outline" onClick={fetchConfig} size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
