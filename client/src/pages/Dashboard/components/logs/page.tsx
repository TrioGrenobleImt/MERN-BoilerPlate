import axiosConfig from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAllLogs() {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/logs");
      setLogs(response.data.logs);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllLogs();
  }, []);

  return (
    <div>
      <div className="container py-10 mx-auto">
        <DataTable columns={columns} data={logs} fetchLogs={fetchAllLogs} isLoading={loading} />
      </div>
    </div>
  );
};
