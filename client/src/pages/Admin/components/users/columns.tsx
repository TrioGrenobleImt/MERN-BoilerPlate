import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Copy, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { AvatarWithStatusCell } from "../../../../components/customs/avatarStatusCell";
import { UserInterface } from "@/interfaces/User";
import { Badge } from "@/components/ui/badge";
import { TFunction } from "i18next";
import { UserRoleBadge } from "@/components/customs/userRoleBadge";

export const getColumns = (callback: (action: string, data: any) => void, t: TFunction<"translation">): ColumnDef<UserInterface>[] => [
  {
    accessorKey: "user",
    header: t("pages.admin.users_page.user"),
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
        {t("pages.admin.users_page.role")} <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("role");
      return <UserRoleBadge role={value as any} />;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("pages.admin.users_page.username")}
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("pages.admin.users_page.email")}
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "auth_type",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("pages.admin.users_page.auth_type")}
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <Badge variant={"outline"}>{(row.getValue("auth_type") as string).replace(/^./, (c) => c.toUpperCase())}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" className="font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("pages.admin.users_page.joined")}
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
    header: t("pages.admin.users_page.actions"),
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
                toast.success(t("pages.admin.users_page.copy_id_success"));
              }}
            >
              <Copy className="w-4 h-4" />
              {t("pages.admin.users_page.copy_id")}
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-4" onClick={() => callback("update", user._id)}>
              <Pencil className="w-4 h-4" /> {t("pages.admin.users_page.update_user")}
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-4 text-destructive hover:text-destructive!" onClick={() => callback("delete", user._id)}>
              <Trash className="w-4 h-4" /> {t("pages.admin.users_page.delete_user")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
