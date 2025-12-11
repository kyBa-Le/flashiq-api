import * as userRepo from "../repositories/user.repository";
export const getAllUsers = async () => {
  const data = await userRepo.getAllUsers();
  return data;
};

export const findOneEmail = async (email: string) => {
  const data = await userRepo.findOneEmail(email);
  return data;
};
export const createUser = async (user: any) => {
  const data = await userRepo.createUser(user);
  return data;
};
