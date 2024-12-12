import { BaseRepositoryInterface } from './Ibase.repository';
import {IUser} from '../../models/user.model';
import { Types } from 'mongoose';

export interface IUserRepository extends BaseRepositoryInterface<IUser, Types.ObjectId> {
    findByEmail({ email, field}: { email: string, field?: string[] }): Promise<IUser | null>;
}