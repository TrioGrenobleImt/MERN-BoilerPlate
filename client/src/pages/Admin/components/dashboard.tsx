import { Loading } from "@/components/customs/loading";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { axiosConfig } from "@/config/axiosConfig";
import { useSocketContext } from "@/contexts/socketContext";
import { Activity, LogIn, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [authTypes, setAuthType] = useState<{ label: string; value: number }[]>();
  const { onlineUsers } = useSocketContext();
  const { t } = useTranslation();

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
      toast.error(t(error.response.data.error));
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
      toast.error(t(error.response.data.error));
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
                <CardTitle className="text-sm font-medium">{t("pages.admin.dashboard_page.active_users")}</CardTitle>
                <Activity className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+ {onlineUsers.length}</div>
              </CardContent>
            </Card>

            <Card className="max-h-[120px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("pages.admin.dashboard_page.total_users")}</CardTitle>
                <Users className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+ {userCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>{t("pages.admin.dashboard_page.auth_methods")}</CardTitle>
                  <LogIn className="w-4 h-4 text-accent" />
                </div>
                <CardDescription>{t("pages.admin.dashboard_page.auth_methods_description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...(authTypes ?? [])]
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => {
                      const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500"];
                      const color = colors[index % colors.length];

                      return (
                        <div key={item.label} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full ${color}`} />
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {Math.round((item.value / userCount) * 100)}% {t("pages.admin.dashboard_page.of_users")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{item.value}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
