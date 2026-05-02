export type AuthStep = 
    | "login"
    | "password"

export type TaskStep =
    | "task_title"
    | "task_description"
    | "task_deadline"

export type SessionDraft =
  | { scene: "auth"; step: AuthStep }
  | { scene: "taskCreate"; step: TaskStep }
  | { scene: "taskEdit"; step: TaskStep }
  | { scene: "menu"; step: 'menu' }