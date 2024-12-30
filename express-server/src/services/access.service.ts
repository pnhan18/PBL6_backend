import { Inject, Service } from "typedi";
import { ObjectId } from "mongodb";
import { IAccessService } from "./interfaces/Iaccess.service";
import { AuthFailureError, BadRequestError } from "../core/error.response";
import bcrypt from "bcrypt";
import Authentication from "../utils/authentication";
import { getInforData, replacePlaceHolder } from "../utils/index";
import { IUserRepository } from "../repositories/interface/Iuser.repository";
import { IRedisService } from "./interfaces/Iredis.service";
import { ITemplateRepository } from "../repositories/interface/Itemplate.repository";
import { IEmailService } from "./interfaces/Iemail.service";
import { UserRepository } from "../repositories/user.repository";
import { RedisService } from "./redis.service";
import { TemplateRepository } from "../repositories/template.repository";
import { EmailService } from "./email.service";

@Service()
export class AccessService implements IAccessService {
  @Inject(() => UserRepository)
  private userRepository!: IUserRepository;

  @Inject(() => RedisService)
  private redisService!: IRedisService;

  @Inject(() => TemplateRepository)
  private templateRepository!: ITemplateRepository;

  @Inject(() => EmailService)
  private emailService!: IEmailService;

  async signUp({
    email,
    username,
    password,
    gender,
    dateOfBirth,
  }: {
    email: string;
    username: string;
    password: string;
    gender: "male" | "female";
    dateOfBirth: Date;
  }) {
    const holderEmail = await this.userRepository.findByEmail({ email });
    if (holderEmail) {
      throw new BadRequestError("Email already in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarDefault =
      gender === "male"
        ? process.env.AVATAR_MALE_DEFAULT
        : process.env.AVATAR_FEMALE_DEFAULT;
    const newUser = await this.userRepository.save({
      username,
      email,
      password: hashPassword,
      gender,
      dateOfBirth,
      avatar: avatarDefault,
      createdAt: new Date(),
    });
    return getInforData(newUser, ["_id", "email", "username"]);
  }

  async loginWithGoogle({
    email,
    username,
    avatar,
    googleId
  }: {
    email: string;
    username: string;
    avatar: string;
    googleId: string;
  }) {
    let holder = await this.userRepository.findByEmail({ email });
    if(!holder) {
      holder = await this.userRepository.save({
        username,
        email,
        googleId,
        avatar,
        createdAt: new Date(),
      });
    }
    if(!holder.googleId) {
      holder = await this.userRepository.update(new ObjectId(holder._id), { googleId });
    }
    const user_id = holder!._id;
    let refreshToken = await this.redisService.get(`refreshToken:${user_id}`);
    let accessToken;
    if (!refreshToken) {
      refreshToken = Authentication.generateRefreshToken(email, user_id);
    }
    accessToken = Authentication.generateAccessToken(
      user_id,
      holder!.role,
      holder!.username,
      email
    );
    // save refreshToken to redis
    this.redisService.set(
      `refreshToken:${user_id}`,
      refreshToken,
      120 * 24 * 60 * 60
    );
    return {
      user: getInforData(holder!, [
        "_id",
        "email",
        "avatar",
        "username",
        "role",
        "avatar",
      ]),
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async logIn({ email, password }: { email: string; password: string }) {
    const holder = await this.userRepository.findByEmail({ email });
    if (!holder) {
      throw new BadRequestError("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, holder.password!);
    if (!isMatch) {
      throw new BadRequestError("Invalid email or password");
    }
    const user_id = holder._id;
    let refreshToken = await this.redisService.get(`refreshToken:${user_id}`);
    let accessToken;
    if (!refreshToken) {
      refreshToken = Authentication.generateRefreshToken(email, user_id);
    }
    accessToken = Authentication.generateAccessToken(
      user_id,
      holder.role,
      holder.username,
      email
    );
    // save refreshToken to redis
    this.redisService.set(
      `refreshToken:${user_id}`,
      refreshToken,
      120 * 24 * 60 * 60
    );
    return {
      user: getInforData(holder, [
        "_id",
        "email",
        "avatar",
        "username",
        "role",
        "avatar",
      ]),
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async logOut({ user_id }: { user_id: string }) {
    await this.redisService.del(`refreshToken:${user_id}`);
  }

  async changePassword({
    userId,
    oldPassword,
    newPassword,
    repeatPassword,
  }: {
    userId: string;
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  }) {
    if (newPassword !== repeatPassword) {
      throw new BadRequestError("Password does not match");
    }
    const holder = await this.userRepository.findById(new ObjectId(userId));
    if (!holder) {
      throw new BadRequestError("Invalid request");
    }
    const isMatch = await Authentication.passwordCompare(
      oldPassword,
      holder.password!
    );
    if (!isMatch) {
      throw new BadRequestError("Invalid password");
    }
    const hashPassword = await Authentication.passwordHash(newPassword);
    const newUser = await this.userRepository.update(new ObjectId(userId), {
      password: hashPassword,
    });
    const refreshToken = Authentication.generateRefreshToken(holder.email, holder._id);
    const accessToken = Authentication.generateAccessToken(
      userId,
      holder.role,
      holder.username,
      holder.email
    );
    // update refreshToken to redis
    this.redisService.set(
      `refreshToken:${userId}`,
      refreshToken,
      120 * 24 * 60 * 60
    );
    return {
      user: getInforData(newUser!, ["user_id", "username"]),
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async getAccessToken({
    userId,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
  }) {
    const decode = Authentication.validateToken(refreshToken);
    if (decode?.userId !== userId) {
      throw new AuthFailureError("Invalid token");
    }
    const holder = await this.userRepository.findById(new ObjectId(userId));
    if (!holder) {
      throw new BadRequestError("Invalid request");
    }
    const accessToken = await Authentication.generateAccessToken(
      holder._id,
      holder.role,
      holder.username,
      holder.email
    );
    return { accessToken };
  }

  async forgotPassword({ email }: { email: string }) {
    const holder = await this.userRepository.findByEmail({ email });
    if (!holder) {
      throw new BadRequestError("User not found!");
    }
    const token = Authentication.generateAccessTokenForgotPassWord(email);
    const resetURL = `${process.env.RESET_PASSWORD_FE_URL}/${token}`;
    const template = (await this.templateRepository.findByName({
      name: "HTML RESETPASSWORD",
    }))!.tem_html;
    const params = new Map<string, string>([
      ["username", holder.username],
      ["url", resetURL],
    ]);
    const content = replacePlaceHolder(template as string, params);
    await this.emailService.sendEmail(
      email,
      "Yêu cầu đặt lại mật khẩu",
      content
    );
  }

  async resetPassword({
    token,
    newPassword,
    repeatPassword,
  }: {
    token: string;
    newPassword: string;
    repeatPassword: string;
  }) {
    const decode = Authentication.validateToken(token);
    if (!decode) {
      throw new BadRequestError("Invalid token");
    }
    const email = decode.email;
    const holder = await this.userRepository.findByEmail({ email });
    if (!holder) {
      throw new BadRequestError("Invalid request");
    }
    if (newPassword !== repeatPassword) {
      throw new BadRequestError("Password does not match");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(new ObjectId(holder._id), {
      password: hashPassword,
    });
    return getInforData(holder, ["user_id", "email", "username"]);
  }
}

export default AccessService;
