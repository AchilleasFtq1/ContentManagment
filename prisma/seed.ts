import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("securepassword", 10);

    // Create a user
    const user = await prisma.user.upsert({
      where: { username: "admin" },
      update: {}, // No updates if the user already exists
      create: {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword, // Save the hashed password
      },
    });

    console.log("User created:", user);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main(); // Use void to ensure no floating promise
