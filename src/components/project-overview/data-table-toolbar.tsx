import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/shared/table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/shared/table/data-table-view-options'
import { DataTableExportOptions } from '@/components/shared/table/data-table-export-options'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <Input
                    placeholder='Filter tasks...'
                    value={
                        (table.getColumn('app_name')?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table.getColumn('app_name')?.setFilterValue(event.target.value)
                    }
                    className='h-8 w-[150px] lg:w-[250px]'
                />
                <div className='flex gap-x-2'>
                    {table.getColumn('status') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('status')}
                            title='Status'
                            options={[
                                { label: 'Active', value: 'Active'.toUpperCase() },
                                { label: 'Inactive', value: 'Inactive'.toUpperCase() },
                                { label: 'Draft', value: 'Draft'.toUpperCase() },
                                { label: 'Pending', value: 'Pending'.toUpperCase() },
                            ]}
                        />
                    )}
                </div>
                {isFiltered && (
                    <Button
                        variant='ghost'
                        onClick={() => table.resetColumnFilters()}
                        className='h-8 px-2 lg:px-3'
                    >
                        Reset
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>
            <div className='space-x-2 flex items-center'>
                <DataTableExportOptions table={table} />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}