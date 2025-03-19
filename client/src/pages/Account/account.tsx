import { Loading } from "@/components/Loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/authContext";
import { useLogout } from "@/hooks/useLogout";

const Account = () => {
  const { authUser, loading } = useAuthContext();
  const { logout } = useLogout();

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Avatar className="relative w-20 h-20 transition-shadow duration-300 ease-in-out border-2 border-gray-300 shadow-lg hover:shadow-xl">
        <AvatarImage src={`${authUser.avatar}`} className="object-cover rounded-full" alt="User Avatar" />
      </Avatar>
    </div>
  );
};

export default Account;
