import { useEffect, useState } from "react";
import { toast } from "sonner";
import { axiosConfig } from "@/config/axiosConfig";
import type { ConfigInterface } from "@/interfaces/Config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Config = () => {
  const [config, setConfig] = useState<ConfigInterface[]>([]);
  const [editedConfig, setEditedConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axiosConfig.get("/config");
        setConfig(response.data.config);
      } catch (error: any) {
        toast.error("Failed to fetch config: " + error?.response?.data?.message);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (id: string, value: string) => {
    setEditedConfig((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string) => {
    const newValue = editedConfig[id];
    try {
      await axiosConfig.put(`/config/${id}`, { value: newValue });
      setConfig((prev) => prev.map((item) => (item._id === id ? { ...item, value: newValue } : item)));
      toast.success("Config updated");
    } catch (error: any) {
      toast.error("Update failed: " + error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {config.map(({ _id, key, value }) => (
        <Card key={_id} className="p-4">
          <CardHeader>
            <CardTitle className="text-xl">{key}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor={`value-${_id}`}>Value</Label>
            <Input id={`value-${_id}`} value={editedConfig[_id] ?? value} onChange={(e) => handleChange(_id, e.target.value)} />
            <Button onClick={() => handleSave(_id)}>Save</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
