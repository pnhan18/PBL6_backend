import { Inject, Service } from "typedi";
import { IUserService } from "./interfaces/Iuser.service";
import { IUserRepository } from "../repositories/interface/Iuser.repository";
import { IUser } from "../models/user.model";
import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import { UserRepository } from "../repositories/user.repository";
import { UploadSerivce } from "./upload.service";
import { getInforData } from "../utils";

@Service()
export class UserService implements IUserService {
  @Inject(() => UserRepository)
  private userRepository!: IUserRepository;

  @Inject(() => UploadSerivce)
  private uploadService!: UploadSerivce;

  async getAllUsers({
    limit = 50,
    page = 1,
    filter,
  }: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{data: IUser[], totalPage: number}> {
    const {data: users, totalPage} = await this.userRepository.findAll({
      limit,
      page,
      filter: filter || {},
      select: ["_id", "username", "email", "avatar", "role"],
    });
    if(!users.length) {
      throw new BadRequestError("Users not found");
    }
    return { data: users, totalPage};
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(new Types.ObjectId(id), [
      "_id",
      "username",
      "email",
      "avatar",
      "role"
    ]);
  }

  async changeAvatar(id: string, file: Express.Multer.File): Promise<string> {
    const holder = await this.userRepository.findById(new Types.ObjectId(id));
    if (!file) {
      throw new BadRequestError("file missing");
    }
    if (!holder) {
      throw new BadRequestError("User not found");
    }
    const { url, imageName } = await this.uploadService.uploadImageFromLocal({
      file,
    });
    const newData = { avatar: imageName };
    await this.userRepository.update(new Types.ObjectId(id), newData);
    return url;
  }

  async updateUserById({
    id,
    newData,
  }: {
    id: string;
    newData: Partial<IUser>;
  }): Promise<Record<string, any>> {
    const holder = await this.userRepository.findById(new Types.ObjectId(id));
    if (!holder) {
      throw new BadRequestError("user not found");
    }
    const newUser = await this.userRepository.update(
      new Types.ObjectId(id),
      newData
    );
    return getInforData(newUser!, [
      "username",
      "email",
      "avatar",
      "gender",
      "birthday",
    ]);
  }
}
