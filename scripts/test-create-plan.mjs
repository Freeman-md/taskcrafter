const BASE_URL =
    process.env.CREATE_PLAN_URL ??
    "http://localhost:3000/api/goal/create-plan"

const tomorrow = () => new Date(Date.now() + 86_400_000).toISOString()

const cases = [
    {
        name: "happy-path",
        description: "Standard goal with plenty of context",
        payload: {
            title: "Ship onboarding revamp",
            deadline: tomorrow(),
            context:
                "Evaluate tutorials, outline new flows, and define the hand-off work."
        }
    }
]

async function runTest({ name, description, payload }) {
    console.log(`▶️ [${name}] Starting test – ${description}`)

    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        console.error(`❌ Request failed: ${response.status}`)
        return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk directly to string
        const chunk = decoder.decode(value)
        console.log("🧩 Chunk received:", chunk)

        // Try to parse if it looks like JSON
        try {
            const event = JSON.parse(chunk)
            console.log("⚙️", event.status, "→", event.message || "(no message)")
            if (event.status === "complete") {
                console.log("✅ Plan:", JSON.stringify(event.plan, null, 2))
            }
        } catch {
            // not full JSON yet (partial chunk), ignore
        }
    }

    console.log(`✅ [${name}] Stream finished`)
    console.log("-".repeat(60))
}

async function main() {
    for (const testCase of cases) {
        await runTest(testCase)
    }
}

main().catch((error) => {
    console.error("Test runner crashed:", error)
    process.exit(1)
})
