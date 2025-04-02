import axiosConfig from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";

import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserForm } from "./userForm";

export type User = {
  _id: string;
  name: string;
  forename: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  avatar?: string;
  password?: string;
};

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

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

  function callback(action: string, data: any) {
    setSelectedUser(undefined);
    switch (action) {
      case "create":
        setAction("create");
        setOpenDialog(true);
        break;
      case "update":
        setSelectedUser(users.find((user) => user._id === data));
        setAction("update");
        setOpenDialog(true);
        break;
      case "delete":
        setSelectedUser(users.find((user) => user._id === data));
        setAction("delete");
        setOpenDialog(true);
      default:
        break;
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="container px-4 mx-auto">
        <DataTable columns={getColumns(callback)} data={users} fetchUsers={fetchUsers} isLoading={loading} callback={callback} />
      </div>
      {openDialog && (
        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{action.charAt(0).toUpperCase() + action.slice(1)} a user</DialogTitle>
              {action === "create" && <DialogDescription>Here you can give life to a new user</DialogDescription>}
            </DialogHeader>
            <UserForm dialog={setOpenDialog} refresh={fetchUsers} action={action} user={selectedUser} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
