import { axiosConfig } from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";

export const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAllLogs() {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/logs");
      setLogs(response.data.logs);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteLog(logId: string) {
    try {
      const response = await axiosConfig.delete(`/logs/${logId}`);
      toast.success(response.data.message);
      fetchAllLogs();
    } catch (error: any) {
      toast.error(error.response);
    }
  }

  async function deleteAllLogs() {
    try {
      const response = await axiosConfig.delete(`/logs`);
      toast.success(response.data.message);
      fetchAllLogs();
    } catch (error: any) {
      toast.error(error.response);
    }
  }

  useEffect(() => {
    fetchAllLogs();
  }, []);

  return (
    <div>
      <div className="container px-4 mx-auto">
        <DataTable columns={getColumns(deleteLog)} data={logs} fetchLogs={fetchAllLogs} isLoading={loading} deleteAllLogs={deleteAllLogs} />
      </div>
    </div>
  );
};
