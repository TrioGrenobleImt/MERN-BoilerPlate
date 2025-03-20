import { Loading } from "@/components/Loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/authContext";

const Account = () => {
  const { authUser, loading } = useAuthContext();

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Avatar className="relative w-20 h-20 transition-shadow duration-300 ease-in-out border-2 border-gray-300 shadow-lg hover:shadow-xl">
        <AvatarImage src={`${import.meta.env.VITE_API_URL + authUser.avatar}`} className="object-cover rounded-full" alt="User Avatar" />
      </Avatar>
    </div>
  );
};

export default Account;
