import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb";
import Admin from "./models/admin";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

interface JwtPayload {
  adminId: string;
  adminEmail: string;
  iat?: number;
}

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export async function verifyToken(token: string) {
  try {
    await connectToDatabase();
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const admin = await Admin.findOne({ adminEmail: decoded.adminEmail });
    if (!admin) {
      return null;
    }
    if (
      admin.passwordChangedAt &&
      decoded?.iat &&
      admin.passwordChangedAt > decoded?.iat
    ) {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(password, hashedPassword);
}
