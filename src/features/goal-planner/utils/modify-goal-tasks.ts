import { GoalWithTasks } from "../types";
import { v4 as uuidv4 } from 'uuid';


export const modifyGoalTasks = (goal: GoalWithTasks) => {
    goal.tasks = goal.tasks.map((task) => ({
        ...task,
        id: uuidv4()
    }))

    return goal
}