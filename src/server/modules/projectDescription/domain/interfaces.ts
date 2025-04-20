import { adapterResponseI, anulateProps, projectDescriptionModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbProjectDescription {
  getProjectDescription: (ids?: string[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  createProjectDescription: (projectDescriptions: projectDescriptionModel[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  updateProjectDescription: (projectDescription: updateBaseI<projectDescriptionModel>) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  deleteProjectDescription: (ids: string[]) => Promise<adapterResponseI<Array<projectDescriptionModel>>>;
  anulateProjectDescription: (ids: anulateProps) => Promise<adapterResponseI<Array<projectDescriptionModel>>>
}
