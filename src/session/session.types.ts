export type AuthStep = 
    | "login"
    | "password"

export type TaskStep =
    | "taskTitle"
    | "taskDescription"
    | "taskDeadline"

export type SessionDraft =
  | { scene: "authScene"; step: AuthStep }
  | { scene: "taskCreateScene"; step: TaskStep }
  | { scene: "taskEditScene"; step: TaskStep }
  | { scene: "menuScene"; step: 'menu' }