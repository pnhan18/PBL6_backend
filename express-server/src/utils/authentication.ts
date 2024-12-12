import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Payload {
  userId?: string;
  role?: string;
  username?: string;
  email: string;
}

class Authentication {
  public static async passwordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public static async passwordCompare(
    text: string,
    encryptedText: string
  ): Promise<boolean> {
    return await bcrypt.compare(text, encryptedText);
  }

  public static generateAccessToken(
    id: string,
    role: string,
    username: string,
    email: string
  ) {
    const secretKey: string = process.env.JWT_SECRET_KEY || "my-secret-key";
    const payload: Payload = {
      userId: id,
      role: role,
      username: username,
      email: email,
    };
    const optionAccess = { expiresIn: process.env.ACCESS_TOKEN_EXPIRY };
    return jwt.sign(payload, secretKey, optionAccess);
  }

  public static generateAccessTokenForgotPassWord(
    email: string
  ) {
    const secretKey: string = process.env.JWT_SECRET_KEY || "my-secret-key";
    const payload: Payload = {
      email: email,
    };
    const optionAccess = {
      expiresIn: process.env.JWT_ACCESS_FORGOT_PASSWORD_EXPIRES_IN,
    };
    return jwt.sign(payload, secretKey, optionAccess);
  }

  public static generateRefreshToken(email: string) {
    const secretKey: string = process.env.JWT_SECRET_KEY || "my-secret-key";
    const payload: Payload = {
      email: email,
    };
    const optionRefresh = { expiresIn: process.env.REFRESH_TOKEN_EXPIRY };
    return jwt.sign(payload, secretKey, optionRefresh);
  }

  public static validateToken(token: string): Payload | null {
    try {
      const secretKey: string = process.env.JWT_SECRET_KEY || "my-secret-key";
      return jwt.verify(token, secretKey) as Payload;
    } catch (err) {
      return null;
    }
  }

  public static createActivationToken(email: string) {
    try {
      const secretKey: string = process.env.JWT_SECRET_KEY || "my-secret-key";
      const payload: Payload = {
        email: email,
      };
      const optionAccess = { expiresIn: "24h" };
      return jwt.sign(payload, secretKey, optionAccess);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default Authentication;
