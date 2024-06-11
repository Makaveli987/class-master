"use client";

import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table/table";
import { useState } from "react";
import DebouncedInput from "../debounce-input";
import { DataTablePagination } from "./data-table-pagination";
import { cn } from "@/lib/utils";
import LinearLoader from "../linear-loader";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterPlaceholder: string;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  onRowClick?: (row: any, index?: number) => void;
  showSearchInput?: boolean;
  isLoading?: boolean;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);
  // Store the itemRank info
  addMeta({
    itemRank,
  });
  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  filterPlaceholder,
  children,
  onRowClick,
  className,
  headerClassName,
  showSearchInput = true,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between",
          showSearchInput ? "mb-5" : null
        )}
      >
        {showSearchInput && (
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block"
            placeholder={filterPlaceholder}
          />
        )}
        <div>{children}</div>
      </div>
      {isLoading ? <LinearLoader /> : <div className="h-1.5 w-full"></div>}
      <div className={cn("border !rounded-md", className)}>
        <Table>
          <TableHeader className={headerClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={onRowClick && "cursor-pointer"}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="pl-4"
                      key={cell.id}
                      onClick={() => {
                        if (cell.column.id !== "actions") {
                          onRowClick?.(row.original);
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination totalRecords={data.length} table={table} />
    </div>
  );
}
