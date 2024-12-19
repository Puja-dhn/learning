import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import { IAuthenticatedUser, IRegisterUserForm } from "../types";
import { ILocationItem } from "@/features/common/types";
import { IUserData } from "@/features/users/types";
import { encryptData } from "@/features/common/utils/crypto";
import IPasswordForm from "../types/IPasswordForm";

interface IAuthLoginInput {
  emailId: string;
  password: string;
}

const authenticateDomainLogin = (emailId: string, password: string) => {
  const encEmailId = encryptData(emailId);
  const encPassword = encryptData(password);
  return http.post<IAuthLoginInput, AxiosResponse<IAuthenticatedUser>>(
    "/auth/login",
    {
      emailId: encEmailId,
      password: encPassword,
    },
  );
};

const refreshToken = (token: string) => {
  return http.post<IAuthLoginInput, AxiosResponse<IAuthenticatedUser>>(
    "/auth/refreshtoken",
    {
      token,
    },
  );
};

const getAllLocationData = () => {
  return http.get<any, AxiosResponse<ILocationItem[]>>("/auth/alllocations");
};

const getUserRfidValidate = (ticketNo: number) => {
  return http.post<string, AxiosResponse<IUserData[]>>(
    "/auth/getUserRfidValidate",
    {
      ticketNo,
    },
  );
};

const registerDomainUser = (registrationForm: IRegisterUserForm) => {
  const currRegistrationForm: IRegisterUserForm = { ...registrationForm };
  currRegistrationForm.PASSWORD = encryptData(currRegistrationForm.PASSWORD);
  return http.post<IRegisterUserForm, AxiosResponse<string>>(
    "/auth/register-user",
    currRegistrationForm,
  );
};

const getUserEmpIdValidate = (ticketNo: number) => {
  return http.post<string, AxiosResponse<IRegisterUserForm[]>>(
    "/auth/getuser",
    {
      ticketNo,
    },
  );
};
const requestOtp = (email: string, employeeid: number) => {
  return http.post<string, AxiosResponse<string>>("/auth/requestotp", {
    email,
    employeeid,
  });
};
const passwordUpdateUser = (values: IPasswordForm) => {
  return http.post<string, AxiosResponse<string>>("/auth/password-update", {
    values,
  });
};
const logout = (id: number) => {
  return http.post<string, AxiosResponse<any>>("/auth/logout", {
    id,
  });
};
const logoutConcurrentLogin = (id: number) => {
  return http.post<string, AxiosResponse<any>>("/auth/logoutConcurrentLogin", {
    id,
  });
};

export {
  authenticateDomainLogin,
  refreshToken,
  getAllLocationData,
  getUserRfidValidate,
  registerDomainUser,
  getUserEmpIdValidate,
  logout,
  logoutConcurrentLogin,
  requestOtp,
  passwordUpdateUser,
};
