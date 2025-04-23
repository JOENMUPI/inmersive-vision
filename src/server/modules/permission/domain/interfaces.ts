import { adapterResponseI, anulateProps, permissionModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbPermission {
  getPermission: (ids?: string[]) => Promise<adapterResponseI<Array<permissionModel>>>;
  createPermission: (permissions: permissionModel[]) => Promise<adapterResponseI<Array<permissionModel>>>;
  updatePermission: (permission: updateBaseI<permissionModel>) => Promise<adapterResponseI<Array<permissionModel>>>;
  deletePermission: (ids: string[]) => Promise<adapterResponseI<Array<permissionModel>>>;
  anulatePermission: (ids: anulateProps) => Promise<adapterResponseI<Array<permissionModel>>>
}
