import { IUser } from "../../models/user.model";

export interface IUserService {
  getAllUsers({
    limit,
    page,
    filter,
  }: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{data: IUser[], totalPage: number}>;
  findUserById(id: string): Promise<IUser | null>;
  changeAvatar(id: string, file: Express.Multer.File): Promise<string>;
  updateUserById({
    id,
    newData,
  }: {
    id: string;
    newData: Partial<IUser>;
  }): Promise<Record<string, any>>;
}
