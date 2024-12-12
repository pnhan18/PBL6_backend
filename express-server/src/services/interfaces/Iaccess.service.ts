export interface IAccessService {
  signUp({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }): Promise<Record<string, any>>;
  logIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Record<string, any>>;
  logOut({user_id} : {user_id: string}): Promise<void>;
  getAccessToken({userId, refreshToken} : {userId: string, refreshToken: string}): Promise<Record<string, any>>;
  forgotPassword({ email }: { email: string }): Promise<void>;
  resetPassword({
    token,
    newPassword,
    repeatPassword,
  }: {
    token: string;
    newPassword: string;
    repeatPassword: string;
  }): Promise<Record<string, any>>;
  changePassword({
    userId,
    oldPassword,
    newPassword,
    repeatPassword,
  }: {
    userId: string;
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  }): Promise<Record<string, any>>;
}
