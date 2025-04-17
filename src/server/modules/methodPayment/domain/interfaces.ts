import { adapterResponseI, anulateProps, methodPaymentModel, updateBaseI } from "@/server/utilities/interfaces";

export interface dbMethodPayment {
  getMethodPayment: (ids?: string[]) => Promise<adapterResponseI<Array<methodPaymentModel>>>;
  createMethodPayment: (methodPayments: methodPaymentModel[]) => Promise<adapterResponseI<Array<methodPaymentModel>>>;
  updateMethodPayment: (methodPayment: updateBaseI<methodPaymentModel>) => Promise<adapterResponseI<Array<methodPaymentModel>>>;
  deleteMethodPayment: (ids: string[]) => Promise<adapterResponseI<Array<methodPaymentModel>>>;
  anulateMethodPayment: (ids: anulateProps) => Promise<adapterResponseI<Array<methodPaymentModel>>>
}
