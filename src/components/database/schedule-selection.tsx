import { DateTimePicker } from '@/components/shared/date-time-picker';
import { ScheduleSectionProps } from '@/types/database-item';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

export const ScheduleSection = ({
    isEnabled,
    date,
    onEnableChange,
    onDateChange,
    onDisable,
}: ScheduleSectionProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div>
            <Label className="text-base font-medium text-gray-900 dark:text-gray-300">
                Schedule
            </Label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                When should the database be created?
            </p>
        </div>
        <div className="flex items-center space-x-2">
            <Checkbox
                id="terms"
                checked={isEnabled}
                onCheckedChange={(checked) => {
                    onEnableChange(checked === true);
                    if (!checked) {
                        onDisable();
                    }
                }}
            />
            <label htmlFor="terms" className="text-sm font-medium leading-none">
                Enable automatic instance creation
            </label>
        </div>
        <div>
            <DateTimePicker
                value={date}
                onChange={onDateChange}
                className="w-[280px]"
                disabled={!isEnabled}
            />
        </div>
    </div>
);

