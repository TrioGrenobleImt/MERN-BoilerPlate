import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EllipsisVertical, RefreshCw, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchUsers: (pageIndex: number, pageSize: number) => void;
  isLoading: boolean;
  callback: (action: string, data: any) => void;
  userCount: number;
}

export function DataTable<TData, TValue>({ columns, data, fetchUsers, isLoading, callback, userCount }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchUsers(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(userCount / pagination.pageSize),
  });

  return (
    <div className="overflow-hidden border rounded-md">
      <div className="flex flex-col items-center justify-between gap-4 p-4 text-2xl md:flex-row">
        <div className="flex flex-col w-full gap-4 md:flex-row">
          <Input
            placeholder="Filter username"
            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
            className="w-full md:w-auto"
          />
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {(column.columnDef.meta as any)?.label ?? column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => fetchUsers(pagination.pageIndex, pagination.pageSize)} disabled={isLoading}>
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex gap-4" onClick={() => callback("create", null)}>
              <UserPlus className="w-4 h-4" />
              <span>Create a user</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-extrabold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                <div className="absolute top-0 left-0 z-10 w-full h-0.5 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-primary animate-loading" />
                </div>
                {Array.from({ length: table.getState().pagination.pageSize }).map((_, idx) => (
                  <TableRow key={`loading-row-${idx}`} className="animate-pulse">
                    {table.getAllLeafColumns().map((column) => (
                      <TableCell key={column.id}>
                        <div className="w-3/4 h-10 rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Separator />
      <div className="flex flex-col items-center justify-between gap-4 p-4 md:flex-row">
        <div className="text-sm text-gray-600">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong> • {userCount} total
          entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
            disabled={pagination.pageIndex === 0}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            disabled={pagination.pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            disabled={(pagination.pageIndex + 1) * pagination.pageSize >= userCount}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.floor((userCount - 1) / pagination.pageSize),
              }))
            }
            disabled={(pagination.pageIndex + 1) * pagination.pageSize >= userCount}
          >
            Last
          </Button>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => {
              if (value === "all") {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: userCount,
                  pageIndex: 0,
                }));
              } else {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                  pageIndex: 0,
                }));
              }
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Rows">
                {table.getState().pagination.pageSize === userCount ? "All" : `${table.getState().pagination.pageSize} per page`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} per page
                </SelectItem>
              ))}
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
