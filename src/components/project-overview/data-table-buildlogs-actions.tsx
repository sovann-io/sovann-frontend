import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ApplicationItem } from '@/types/application-item'
import { useRouter } from 'next/navigation'

interface DataTableRowActionsProps {
  row: Row<ApplicationItem>
}

export function DataTableBuildLogsActions({ row }: DataTableRowActionsProps) {
  const router = useRouter()
  return (
    <Button
      variant='ghost'
      onClick={() => {
        router.push(`/projects/${row.original.id}/buildlogs`)
      }}>
      View Logs
    </Button>
  )
}