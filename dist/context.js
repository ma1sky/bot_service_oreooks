import { Scenes, Context } from 'telegraf';
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["completed"] = 0] = "completed";
    TaskStatus[TaskStatus["inProgress"] = 1] = "inProgress";
    TaskStatus[TaskStatus["canceled"] = 2] = "canceled";
})(TaskStatus || (TaskStatus = {}));
//# sourceMappingURL=context.js.map