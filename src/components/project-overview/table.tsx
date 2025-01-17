import { useState } from "react";
import useDialogState from "@/hooks/use-dialog";
import TableListContextProvider, { TableListDialogType } from "@/providers/tanstack-table-provider";
import { ApplicationItem } from "@/types/application-item";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { DataTableSkeleton } from "../shared/table/data-table-skeleton";

export default function ProjectServiceTable({ data, loading }: { data: ApplicationItem[], loading: boolean }) {
    const [currentRow, setCurrentRow] = useState<any>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null)
    return (
        <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {/* Table component */}
            <div className='grid space-y-4 overflow-auto'>
                <div>
                    <h4 className="text-lg">Ungrouped Services</h4>
                </div>
                <div className="px-2">
                    {loading ?
                        <DataTableSkeleton columnCount={4} rowCount={20} />
                        :
                        <DataTable data={data} columns={columns} />
                    }
                </div>
            </div>
        </TableListContextProvider>
    )
}