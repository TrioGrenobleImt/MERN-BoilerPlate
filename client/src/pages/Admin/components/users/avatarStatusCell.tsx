import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/socketContext";
import { User } from ".";

interface AvatarWithStatusCellProps {
  user: User;
}

export const AvatarWithStatusCell = ({ user }: AvatarWithStatusCellProps) => {
  const { onlineUsers } = useSocket(user._id);
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div className="relative w-10 h-10">
      <Avatar>
        <AvatarImage src={user.avatar} alt="User Avatar" className="object-cover object-center w-full h-full rounded-full" />
      </Avatar>
      <div
        className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
      />
    </div>
  );
};
