import { adapterResponseI, anulateProps, clientModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbClient {
  getClient: (ids?: string[]) => Promise<adapterResponseI<Array<clientModel>>>;
  createClient: (clients: clientModel[]) => Promise<adapterResponseI<Array<clientModel>>>;
  updateClient: (client: updateBaseI<clientModel>) => Promise<adapterResponseI<Array<clientModel>>>;
  deleteClient: (ids: string[]) => Promise<adapterResponseI<Array<clientModel>>>;
  anulateClient: (ids: anulateProps) => Promise<adapterResponseI<Array<clientModel>>>
}
