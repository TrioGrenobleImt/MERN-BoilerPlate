import { Loading } from "@/components/customs/loading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { axiosConfig } from "@/config/axiosConfig";
import { useSocketContext } from "@/contexts/socketContext";
import { Activity, Users, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [authTypes, setAuthType] = useState<{ label: string; value: number }[]>();
  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/users");
      setUserCount(response.data.count);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/users/stats/authTypes");
      setAuthType(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col px-4 space-y-4 md:space-y-6 md:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card className="max-h-[120px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active users</CardTitle>
                <Activity className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+ {onlineUsers.length}</div>
              </CardContent>
            </Card>

            <Card className="max-h-[120px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Registrations</CardTitle>
                <Users className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+ {userCount}</div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Auth methods</CardTitle>
                <BarChart3 className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[200px]">
                <PieChart
                  series={[
                    {
                      data: authTypes || [],
                      arcLabel: (item: any) => `${item.value}`,
                      arcLabelMinAngle: 25,
                      arcLabelRadius: "60%",
                      color: "#4f46e5",
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fontWeight: "bold",
                      fontSize: 15,
                      fill: "#fff",
                    },
                  }}
                  width={300}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export const valueFormatter = (item: { value: number }) => `${item.value}%`;
