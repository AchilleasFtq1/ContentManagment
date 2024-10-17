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
  async registerPhoneNumber(phoneNumber: string, password: string) {
    const existingPhone =
      await phoneNumberRepoInstance.getByPhoneNumber(phoneNumber);
    if (existingPhone) {
      throw new Error("Phone number already registered");
    }

    const hashedPassword = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    return await phoneNumberRepoInstance.create(phoneNumber, hashedPassword);
  }

  async getPhoneNumberDetails(id: string) {
    return await phoneNumberRepoInstance.getById(id);
  }

  async updatePhoneNumber(id: string, data: Record<string, unknown>) {
    if (data.password) {
      data.password = crypto
        .createHash("sha512")
        .update(data.password as string)
        .digest("hex");
    }
    return await phoneNumberRepoInstance.update(id, data);
  }

  async deletePhoneNumber(id: string) {
    return await phoneNumberRepoInstance.delete(id);
  }

  async getAllPhoneNumbers() {
    return await phoneNumberRepoInstance.getAll();
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwtVerify(token, JWT_SECRET);

      if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
      }

      return decoded; // Removed 'as JwtPayload'
    } catch (error) {
      console.error("Token validation error:", error);
      throw new Error("Invalid or expired token");
    }
  }

  async authenticatePhoneNumber(
    phoneNumber: string,
    password: string,
  ): Promise<{ token: string }> {
    if (!phoneNumber || !password) {
      throw new Error("Phone number and password are required");
    }

    const phoneRecord =
      await phoneNumberRepoInstance.getByPhoneNumber(phoneNumber);
    if (!phoneRecord) {
      throw new Error("Authentication failed");
    }

    const hashedPassword = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    if (phoneRecord.password !== hashedPassword) {
      throw new Error("Authentication failed");
    }

    const signOptions: SignOptions = { expiresIn: "1h" };

    const payload: JwtPayload = {
      sub: phoneRecord.id,
      phoneNumber: phoneNumber,
    };

    try {
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
