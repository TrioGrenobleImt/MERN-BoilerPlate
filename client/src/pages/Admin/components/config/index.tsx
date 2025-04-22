import { useState } from "react";
import { useConfigStore } from "@/stores/configStore";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Card } from "@/components/ui/card"; // ShadCN Card
import { Label } from "@/components/ui/label"; // ShadCN Label
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";

export const Config = () => {
  const { config } = useConfigStore();
  const [localConfig, setLocalConfig] = useState(config);

  const handleChange = (key: string, value: string) => {
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const updatedConfig = { ...localConfig };
    const keys = Object.keys(localConfig).filter((key) => localConfig[key] !== config[key]);

    try {
      const response = await axiosConfig.put("/config", { config: updatedConfig, keys });
      toast.success(response.data.message);
      useConfigStore.setState({ config: updatedConfig });
      setLocalConfig(updatedConfig);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div>
      <div className="container px-4 mx-auto">
        <Card className="p-6 rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">Configuration</h2>
          {Object.entries(localConfig).map(([key, value]) => (
            <div key={key} className="mb-4">
              <Label htmlFor={key} className="block font-medium">
                {key}
              </Label>
              <Input id={key} type="text" value={value} onChange={(e) => handleChange(key, e.target.value)} className="mt-2 mb-2" />
            </div>
          ))}
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </Card>
      </div>
    </div>
  );
};
