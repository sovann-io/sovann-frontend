import { z } from "zod";

export interface Option {
    key: string;
    value: string;
}

export const optionSchema = z.object({
    key: z.string().min(1),
    value: z.string().min(1),
});

export type OptionValues = z.infer<typeof optionSchema>;