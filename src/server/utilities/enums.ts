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
