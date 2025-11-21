import { GoalWithTasks } from "../types";


export const modifyGoalTasks = (goal: GoalWithTasks) => {
    const goalId = goal.id ?? crypto.randomUUID()

    goal.id = goalId

    goal.tasks = goal.tasks.map((task) => ({
        ...task,
        id: task.id ?? crypto.randomUUID()
    }))

    return goal
}
