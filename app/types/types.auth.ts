export interface ISendOtp {
  email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: number;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}