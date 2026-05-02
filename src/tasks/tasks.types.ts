export type TaskDraft = {
    step?: "title" | "description" | "deadline"
    title?: string,
    description?: string,
    deadline?: Date,
    state?: "draft" | "completed"
}