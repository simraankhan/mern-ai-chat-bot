export interface CommonResponse {
  data?: any;
  message?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserSignUpRequest extends UserLoginRequest {
  name: string;
  confirmPassword: string;
}

export interface NewChatResource {
  message: string;
}
