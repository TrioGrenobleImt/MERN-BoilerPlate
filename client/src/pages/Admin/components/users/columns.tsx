import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Copy, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { AvatarWithStatusCell } from "../../../../components/ui/customs/avatarStatusCell";
import { UserInterface } from "@/interfaces/User";

export const getColumns = (callback: (action: string, data: any) => void): ColumnDef<UserInterface>[] => [
  {
    accessorKey: "Identity",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-4">
          <AvatarWithStatusCell user={user} />
          <div className="flex flex-col">
            <span className="font-medium">
              {user.name} {user.forename}
            </span>
            <span className="text-sm text-muted-foreground">{user.username}</span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Role
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("role");
      return <div>{(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}</div>;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Username
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Email
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Joined
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      const formatted = format(new Date(value as Date), "dd/MM/yyyy HH:mm");
      return <div>{formatted}</div>;
    },
    meta: { label: "Joined" },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="flex gap-4"
              onClick={() => {
                navigator.clipboard.writeText(user._id);
                toast.success("User ID copied to clipboard");
              }}
            >
              <Copy className="w-4 h-4" /> Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-4" onClick={() => callback("update", user._id)}>
              <Pencil className="w-4 h-4" /> Update this user
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-4 text-destructive hover:!text-destructive" onClick={() => callback("delete", user._id)}>
              <Trash className="w-4 h-4" /> Delete this user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
