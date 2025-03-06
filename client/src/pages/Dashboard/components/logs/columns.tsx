import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LevelBadge } from "./levelBadge";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Copy, MoreHorizontal, Trash } from "lucide-react";

export type Log = {
  _id: string;
  level: string;
  message: string;
  user: {
    username: string;
  };
  createdAt: Date;
};

export const getColumns = (deleteLog: (id: string) => void): ColumnDef<Log>[] => [
  {
    accessorKey: "level",
    header: () => <div>Level</div>,
    cell: ({ row }) => {
      const value = row.getValue("level");
      return <LevelBadge level={value as any} />;
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <div>{row.getValue("message")}</div>,
  },
  {
    header: "User",
    accessorKey: "user.username",
    meta: { label: "User" },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" className="font-extrabold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      const formatted = format(new Date(value as Date), "dd/MM/yyyy HH:mm");
      return <div>{formatted}</div>;
    },
    meta: { label: "Date" },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const log = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem className="flex gap-4" onClick={() => navigator.clipboard.writeText(log._id)}>
              <Copy className="w-4 h-4" /> Copy log ID
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-4 text-destructive hover:!text-destructive" onClick={() => deleteLog(log._id)}>
              <Trash className="w-4 h-4 " />
              <span>Delete this log</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
