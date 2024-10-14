import crypto from "crypto";
import {
  type JwtPayload,
  type SignOptions,
  sign as jwtSign,
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
    const hashedPassword: string = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");
    return phoneNumberRepoInstance.create(phoneNumber, hashedPassword);
  }

  async getPhoneNumberDetails(id: string) {
    return phoneNumberRepoInstance.getById(id);
  }

  async updatePhoneNumber(id: string, data: Record<string, unknown>) {
    if (data.password) {
      data.password = crypto
        .createHash("sha512")
        .update(data.password as string)
        .digest("hex");
    }
    return phoneNumberRepoInstance.update(id, data);
  }

  async deletePhoneNumber(id: string) {
    return phoneNumberRepoInstance.delete(id);
  }

  async getAllPhoneNumbers() {
    return phoneNumberRepoInstance.getAll();
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

    const hashedPassword: string = crypto
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
      const token: string = jwtSign(payload, JWT_SECRET, signOptions);
      return { token };
    } catch (error: unknown) {
      console.error(
        "JWT signing error:",
        error instanceof Error ? error.message : "Unknown error",
      );
      throw new Error("Authentication failed");
    }
  }
}
