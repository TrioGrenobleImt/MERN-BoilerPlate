import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LevelBadge } from "./levelBadge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Log = {
  _id: string;
  level: string;
  message: string;
  user: {
    username: string;
  };
  createdAt: Date;
};

export const columns: ColumnDef<Log>[] = [
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
    header: () => <div>Message</div>,
  },
  {
    header: "User",
    accessorKey: "user.username",
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Date</div>,
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      const formatted = format(new Date(value as Date), "dd/MM/yyyy HH:mm");

      return <div>{formatted}</div>;
    },
  },
];
