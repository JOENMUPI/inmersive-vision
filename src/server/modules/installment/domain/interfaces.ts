import { adapterResponseI, anulateProps, installmentModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbInstallment {
  getInstallment: (props: installmenteGetPropI) => Promise<adapterResponseI<Array<installmentModel>>>;
  createInstallment: (installments: installmentModel[]) => Promise<adapterResponseI<Array<installmentModel>>>;
  updateInstallment: (installment: updateBaseI<installmentModel>) => Promise<adapterResponseI<Array<installmentModel>>>;
  deleteInstallment: (ids: number[]) => Promise<adapterResponseI<Array<installmentModel>>>;
  anulateInstallment: (ids: anulateProps) => Promise<adapterResponseI<Array<installmentModel>>>
}

export interface installmentInternalManagerI {
  getInstallmentInternal: (props: installmenteGetPropI) => Promise<adapterResponseI<Array<installmentModel>>>;
  createInstallmentInternal: (installments: installmentModel[]) => Promise<adapterResponseI<Array<installmentModel>>>;
  updateInstallmentInternal: (installment: updateBaseI<installmentModel>) => Promise<adapterResponseI<Array<installmentModel>>>;
  deleteInstallmentInternal: (ids: number[]) => Promise<adapterResponseI<Array<installmentModel>>>;
}

export interface installmenteGetPropI {
  installmentIds?: number[]
  projectId?: number[]
  installmentNum?: number[]
}