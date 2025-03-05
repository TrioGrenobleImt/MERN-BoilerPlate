import { Loading } from "@/components/Loading";
import axiosConfig from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllLogs();
  }, []);

  return (
    <div>
      {loading && <Loading />}
      <ul>
        {logs.map((log: any, index) => (
          <>
            <span className="font-bold">Log #{index}</span>
            <li key={log._id}>
              <p>{log.message}</p>
              <p>{log.createdAt}</p>
            </li>
            <br />
          </>
        ))}
      </ul>
    </div>
  );
};
