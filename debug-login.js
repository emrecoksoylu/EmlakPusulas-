
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = "emre@test.com" // I need to know the email the user used. 
    // Since I don't know it, I will list all agents first.

    console.log("Listing all agents...")
    const agents = await prisma.agent.findMany()
    console.log("Found agents:", agents.map(a => ({ email: a.email, passwordPrefix: a.password?.substring(0, 10) })))

    if (agents.length > 0) {
        const target = agents[agents.length - 1] // Last registered
        console.log(`\nTesting login for last user: ${target.email}`)

        // I don't know the password they used.
        // But I can try to register a new one and login with it in this script to verify the FLOW.

        const testPass = "password123"
        const hashed = await bcrypt.hash(testPass, 10)

        const match = await bcrypt.compare(testPass, hashed)
        console.log(`Self-test bcrypt match: ${match}`)

        if (target.password) {
            // I can't verify their password without knowing it.
            // But I can verify my previous debug user if it exists.
        }
    }
}

main()
