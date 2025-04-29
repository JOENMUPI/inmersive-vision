import { adapterResponseI, anulateProps, installmentModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbInstallment {
  getInstallment: (ids?: number[]) => Promise<adapterResponseI<Array<installmentModel>>>;
  createInstallment: (installments: installmentModel[]) => Promise<adapterResponseI<Array<installmentModel>>>;
  updateInstallment: (installment: updateBaseI<installmentModel>) => Promise<adapterResponseI<Array<installmentModel>>>;
  deleteInstallment: (ids: number[]) => Promise<adapterResponseI<Array<installmentModel>>>;
  anulateInstallment: (ids: anulateProps) => Promise<adapterResponseI<Array<installmentModel>>>
}
