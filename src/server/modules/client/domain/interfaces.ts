import { adapterResponseI, anulateProps, clientModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbClient {
  getClient: (ids?: number[]) => Promise<adapterResponseI<Array<clientModel>>>;
  createClient: (clients: clientModel[]) => Promise<adapterResponseI<Array<clientModel>>>;
  updateClient: (client: updateBaseI<clientModel>) => Promise<adapterResponseI<Array<clientModel>>>;
  deleteClient: (ids: number[]) => Promise<adapterResponseI<Array<clientModel>>>;
  anulateClient: (ids: anulateProps) => Promise<adapterResponseI<Array<clientModel>>>
}

export interface clientInternalManagerI {
  getClientInternal: (ids?: number[]) => Promise<adapterResponseI<Array<clientModel>>>
  createClientInternal: (clients: clientModel[]) => Promise<adapterResponseI<Array<clientModel>>>
  deleteClientInternal: (ids: number[]) => Promise<adapterResponseI<Array<clientModel>>>
  updateClientInternal: (client: updateBaseI<clientModel>) => Promise<adapterResponseI<Array<clientModel>>>
}
