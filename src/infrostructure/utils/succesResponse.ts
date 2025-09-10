export const successRes = (resData: any = {}, code: number = 200, message = "success") => {
  if(code == 201){
    message = "Creted"
  }
  return {
    statusCode: code,
    message,
    data: resData,
  };
};
