export type TaskDraft = {
    step?: "title" | "description" | "deadline"
    title?: string,
    description?: string,
    deadline?: Date,
    state?: "draft" | "completed",
    id?: number,
    currentIndex?: number
}

export type TasksCache = {
    tasksIds: number[],
    currentId: number,
    currentIndex: number
}

export type TaskAction =
    | "createTask"
    | "editTask"
    | "deleteTask"
    | "view"
    | "toggleState"

export type NavAction = "openMenu" | "prevTask" | "nextTask";

export type TaskFlowStep = "title" | "description" | "deadline" | "toggleState" | "view";