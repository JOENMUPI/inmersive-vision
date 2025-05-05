import { adapterResponseI, anulateProps, projectDescriptionModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbProjectDescription {
  getProjectDescription: (ids?: number[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  createProjectDescription: (projectDescriptions: projectDescriptionModel[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  updateProjectDescription: (projectDescription: updateBaseI<projectDescriptionModel>) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  deleteProjectDescription: (ids: number[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  anulateProjectDescription: (ids: anulateProps) => Promise<adapterResponseI<Array<projectDescriptionModel>>>
}

export interface projectDescriptionInternalManagerI {
  getProjectDescriptionInternal: (ids?: number[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>
  createProjectDescriptionInternal: (projectDescriptions: projectDescriptionModel[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>
  deleteProjectDescriptionInternal: (ids: number[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>
  updateProjectDescriptionInternal: (projectDescription: updateBaseI<projectDescriptionModel>) => Promise<adapterResponseI<Array<projectDescriptionModel>>>
}