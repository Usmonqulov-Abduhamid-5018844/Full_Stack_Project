export const successRes = (resData: any, code: number = 200, message = "success") => {
  return {
    statusCode: code,
    message,
    data: resData,
  };
};
