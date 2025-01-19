import { DATABASE_VERSIONS } from "@/configs/version-config";
import { DatabaseType } from "@/types/database-item";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface VersionSelectProps {
    dbType: DatabaseType;
    onValueChange: (value: string) => void;
    defaultValue?: string;
}

export const VersionSelect = ({
    dbType,
    onValueChange,
    defaultValue = 'latest'
}: VersionSelectProps) => {
    const config = DATABASE_VERSIONS[dbType];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div>
                <Label className="text-base font-medium text-gray-900 dark:text-gray-300">
                    Version
                </Label>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {config.description}
                </p>
            </div>
            <Select onValueChange={onValueChange} defaultValue={defaultValue}>
                <SelectTrigger className="col-span-1 sm:col-span-3 h-full w-full">
                    <SelectValue placeholder={defaultValue} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Version</SelectLabel>
                        {config.versions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};
