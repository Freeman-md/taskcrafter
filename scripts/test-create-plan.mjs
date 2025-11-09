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
    },
    {
        name: "edge-min-context",
        description: "Just enough context (20 chars) to validate boundary",
        payload: {
            title: "Edge context goal",
            deadline: tomorrow(),
            context: "LLLLLLLLLLLLLLLLLLLL"
        }
    },
    {
        name: "missing-title",
        description: "Required field omitted",
        payload: {
            deadline: tomorrow(),
            context:
                "Should fail because the title is missing even if everything else is valid."
        }
    },
    {
        name: "bad-deadline",
        description: "Deadline not parseable as a date",
        payload: {
            title: "Deadline typo",
            deadline: "not-a-date",
            context:
                "Should fail because the deadline cannot be coerced into a real date."
        }
    },
    {
        name: "short-context",
        description: "Context shorter than the 20 char minimum",
        payload: {
            title: "Short context",
            deadline: tomorrow(),
            context: "Need more info"
        }
    }
]

async function runTest({ name, description, payload }) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

    let body
    try {
        body = await response.json()
    } catch {
        const text = await response.text()
        body = {
            error: "Response body was not JSON",
            preview: text.slice(0, 200),
            contentType: response.headers.get("content-type")
        }
    }

    const statusFlag = response.ok ? "✅" : "❌"

    console.log(
        `${statusFlag} [${name}] ${response.status} ${response.statusText} – ${description}`,
    )
    console.log(JSON.stringify(body, null, 2))
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
