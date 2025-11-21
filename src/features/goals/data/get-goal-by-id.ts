import { prisma } from "@/lib/prisma"
import { Goal } from "@prisma/client"
import { unstable_noStore as noStore } from "next/cache"

export const getGoalById = async (id: Goal["id"]) => {
    noStore()
    
    const goal = await prisma.goal.findUnique({
        where: { id },
    })

    return goal
}