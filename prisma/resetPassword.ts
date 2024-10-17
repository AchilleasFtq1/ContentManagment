import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Reset the user's password by username or email after verifying the reset code.
 *
 * @param usernameOrEmail - The username or email of the user.
 * @param newPassword - The new password for the user.
 * @param resetCode - The reset code to verify (fixed at 11223344 for this example).
 */
async function resetPassword(
  usernameOrEmail: string,
  newPassword: string,
  resetCode: string,
) {
  // Hardcoded reset code check
  if (resetCode !== "11223344") {
    throw new Error("Invalid reset code");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Find the user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Update the user's password with the new hashed password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  console.log(`Password successfully reset for user: ${user.username}`);
}

// Example usage:
async function main() {
  try {
    // Call resetPassword with the username or email, new password, and reset code
    await resetPassword("admin", "newSecurePassword123", "11223344");
  } catch (error) {
    console.error("Error resetting password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

void main(); // Use void to ignore the promise
