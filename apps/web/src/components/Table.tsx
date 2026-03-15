import { capitalized, cn } from "@app/shared"
import {
  type Column,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type RowData,
  useReactTable
} from "@tanstack/react-table"
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react"
import { useState } from "react"
import { DebouncedText } from "./form/primitives/Text"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "role" | "period"
  }
}

type PeriodFilter = [Date | undefined, Date | undefined]

const USER_ROLES = ["admin", "user"] as const

export function Table({ columns, rows }: Readonly<{ columns: any[]; rows: any[] }>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "createdAt",
          desc: true
        }
      ]
    },
    state: {
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters
  })

  const toggleSorting = (columnId: string) => {
    const currentSort = table.getState().sorting.find(sort => sort.id === columnId)
    table.setSorting([currentSort && !currentSort.desc ? { id: columnId, desc: true } : { id: columnId, desc: false }])
  }

  return (
    <div className="p-2">
      <table className="w-full table-auto">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-4 text-left border-b border-gray-500 align-top">
                  {header.isPlaceholder ? null : (
                    <>
                      <button
                        type="button"
                        className={cn(
                          "flex gap-2 items-center",
                          header.column.getCanSort() && "cursor-pointer",
                          header.column.getIsSorted() && "select-none",
                          header.column.getCanSort() && !header.column.getIsSorted() && "mr-[29px]"
                        )}
                        onClick={() => header.column.getCanSort() && toggleSorting(header.column.id)}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowDownAZ size={21} className="text-gray-400" />,
                          desc: <ArrowUpAZ size={21} className="text-gray-400" />
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                      {header.column.getCanFilter() ? (
                        <div className="flex flex-col gap-1 mt-1">
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-4 border-b border-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Filter({ column }: Readonly<{ column: Column<any, unknown> }>) {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}

  switch (filterVariant) {
    case "role":
      return (
        <select
          name="role[]"
          multiple
          size={USER_ROLES.length}
          onChange={ev => {
            const values = [...ev.target.selectedOptions].map(o => o.value)
            column.setFilterValue(values.length < USER_ROLES.length ? values : [])
          }}
        >
          {USER_ROLES.map(role => (
            <option key={role} value={role}>
              {capitalized(role)}
            </option>
          ))}
        </select>
      )

    case "period": {
      const values = (columnFilterValue ? (columnFilterValue as PeriodFilter) : [undefined, undefined]).map(
        v => (typeof v === "object" ? v.toISOString().split("T")[0] : undefined) // FIXME: check with timezones
      )
      return (
        <>
          <DebouncedText
            type="date"
            placeholder="From"
            variant="simple"
            value={values[0] ?? ""}
            onChange={value => {
              column.setFilterValue((old: PeriodFilter) => [
                value ? new Date(`${value} 00:00:00`) : undefined,
                old?.[1]
              ])
            }}
          />
          <DebouncedText
            type="date"
            placeholder="To"
            variant="simple"
            value={values[1] ?? ""}
            onChange={value =>
              column.setFilterValue((old: PeriodFilter) => [
                old?.[0],
                value ? new Date(`${value} 23:59:59`) : undefined
              ])
            }
          />
        </>
      )
    }

    case "text":
    default:
      return (
        <DebouncedText
          placeholder="Search..."
          variant="simple"
          onChange={value => column.setFilterValue(value)}
          value={(columnFilterValue ?? "") as string}
          debounce={500}
        />
      )
  }
}
