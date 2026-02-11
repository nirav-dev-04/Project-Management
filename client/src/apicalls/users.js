const { apiRequest } = require(".");

export const RegisterUser = async (payload) =>
  apiRequest("post", "/api/users/register", payload);
export const LoginUser = async (payload) =>
  apiRequest("post", "/api/users/login", payload);
export const GetLoggedInUser = async () =>
  apiRequest("get", "/api/users/get-logged-in-user");
export const ForgotPasswordUser = async (payload) =>
  apiRequest("post", "/api/users/forgot-password", payload);
export const ResetPasswordUser = async (payload) =>
  apiRequest("post", "/api/users/reset-password", payload);
