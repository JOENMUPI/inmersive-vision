export enum tableNames {
  CLIENT = 'client',
  PROJECT = 'project',
  USERS = 'users',
  USER_PERMISSION = 'user_permission',
  PERMISSION = 'permission',
  METHOD_PAYMENT = 'method_payment',
  INSTALLMENT = 'installment',
  INVOICE = 'invoice',
  PROJECT_DESCIPTION = 'project_description',
}

export enum methodHTTP {
  PATCH = 'PATCH',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum typePublicId {
  PROJECT = 'PJ',
  INVOICE = 'IN',
}

export enum clientTableKeys {
  NAME = 'name',
  EMAIL = 'email',
  ADDRESS = 'address',
  PHONE = 'phone',
  ID = 'id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum projectDescriptionTableKeys {
  PROJECT_ID = 'project_id',
  DESCRIPTION = 'description',
  UNITARY_PRICE = 'unitary_price',
  ELEMENT_NUM = 'element_num',
  INVOICE_PRUBLIC_ID = 'invoice_public_id',
  ID = 'id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum invoiceTableKeys {
  PROJECT_ID = 'project_id',
  METHOD_PAYMENT_ID = 'method_payment_id',
  CLIENT_ID = 'client_id',
  INSTALLMENT_ID = 'installment_id',
  EXPIRATION_DATE = 'expiration_date',
  CREATION_DATE = 'creation_date',
  REF_NUM_PAID = 'ref_num_paid',
  PUBLIC_ID = 'public_id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum installmentTableKeys {
  PROJECT_ID = 'project_id',
  MOUNT_PAY = 'mount_pay',
  INSTALLMENT_NUM = 'installment_num',
  ID = 'id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum methodPaymentTableKeys {
  COMPANY_NAME = 'company_name',
  BANK_NAME = 'bank_name',
  ROUTING_NUM = 'routing_num',
  ACCOUNT_NUM = 'account_num',
  ZELLE = 'zelle',
  URL_QR = 'url_qr',
  ID = 'id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum projectTableKeys {
  PUBLIC_ID = 'public_id',
  TOTAL_INSTALLMENT = 'total_installment',
  ID = 'id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum userTableKeys {
  SALT_PASS = 'salt_pass',
  PASS = 'pass',
  EMAIL = 'email',
  ID = 'id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum permissionTableKeys {
  DESCRIPTION = 'description',
  ID = 'id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum userPermissionTableKeys {
  USER_ID = 'user_id',
  IS_ALLOWED = 'is_allowed',
  PERMISSION_ID = 'permission_id',
  SOFT_DELETED = 'soft_deleted',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum permissionIds {
  CREATE_USER = 1,
  EDIT_USER = 2,
  DELETE_USER = 3,
  ANULATE_USER = 4,
  GET_USER = 5,

  CREATE_PERMISSION = 6,
  EDIT_PERMISSION = 7,
  DELETE_PERMISSION = 8,
  ANULATE_PERMISSION = 9,
  GET_PERMISSION = 10,

  CREATE_USER_PERMISSION = 11,
  EDIT_USER_PERMISSION = 12,
  DELETE_USER_PERMISSION = 13,
  ANULATE_USER_PERMISSION = 14,
  GET_USER_PERMISSION = 15,

  CREATE_CLIENT = 16,
  EDIT_CLIENT = 17,
  DELETE_CLIENT = 18,
  ANULATE_CLIENT = 19,
  GET_CLIENT = 20,

  CREATE_INSTALLMENT = 21,
  EDIT_INSTALLMENT = 22,
  DELETE_INSTALLMENT = 23,
  ANULATE_INSTALLMENT = 24,
  GET_INSTALLMENT = 25,

  CREATE_INVOICE = 26,
  EDIT_INVOICE = 27,
  DELETE_INVOICE = 28,
  ANULATE_INVOICE = 29,
  GET_INVOICE = 30,

  CREATE_PROJECT = 31,
  EDIT_PROJECT = 32,
  DELETE_PROJECT = 33,
  ANULATE_PROJECT = 34,
  GET_PROJECT = 35,

  CREATE_PROJECT_DESCRIPTION = 36,
  EDIT_PROJECT_DESCRIPTION = 37,
  DELETE_PROJECT_DESCRIPTION = 38,
  ANULATE_PROJECT_DESCRIPTION = 39,
  GET_PROJECT_DESCRIPTION = 40,

  CREATE_METHOD_PAYMENT = 41,
  EDIT_METHOD_PAYMENT = 42,
  DELETE_METHOD_PAYMENT = 43,
  ANULATE_METHOD_PAYMENT = 44,
  GET_METHOD_PAYMENT = 45,

  CREATE_INVOICE_COMPLETE = 46,
  EDIT_INVOICE_COMPLETE = 47,
  DELETE_INVOICE_COMPLETE = 48,
  ANULATE_INVOICE_COMPLETE = 49,
  GET_INVOICE_COMPLETE = 50,
}