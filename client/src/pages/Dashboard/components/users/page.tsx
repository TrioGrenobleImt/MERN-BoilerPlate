import axiosConfig from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/users");
      setUsers(response.data.users);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: string) {
    try {
      const response = await axiosConfig.delete(`/users/${userId}`);
      toast.success(response.data.message);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="container py-10 mx-auto">
        <DataTable columns={getColumns(deleteUser)} data={users} fetchUsers={fetchUsers} isLoading={loading} />
      </div>
    </div>
  );
};
