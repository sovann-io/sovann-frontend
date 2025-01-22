import { useEffect, useState } from "react";
import useDialogState from "@/hooks/use-dialog";
import TableListContextProvider, { TableListDialogType } from "@/providers/tanstack-table-provider";
import { ApplicationItem } from "@/types/application-item";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { DataTableSkeleton } from "../shared/table/data-table-skeleton";
import DataTableDialogContent from "../shared/table/data-table-dialog-content";
import ContainerLog from "../shared/container-log";
import { deleteAppNameById } from "@/services/application-service";
import { SERVICE_TYPE } from "@/constants/misc";
import { useRouter } from 'nextjs-toploader/app';
import { toast } from "sonner";

interface ProjectServiceTable {
    data: ApplicationItem[],
    loading: boolean,
    toRefresh: boolean,
    setToRefresh: (value: boolean) => void
}

export default function ProjectServiceTable({ data, loading, toRefresh, setToRefresh }: ProjectServiceTable) {
    const router = useRouter()
    const [currentRow, setCurrentRow] = useState<ApplicationItem | null>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null)
    const [error, setError] = useState<string>()

    useEffect(() => {
        async function getApplicationDetail() {
            if (open === 'view' && currentRow?.id) {
                try {
                    currentRow?.options?.map((option: any) => {
                        if (option.key === SERVICE_TYPE) {
                            const values = option.value.split('_')
                            router.push(`/${values[0]}/${currentRow.id}/info`)
                        }
                    })
                } catch (err) {
                    setError((err as any).message || 'An error occurred.');
                }
            }
        }
        getApplicationDetail()
    }, [open === 'view'])

    const handleConfirmDelete = async () => {
        if (currentRow?.id) {
            try {
                const response = await deleteAppNameById(currentRow.id)
                if (response.success) {
                    setToRefresh(!toRefresh)
                    toast.success('Service deleted successfully')
                }
            } catch (err) {
                setError((err as any).message || 'An error occurred.');
            }
        }
    }

    return (
        <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {/* Table component */}
            {/* {madeChangeLoading && <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                <div className="flex items-center space-x-2">
                    <Spinner />
                    <span>Loading...</span>
                </div>
            </div>} */}
            <div className='grid space-y-4 overflow-auto'>
                {/* <div>
                    <h4 className="text-lg">Ungrouped Services</h4>
                </div> */}
                <div className="px-2">
                    {loading ?
                        <DataTableSkeleton columnCount={4} rowCount={20} />
                        :
                        <DataTable data={data} columns={columns} />
                    }
                </div>
                {(open === 'log' && (
                    <DataTableDialogContent
                        open={open}
                        setOpen={setOpen}
                    >
                        <ContainerLog
                            appId={currentRow?.id || ''}
                        />
                    </DataTableDialogContent>
                ))}
                ({open === 'delete' && (
                    <DataTableDialogContent
                        open={open}
                        setOpen={setOpen}
                        onConfirmDelete={handleConfirmDelete}
                    >
                        <></>
                    </DataTableDialogContent>
                )})
            </div>
        </TableListContextProvider>
    )
}