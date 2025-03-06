"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Valeur par défaut des lignes par page
      },
    },
  });

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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

      {/* Zone de pagination améliorée */}
      <div className="flex items-center justify-between p-4">
        {/* Info sur la pagination */}
        <div className="text-sm text-gray-600">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> sur <strong>{table.getPageCount()}</strong> • {data.length}{" "}
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
