export const checkPhone = (val: string): boolean => {
  return /^\+([1-9]{1}[0-9]{0,2})\s?([0-9]{8,14})$/.test(val)
}

export const checkEmail = (val: string): boolean => {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(val);
}

export const checkTotalInstallment = (val: number): boolean => {
  return /^(?!0$)\d+$/i.test(val.toString());
}

export const checkPass = (val: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12}$/.test(val)
}