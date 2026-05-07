export type TaskDraft = {
    step?: "title" | "description" | "deadline"
    title?: string,
    description?: string,
    deadline?: Date,
    state?: "draft" | "completed",
    id?: number,
    currentIndex?: number
}

export type TaskAction =
    | "createTask"
    | "viewTasks"
    | "editTask"
    | "deleteTask";

export type NavAction = "openMenu" | "prevTask" | "nextTask";

export type TaskFlowStep = "title" | "description" | "deadline" | "toggleState";