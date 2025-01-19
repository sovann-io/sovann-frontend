import * as z from 'zod';

/* eslint-disable @typescript-eslint/no-unused-vars */
const applicationStatusSchema = z.union([
    z.literal('DRAFT'),
    z.literal('ACTIVE'),
    z.literal('INACTIVE'),
    z.literal('PENDING'),
    z.literal('Running'),
    z.literal('Unknown')
])
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>

export const callTypes = new Map<ApplicationStatus, string>([
    ['ACTIVE', 'bg-green-100/30 text-green-900 dark:text-teal-200 border-teal-200'],
    ['Running', 'bg-green-100/30 text-green-900 dark:text-teal-200 border-teal-200'],
    ['Unknown', 'bg-neutral-100/30 text-neutral-900 dark:text-neutral-200 border-neutral-200'],
    ['DRAFT', 'bg-neutral-300/40 border-neutral-300'],
    ['INACTIVE', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
    ['PENDING', 'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200'],
])

