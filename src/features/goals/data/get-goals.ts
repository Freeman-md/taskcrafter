import { prisma } from "@/lib/prisma";
import { Goal } from "@prisma/client";

export const getGoals = async () : Promise<Goal[] | null> => {
    try {
        const goals = await prisma.goal.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return goals
    } catch (error) {
        console.error("Error fetching goals: ", error)

        return null
    }
}