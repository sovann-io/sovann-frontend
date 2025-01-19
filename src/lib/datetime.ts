export const generateScheduledDeployAt = (extraSeconds: number = 0): string => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (7 * 60 * 60 * 1000) + extraSeconds); // Add +7 hours
    const theFuture = futureDate.toISOString().slice(0, 19);
    return theFuture;
};

export const SCHEDULE_OFFSET = 7 * 60 * 60 * 1000;