import { useState } from "react";
import { useConfigStore } from "@/stores/configStore";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Card } from "@/components/ui/card"; // ShadCN Card
import { Label } from "@/components/ui/label"; // ShadCN Label

export const Config = () => {
  const { config } = useConfigStore();
  const [localConfig, setLocalConfig] = useState(config);

  const handleChange = (key: string, value: string) => {
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  const handleSave = async (keys: Array<string>) => {
    // TODO: Sauvegarder la nouvelle valeur, tu peux l'envoyer à ton backend ici
  };

  return (
    <div>
      <div className="container px-4 mx-auto">
        <Card className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">Configuration</h2>
          {Object.entries(localConfig).map(([key, value]) => (
            <div key={key} className="mb-4">
              <Label htmlFor={key} className="block font-medium text-gray-700">
                {key}
              </Label>
              <Input id={key} type="text" value={value} onChange={(e) => handleChange(key, e.target.value)} className="mt-2 mb-2" />
            </div>
          ))}
          <Button onClick={() => handleSave([])} className="w-full">
            Save
          </Button>
        </Card>
      </div>
    </div>
  );
};
