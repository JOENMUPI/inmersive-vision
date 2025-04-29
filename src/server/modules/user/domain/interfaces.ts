import { adapterResponseI, anulateProps, userModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbUser {
  getUser: (ids?: number[]) => Promise<adapterResponseI<Array<userModel>>>;
  createUser: (users: userModel[]) => Promise<adapterResponseI<Array<userModel>>>;
  updateUser: (user: updateBaseI<userModel>) => Promise<adapterResponseI<Array<userModel>>>;
  deleteUser: (ids: number[]) => Promise<adapterResponseI<Array<userModel>>>;
  anulateUser: (ids: anulateProps) => Promise<adapterResponseI<Array<userModel>>>
}
