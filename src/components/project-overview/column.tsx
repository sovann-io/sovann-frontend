import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import LongText from '@/components/shared/text/long-text'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableRowActions } from './data-table-row-actions'
import { ApplicationItem } from '@/types/application-item'
import { callTypes } from './data'
import { DataTableBuildLogsActions } from './data-table-buildlogs-actions'
import { getMappingOption, SERVICE_TYPE } from '@/constants/misc'
import Link from 'next/link'

export const columns: ColumnDef<ApplicationItem>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px] mx-0.5'
            />
        ),
        meta: {
            className: cn(
                'sticky md:table-cell left-0 z-10 rounded-md',
                'bg-background transition-colors duration-0 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
            ),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px] mx-0.5'
            />
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: 'app_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Service Name' />
        ),
        cell: ({ row }) => {
            const { id } = row.original
            const { options } = row.original
            let serviceType = ''
            options?.map((option: any) => {
                if (option.key === SERVICE_TYPE) {
                    const values = option.value.split('_')
                    serviceType = values[0]
                }
            })
            if (id && serviceType) {
                return (
                    <Link href={`/${serviceType}/${id}/info`}>
                        <LongText className='max-w-36 underline'>{row.getValue('app_name')}</LongText>
                    </Link>
                )
            } else {
                return <LongText className='max-w-36'>{row.getValue('app_name')}</LongText>
            }
        },
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
                'bg-background transition-colors duration-0 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                'sticky left-6 md:table-cell z-10 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Description' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>{row.getValue('description')}</LongText>
        ),
    },
    {
        accessorKey: 'service_type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Service Type' />
        ),
        cell: ({ row }) => (
            <span>{getMappingOption(row.getValue('service_type'))}</span>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const { status } = row.original
            const badgeColor = callTypes.get(status as 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'PENDING')
            return (
                <div className='flex space-x-2'>
                    <Badge variant='outline' className={cn('capitalize', badgeColor)}>
                        {row.getValue('status')}
                    </Badge>
                </div>
            )
        },
        filterFn: 'weakEquals',
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: 'buildlogs',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Build Logs' />
        ),
        cell: DataTableBuildLogsActions,
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: DataTableRowActions,
    },
]