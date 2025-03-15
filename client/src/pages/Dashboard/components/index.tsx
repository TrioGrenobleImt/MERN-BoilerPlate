import { Loading } from "@/components/Loading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axiosConfig from "@/config/axiosConfig";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/users");
      setUserCount(response.data.users.length);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  });
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col p-4 space-y-4 md:space-y-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Nombres d'utilisateurs</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"> + {userCount}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
