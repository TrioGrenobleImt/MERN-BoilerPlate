import { useLogout } from "../../hooks/useLogout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Account = () => {
  const { logout, loading } = useLogout();
  const { t } = useTranslation();

  const handleClick = async (e: any) => {
    e.preventDefault();
    await logout();
  };

  return (
    <>
      <Button onClick={handleClick} variant="outline" disabled={loading}>
        {t("pages.account.logout")}
      </Button>
    </>
  );
};

export default Account;
