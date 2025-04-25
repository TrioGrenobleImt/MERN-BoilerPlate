import { axiosConfig } from "@/config/axiosConfig";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";

export const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logCount, setLogCount] = useState(0);

  async function fetchAllLogs(page: number = 0, size: number = 10) {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/logs?page=" + page + "&size=" + size);
      setLogs(response.data.logs);
      setLogCount(response.data.count);
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

  return (
    <div>
      <div className="container px-4 mx-auto">
        <DataTable
          logCount={logCount}
          columns={getColumns(deleteLog)}
          data={logs}
          fetchLogs={fetchAllLogs}
          isLoading={loading}
          deleteAllLogs={deleteAllLogs}
        />
      </div>
    </div>
  );
};
