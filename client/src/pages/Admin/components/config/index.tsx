import { useState } from "react";
import { useConfigStore } from "@/stores/configStore";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Card, CardFooter } from "@/components/ui/card"; // ShadCN Card
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

    if (keys.length === 0) {
      toast.info("No changes detected.");
      return;
    }

    for (const key of keys) {
      if (localConfig[key] === "") {
        toast.error(`The value for ${key} is empty. Please provide a valid value.`);
        return;
      }
    }

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
        <Card className="p-6 rounded-lg shadow-lg ">
          <h2 className="mb-4 text-2xl font-semibold">Configuration</h2>
          {Object.entries(localConfig).map(([key, value]) => (
            <div key={key} className="mb-4">
              <Label htmlFor={key} className="block font-medium">
                {key}
              </Label>
              <Input id={key} type="text" value={value} onChange={(e) => handleChange(key, e.target.value)} className="mt-2 mb-2" />
            </div>
          ))}
          <Button onClick={handleSave} className="px-6 py-3 rounded-md">
            Save
          </Button>
        </Card>
      </div>
    </div>
  );
};
