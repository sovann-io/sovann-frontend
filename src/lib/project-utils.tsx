import { Check } from "lucide-react";

export const displayAppStatus = (status: string) => {
    if (!status) return null; // Return nothing if no status is provided

    switch (status) {
        case 'ACTIVE':
            return (
                <span className="flex h-min items-center px-2 py-0.5 gap-2 border rounded-none bg-green-500 border-green-500 text-green-800">
                    <Check size={16} />
                    Active
                </span>
            );
        case 'PENDING':
        case 'INACTIVE':
            return (
                <span className="flex h-min items-center px-2 py-0.5 gap-2 border rounded-none bg-yellow-600 border-yellow-400 text-yellow-800">
                    <Check size={16} />
                    Inactive
                </span>
            );
        case 'DELETED':
            return <>A</>;
        default:
            return <>Unknown Status</>; // Optional fallback
    }
}