export type Schedule = {
    week: number;
    weekType: number;
    dayOfWeek: string;
    date: Date;
    lessons: {
        lesson_name: string;
        lesson_type: string;
        start: Date;
        end: Date;
        teacher: string;
        classroom: string;
    }[];
};
export declare function getTodaySchedule(): Promise<string>;
export declare function formatSchedule(params: Schedule): Promise<string>;
export declare const mockSchedule: Schedule;
//# sourceMappingURL=schedule.api.d.ts.map