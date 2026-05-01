export enum TaskState {
    inProgress,
    completed
}

export type TaskSession = {
    step?: string,
    title?: string,
    description?: string,
    deadline?: string,
    createdAt?: string,
    state?: string
}