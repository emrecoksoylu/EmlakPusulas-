
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log("Starting debug script...")
    try {
        const email = `test-${Date.now()}@example.com`
        const password = "password123"
        const name = "Test User"

        console.log("Hashing password...")
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log("Password hashed.", hashedPassword)

        console.log("Creating agent...")
        const agent = await prisma.agent.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        })
        console.log("Agent created successfully:", agent)
    } catch (error) {
        console.error("FATAL ERROR:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
