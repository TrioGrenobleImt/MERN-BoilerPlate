"use client";

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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EllipsisVertical, RefreshCw, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchLogs: () => void;
  deleteAllLogs: () => void;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({ columns, data, fetchLogs, isLoading, deleteAllLogs }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    initialState: {
      pagination: {
        pageSize: 10, // Valeur par défaut des lignes par page
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  columns;

  return (
    <div className="border rounded-md">
      <div className="flex items-center justify-between p-4 text-2xl">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 ">
            <Input
              placeholder="Filter events..."
              value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("message")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {(column.columnDef.meta as any)?.label ?? column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex gap-4 text-destructive hover:!text-destructive" onClick={() => deleteAllLogs()}>
              <Trash className="w-4 h-4 " />
              <span>Delete all logs</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-extrabold ">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow className="relative">
              <TableCell colSpan={columns.length} className="relative h-0 p-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-300 dark:bg-gray-700 overflow-hidden">
                  <div className="w-full h-full bg-black dark:bg-gray-900 animate-marquee"></div>
                </div>
              </TableCell>
            </TableRow>
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
                No logs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Separator />
      {/* Pagination */}
      <div className="flex items-center justify-between p-4">
        {/* Infos pagination */}
        <div className="text-sm text-gray-600">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> sur <strong>{table.getPageCount()}</strong> • {data.length} {""}
          entrées au total
        </div>

        {/* Contrôles de pagination */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            Première
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Précédente
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Suivante
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Dernière
          </Button>

          {/* Sélecteur du nombre de lignes par page */}
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(value === "Infinity" ? data.length : Number(value))}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Rows">
                {table.getState().pagination.pageSize === data.length ? "Tout" : `${table.getState().pagination.pageSize} par page`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} par page
                </SelectItem>
              ))}
              <SelectItem value="Infinity">Tout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
