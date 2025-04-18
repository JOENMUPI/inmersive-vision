import { adapterResponseI, anulateProps, projectModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbProject {
  getProject: (ids?: string[]) => Promise<adapterResponseI<Array<projectModel>>>;
  createProject: (projects: projectModel[]) => Promise<adapterResponseI<Array<projectModel>>>;
  updateProject: (project: updateBaseI<projectModel>) => Promise<adapterResponseI<Array<projectModel>>>;
  deleteProject: (ids: string[]) => Promise<adapterResponseI<Array<projectModel>>>;
  anulateProject: (ids: anulateProps) => Promise<adapterResponseI<Array<projectModel>>>
  getLastProject: () => Promise<adapterResponseI<Array<projectModel>>>
}
