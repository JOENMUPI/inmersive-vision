import { adapterResponseI, anulateProps, projectModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbProject {
  getProject: (ids?: number[]) => Promise<adapterResponseI<Array<projectModel>>>;
  createProject: (projects: projectModel[]) => Promise<adapterResponseI<Array<projectModel>>>;
  updateProject: (project: updateBaseI<projectModel>) => Promise<adapterResponseI<Array<projectModel>>>;
  deleteProject: (ids: number[]) => Promise<adapterResponseI<Array<projectModel>>>;
  anulateProject: (ids: anulateProps) => Promise<adapterResponseI<Array<projectModel>>>
  getLastProject: () => Promise<adapterResponseI<Array<projectModel>>>
}

export interface projectInternalManagerI {
  getProjectInternal: (ids?: number[]) => Promise<adapterResponseI<Array<projectModel>>>
  createProjectInternal: (projects: projectModel[]) => Promise<adapterResponseI<Array<projectModel>>>
  deleteProjectInternal: (ids: number[]) => Promise<adapterResponseI<Array<projectModel>>>
  updateProjectInternal: (project: updateBaseI<projectModel>) => Promise<adapterResponseI<Array<projectModel>>>
}