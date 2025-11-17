import { Goal } from "../types";
import { v4 as uuidv4 } from 'uuid';


export const modifyGoalTasks = (goal: Goal) => {
    goal.tasks = goal.tasks.map((task) => ({
        ...task,
        id: uuidv4()
    }))

    return goal
}