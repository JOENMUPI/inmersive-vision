export const checkPhone = (val: string): boolean => {
  return /^\+([1-9]{1}[0-9]{0,2})\s?([0-9]{8,14})$/.test(val)
}

export const checkEmail = (val: string): boolean => {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(val);
}