import crypto from "crypto";
import {
  type JwtPayload,
  type SignOptions,
  sign as jwtSign,
  verify as jwtVerify,
} from "jsonwebtoken";
import { PhoneNumberRepository } from "../repositories/PhoneNumberRepository";

const phoneNumberRepoInstance = new PhoneNumberRepository();
const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";

export class PhoneNumberService {
  // Register a new phone number with hashed password and active flag
  async registerPhoneNumber(
    phoneNumber: string,
    password: string,
    active: boolean,
  ) {
    // Check if the phone number is already registered
    const existingPhone =
      await phoneNumberRepoInstance.getByPhoneNumber(phoneNumber);
    if (existingPhone) {
      throw new Error("Phone number already registered");
    }

    // Hash the password
    const hashedPassword = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    // Create the new phone number record
    return await phoneNumberRepoInstance.create(
      phoneNumber,
      hashedPassword,
      active,
    );
  }
  // **New Method**: Update only the active status of a phone number
  async updatePhoneNumberActiveStatus(id: string, active: boolean) {
    return await phoneNumberRepoInstance.updateActiveStatus(id, active);
  }
  // Get details of a phone number by its ID
  async getPhoneNumberDetails(id: string) {
    return await phoneNumberRepoInstance.getById(id);
  }

  // Update phone number details, including password hashing if updated
  async updatePhoneNumber(id: string, data: Record<string, unknown>) {
    if (data.password) {
      data.password = crypto
        .createHash("sha512")
        .update(data.password as string)
        .digest("hex");
    }
    return await phoneNumberRepoInstance.update(id, data);
  }

  // Delete a phone number by its ID
  async deletePhoneNumber(id: string) {
    return await phoneNumberRepoInstance.delete(id);
  }

  // Get all phone numbers
  async getAllPhoneNumbers() {
    return await phoneNumberRepoInstance.getAll();
  }

  // Validate a JWT token
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwtVerify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error(
        "Token validation error:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Invalid or expired token");
    }
  }

  // Authenticate a phone number with its password and return a signed JWT
  async authenticatePhoneNumber(
    phoneNumber: string,
    password: string,
  ): Promise<{ token: string }> {
    if (!phoneNumber || !password) {
      throw new Error("Phone number and password are required");
    }

    // Find the phone number in the repository
    const phoneRecord =
      await phoneNumberRepoInstance.getByPhoneNumber(phoneNumber);
    if (!phoneRecord) {
      throw new Error("Authentication failed");
    }

    // Hash the input password and compare with the stored hashed password
    const hashedPassword = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");
    if (phoneRecord.password !== hashedPassword) {
      throw new Error("Authentication failed");
    }

    // JWT payload and options
    const payload: JwtPayload = {
      sub: phoneRecord.id,
      phoneNumber: phoneNumber,
    };
    const signOptions: SignOptions = { expiresIn: "1h" };

    try {
      // Sign the JWT and return it
      const token = jwtSign(payload, JWT_SECRET, signOptions);
      return { token };
    } catch (error) {
      console.error(
        "JWT signing error:",
        error instanceof Error ? error.message : "Unknown error",
      );
      throw new Error("Authentication failed");
    }
  }
}
