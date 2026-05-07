import {
	titleSchema,
	descriptionSchema,
	deadlineSchema,
	taskSchema
} from "./tasks.schema";

class TaskValidator {
	validateTitle(title: string) {
		return titleSchema.safeParse(title);
	}

	validateDescription(description: string) {
		return descriptionSchema.safeParse(description);
	}

	validateDeadline(date: string) {
		return deadlineSchema.safeParse(date);
	}

	validateTask(task: unknown) {
		return taskSchema.safeParse(task);
	}
}

export default new TaskValidator();