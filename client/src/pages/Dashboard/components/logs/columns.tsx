import { ColumnDef } from "@tanstack/react-table";

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
    header: "Level",
    accessorKey: "level",
  },
  {
    header: "Message",
    accessorKey: "message",
  },
  {
    header: "User",
    accessorKey: "user.username",
  },
  {
    header: "Date",
    accessorKey: "createdAt",
  },
];
