import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { IAuthForm } from "@/features/authentication/types";
import { TextField } from "@/features/ui/form";
// import LoginBg from "@/assets/images/loginbg5.png";
import LogoText from "@/assets/images/logotext.png";
import LoginBgMobile from "@/assets/images/loginbgmobile3.png";
import {
  getLoggedIn,
  setLocalUser,
} from "@/features/common/utils/local-storage";
import {
  authenticateDomainLogin,
  logoutConcurrentLogin,
} from "@/features/authentication/services/auth.service";
import { useGlobalConfig } from "@/features/common/hooks";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAuthConfig } from "@/features/authentication/hooks";
import { ConfirmBox } from "@/features/ui/alerts";

const initialFormValues: IAuthForm = {
  emailId: "",
  password: "",
};

function DomainLogin() {
  const { t } = useTranslation(["authentication", "common"]);
  const { setLoginType } = useGlobalConfig();
  const { setLoggedUser } = useAuthConfig();
  const navigate = useNavigate();
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formSchema = Yup.object().shape({
    emailId: Yup.string().trim().required("Email ID Required"),
    password: Yup.string().trim().required("Password required"),
  });

  const { handleSubmit, control, formState, setValue } = useForm<IAuthForm>({
    defaultValues: initialFormValues,
   // resolver: yupResolver(formSchema),
  });

  const [confirmState, setConfirmState] = useState({
    status: false,
    value: "cancel",
    message: "",
    handleConfirmOk: () => {},
    handleConfirmCancel: () => {},
  });
  const handleConfirmCancel = () => {
    setConfirmState((oldState) => ({
      ...oldState,
      status: false,
      value: "cancel",
    }));
  };

  const { isSubmitting } = formState;
  const handleFormSubmit: SubmitHandler<IAuthForm> = (values) => {
    loader.show();
    authenticateDomainLogin(values.emailId, values.password)
      .then((res) => {
        const currLoggedIn = getLoggedIn();
        if (currLoggedIn === "Yes") {
          alertToast.show(
            "warning",
            "You are already logged in a different tab/windows, Logged out old login, Please try again",
            true,
            4000,
          );
          localStorage.removeItem("user-inshe");
          localStorage.removeItem("loggedin-inshe");
          localStorage.removeItem("reloadcounter-inshe");
          sessionStorage.removeItem("persist:root-inshe");
        } else if (res.data.LOGGED_IN === 1) {
          setConfirmState({
            status: true,
            value: "cancel",
            message:
              "You might be logged in from different device. Do you wish to log off from other device and login to this device?",
            handleConfirmCancel,
            handleConfirmOk: () => {
              logoutConcurrentLogin(res.data.ID);
              setLocalUser(res.data);
              alertToast.show(
                "success",
                t("form.success.login_successfull"),
                true,
                2000,
              );

              setLoggedUser(res.data);
              navigate("/master", { replace: true });
            },
          });
        } else {
          setLocalUser(res.data);
          alertToast.show(
            "success",
            t("form.success.login_successfull"),
            true,
            2000,
          );

          setLoggedUser(res.data);
          navigate("/master", { replace: true });
        }
      })
      .catch((err) => {
        if (err.response) {
          setValue("password", "");
          if (err.response.status === 400) {
            if (err.response.data && err.response.data.errorTransKey) {
              alertToast.show(
                "warning",
                "Invalid Credentials or Users not activate yet. Try again",
                true,
              );
            } else {
              alertToast.show(
                "warning",
                "Invalid Credentials or Users not activate yet. Try again",
                true,
              );
            }
          } else if (err.response.status === 0) {
            alertToast.show(
              "error",
              t("form.errors.api_req_network_error"),
              true,
            );
          } else {
            alertToast.show(
              "warning",
              t("form.errors.api_data_fetching"),
              true,
            );
          }
        } else {
          alertToast.show("error", t("form.errors.defaultError"), true);
        }
      })
      .finally(() => {
        loader.hide();
      });
  };

  useEffect(() => {
    localStorage.removeItem("user-inshe");
    localStorage.removeItem("loggedin-inshe");
    sessionStorage.removeItem("persist:root-inshe");
    setLoginType("Domain");
  }, []);

  return (
    <>
      <div className="relative items-center justify-center w-full h-full overflow-hidden border-gray-200 rounded-lg ">
        {isDesktop ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="grid grid-cols-2 w-[50vw] h-[50vh] border-gray-900 rounded-lg bg-white shadow-lg">
              <div className="grid items-center justify-center w-full h-full grid-col-1">
                <div className="flex flex-col items-center justify-center gap-4">
                  <h2 className="text-lg font-bold text-sky-800 dark:text-cyan-600">
                    Authentication Required
                  </h2>
                  <form
                    className="max-w-md mx-auto"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSubmit(handleFormSubmit)();
                    }}
                  >
                    <div className="relative z-0 w-full mb-5 group">
                      <span className="text-sm font-bold text-[#6b7280]">
                        Email ID
                      </span>
                      <TextField
                        className="block w-full py-2.5 px-3 mt-1 text-sm text-gray-900 bg-transparent border-2  focus:ring-0 appearance-none rounded-lg dark:text-white dark:border-gray-600 
               dark:focus:border-[#4b8cf1] transition duration-300 ease-in-out hover:border-[#4b8cf1]"
                        label=""
                        name="emailId"
                        control={control}
                      />
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                      <span className="text-sm font-bold text-[#000000b3]">
                        Password
                      </span>
                      <TextField
                        label=""
                        name="password"
                        control={control}
                        type="password"
                        className="block py-2.5 px-3 mt-1 text-sm text-gray-900 bg-transparent border-2  focus:ring-0 appearance-none rounded-lg dark:text-white dark:border-gray-600 
               dark:focus:border-[#4b8cf1] transition duration-300 ease-in-out w-[350px] hover:border-[#4b8cf1]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-[30%] text-white bg-gradient-to-t from-[#06235b] to-[#8b91ad] 
                        hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
                        font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
                      disabled={isSubmitting}
                    >
                      Sign In
                    </button>
                    {/* <button
                      type="button"
                      className="w-[30%] text-[#646262bf] bg-[#efefefbf] border-[1px] border-[#868080bf]
                        hover:bg-gradient-to-bl  
                        font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-2 ml-5"
                      onClick={() => {
                        navigate("/auth/register", { replace: true });
                      }}
                    >
                      Sign Up
                    </button> */}
                  </form>
                </div>
              </div>
              <div className="grid grid-col-1 bg-gradient-to-r from-[#d1e7fb] to-[#233585] rounded-lg items-center justify-center">
                <img src={LogoText} alt="logo" className="h-[110px]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full h-[100vh] overflow-auto bg-white ">
            <div className="">
              <div className="relative">
                <img
                  src={LogoText}
                  alt=""
                  className="absolute top-[45%] left-[50%] -translate-y-[50%] -translate-x-[50%] h-[70px] "
                />
                <img
                  src={LoginBgMobile}
                  alt=""
                  className="h-[200px] text-center md:h-24 lg:h-24 w-[100%]"
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-4 mt-[30px] ">
                <h2 className="text-lg font-bold text-sky-800 dark:text-cyan-600">
                  Authentication Requireds
                </h2>
                <form
                  className="max-w-md mx-auto w-[90%]"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit(handleFormSubmit)();
                  }}
                >
                  <div className="relative z-0 w-full mb-5 group">
                    <span className="text-sm font-bold text-[#6b7280]">
                      Email ID
                    </span>
                    <TextField
                      className="block w-full py-2.5 px-3 mt-1 text-sm text-gray-900 bg-transparent border-2  focus:ring-0 appearance-none rounded-lg dark:text-white dark:border-gray-600 
               dark:focus:border-[#4b8cf1] transition duration-300 ease-in-out hover:border-[#4b8cf1]"
                      label=""
                      name="emailId"
                      control={control}
                    />
                  </div>

                  <div className="relative z-0 w-full mb-5 group">
                    <span className="text-sm font-bold text-[#000000b3]">
                      Password
                    </span>
                    <TextField
                      label=""
                      name="domainPassword"
                      control={control}
                      type="password"
                      className="block py-2.5 px-3 mt-1 text-sm text-gray-900 bg-transparent border-2  focus:ring-0 appearance-none rounded-lg dark:text-white dark:border-gray-600 
               dark:focus:border-[#4b8cf1] transition duration-300 ease-in-out w-full hover:border-[#4b8cf1]"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      className="text-[#0a499e]"
                      onClick={() => {
                        navigate("/auth/forgot-password", { replace: true });
                      }}
                    >
                      Forgot Password
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-[30%] text-white bg-gradient-to-t from-[#06235b] to-[#8b91ad] 
                        hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
                        font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
                    disabled={isSubmitting}
                  >
                    Sign In
                  </button>
                  {/* <button
                    type="button"
                    className="w-[30%] text-[#646262bf] bg-[#efefefbf] border-[1px] border-[#868080bf]
                hover:bg-gradient-to-bl  
                font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-2 ml-5"
                    onClick={() => {
                      navigate("/auth/register", { replace: true });
                    }}
                  >
                    Sign Up
                  </button> */}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmBox
        openState={confirmState.status}
        message={confirmState.message}
        handleConfirmCancel={confirmState.handleConfirmCancel}
        handleConfirmOk={confirmState.handleConfirmOk}
        okText="Yes"
        cancelText="No"
        okClass="bg-[#0b7d0b] from-green-700 to-green-500"
        cancelClass="bg-[#de5b5b] "
        messageClass="text-[#d01313]"
      />
    </>
  );
}

export default DomainLogin;
