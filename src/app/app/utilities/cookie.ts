export const hasCookie = (keyName: string = 'token'): boolean => {
  const value = `; ${document.cookie}`;
  return !!value.split(`; ${keyName}=`)[1];
}
