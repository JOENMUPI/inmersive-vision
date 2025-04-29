import { adapterResponseI, anulateProps, userPermissionModel, updateBaseI, userPermissionId } from "@/server/utilities/interfaces";

export interface dbUserPermission {
  getUserPermission: (ids?: userPermissionId[]) => Promise<adapterResponseI<Array<userPermissionModel>>>;
  createUserPermission: (userPermissions: userPermissionModel[]) => Promise<adapterResponseI<Array<userPermissionModel>>>;
  updateUserPermission: (userPermission: updateBaseI<userPermissionModel, userPermissionId>) => Promise<adapterResponseI<Array<userPermissionModel>>>;
  deleteUserPermission: (ids: userPermissionId[]) => Promise<adapterResponseI<Array<userPermissionModel>>>;
  anulateUserPermission: (ids: anulateProps<userPermissionId>) => Promise<adapterResponseI<Array<userPermissionModel>>>
}
