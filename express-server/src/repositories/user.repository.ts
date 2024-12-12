import { Service } from "typedi";
import { IUserRepository } from "./interface/Iuser.repository";
import { BaseRepository } from "./base.repository";
import User, { IUser } from "../models/user.model";
import { Types } from "mongoose";
import { selectData } from "../utils";

@Service()
export class UserRepository
  extends BaseRepository<IUser, Types.ObjectId>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findByEmail({
    email,
    field = [],
  }: {
    email: string;
    field?: string[];
  }): Promise<IUser | null> {
    return (await this.model
      .findOne({ email })
      .select(selectData(field))
      .lean()) as IUser | null;
  }
}
