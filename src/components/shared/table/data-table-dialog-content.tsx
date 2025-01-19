import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TableListDialogType } from "@/providers/tanstack-table-provider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DataTableDialogContentProps {
    children: React.ReactNode;
    open: string;
    setOpen: (str: TableListDialogType | null) => void,
    onConfirmDelete?: () => void
}

const DataTableDialogContent = ({ children, open, setOpen, onConfirmDelete }: DataTableDialogContentProps) => {
    return (
        <>
            <Dialog open={open === 'log'} onOpenChange={() => { setOpen(null) }}>
                <DialogContent className="w-full">
                    <DialogHeader>
                        <DialogTitle>Information</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        {children}
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={() => { setOpen(null) }}>
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialog open={open === 'delete'}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your room information.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setOpen(null)
                            }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            onConfirmDelete && onConfirmDelete()
                            setOpen(null)
                        }}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DataTableDialogContent;