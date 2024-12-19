import React, { useCallback, useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { shallowEqual } from "react-redux";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import {
  getUserEmpIdValidate,
  requestOtp,
  passwordUpdateUser,
} from "@/features/authentication/services/auth.service";
// import LoginBg from "@/assets/images/loginbg5.png";
import LogoText from "@/assets/images/logotext.png";
import LoginBgMobile from "@/assets/images/loginbgmobile3.png";
import { useAppSelector } from "@/store/hooks";
import TextFieldAuto from "@/features/ui/form/TextFieldAuto";
import IPasswordForm from "@/features/authentication/types/IPasswordForm";
import CustomCaptcha from "./CustomCaptcha";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const initialFormValues: IPasswordForm = {
  EMAIL_ID: "",
  EMPLOYEE_ID: "",
  OTP: "",
  PASSWORD: "",
};

function ForgotPassword() {
  const navigate = useNavigate();
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [empLoader, setEmpLoader] = useState(false);
  const [otpSection, setOtpSection] = useState(false);
  const [disabledEmail, setDisabledEmail] = useState(false);
  const [validateEmp, setValidateEmp] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const formSchema = Yup.object().shape({
    EMAIL_ID: Yup.string()
      .trim()
      .required("Email ID is Required")
      .max(100, "Email ID can be maximum 100 characters")
      .min(3, "Email ID can be minimum 3 characters")
      .matches(emailRegExp, "Email Id is not valid"),
    EMPLOYEE_ID: Yup.string().trim().required("Employee ID is Required"),
    OTP: Yup.string()
      .required("OTP is Required")
      .max(6, "OTP cannot be more than 6 digit"),

    PASSWORD: Yup.string()
      .trim()
      .required("Password is Required")
      .max(50, "Password can be maximum 50 characters")
      .min(6, "Password can be minimum 6 characters"),
  });

  useEffect(() => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("persist:root");
  }, []);

  const {
    handleSubmit,
    setValue,
    watch: watchValues,
    reset,
    control,
    formState,
  } = useForm<IPasswordForm>({
    defaultValues: initialFormValues,
    resolver: yupResolver(formSchema),
  });

  const { isSubmitting } = formState;
  const getUsers = (value: number) => {
    getUserEmpIdValidate(value).then((res) => {
      if (res.data.length > 0) {
        if (res.data[0].EMAIL_ID !== null) {
          setValue("EMAIL_ID", res.data[0].EMAIL_ID, {
            shouldValidate: true,
          });
          setDisabledEmail(true);
        } else {
          setDisabledEmail(false);
        }
        setValidateEmp(true);
        setEmpLoader(false);
      } else {
        alertToast.show(
          "warning",
          "You are not a valid users to change password",
          true,
        );
        setValidateEmp(false);
        setEmpLoader(false);
      }
    });
  };

  const debounceFn = useCallback(debounce(getUsers, 1000), [
    authState.ID,
  ]);
  const handleTicketNoChange = (value: any) => {
    if (value.length > 2) {
      setEmpLoader(true);
      debounceFn(value);
    } else {
      setDisabledEmail(false);
    }
  };

  const captchaRef = useRef<{ refresh: () => void } | null>(null);

  const refreshCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.refresh();
      setIsCaptchaValid(false);
    }
  };

  const handleFormSubmit: SubmitHandler<IPasswordForm> = (values) => {
    if (validateEmp) {
      loader.show();
      passwordUpdateUser(values)
        .then((response) => {
          if (+response.data === 0) {
            alertToast.show("success", "Password update successfull.", true);
            reset({ ...initialFormValues });
            navigate("/auth", { replace: true });
          } else if (+response.data === 1) {
            alertToast.show("warning", "You are using a invalid OTP", true);
          } else if (+response.data === 2) {
            alertToast.show("warning", "Employeeid is invalid .", true);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status) {
            if (err.response.data && err.response.data.errorMessage) {
              alertToast.show("warning", err.response.data.errorMessage, true);
            } else {
              alertToast.show("warning", "Error Fetching Data from API", true);
            }
          } else {
            alertToast.show(
              "error",
              "Unknown Error, Please contact Admin",
              true,
            );
          }
        })
        .finally(() => {
          loader.hide();
        });
    } else {
      alertToast.show("warning", "Not a valid user", true);
    }
  };

  const handleRequestOtp = () => {
    const email = watchValues("EMAIL_ID");
    const employeeid = watchValues("EMPLOYEE_ID");
    if (!isCaptchaValid) {
      alertToast.show("warning", "Captcha is not validate", true);
    } else if (email !== "" && employeeid !== "") {
      loader.show();
      requestOtp(email, +employeeid).then((res) => {
        if (+res.data === 0) {
          alertToast.show(
            "success",
            "OTP send to your email id. Kindly check",
            true,
          );
          setOtpSection(true);
          loader.hide();
        } else if (+res.data === 1) {
          alertToast.show("warning", "Email Id not matched in system", true);
          loader.hide();
        } else {
          alertToast.show(
            "warning",
            "You are not a valid users to change password",
            true,
          );
          loader.hide();
        }
      });
    } else {
      alertToast.show("warning", "Email or EmployeeId can not be empty", true);
    }
  };

  return (
    <>
      {/* Use for mobile device */}
      <div className=" justify-center w-full h-full overflow-auto grid grid-rows-[1fr_2.5fr_0.5fr]  bg-white md:hidden">
        <div className="relative h-full">
          <img
            src={LogoText}
            alt=""
            className="absolute top-[45%] left-[50%] -translate-y-[50%] -translate-x-[50%] h-[70px] "
          />
          <img
            src={LoginBgMobile}
            alt=""
            className="h-full text-center md:h-24  w-[100%]"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-2">
          <h2 className="text-lg font-bold text-sky-800 dark:text-cyan-600">
            Forgot Password
          </h2>
          <form
            className="max-w-md p-2 mx-auto bg-white rounded-lg "
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit(handleFormSubmit)();
            }}
          >
            <div className="relative z-0 w-full mb-4 group">
              <span className="text-sm font-bold text-[#000000b3]">
                Employee ID
              </span>
              <TextFieldAuto
                label=""
                name="EMPLOYEE_ID"
                control={control}
                changeHandler={(data) => {
                  handleTicketNoChange(data);
                }}
                className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
              />
              {empLoader && (
                <div role="status" className="absolute right-[5%] top-[50%]">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>

            <div className="relative z-0 w-full mb-4 group">
              <span className="text-sm font-bold text-[#000000b3]">Email</span>
              <TextFieldAuto
                label=""
                className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                name="EMAIL_ID"
                control={control}
                disabled={disabledEmail}
              />
            </div>

            {!otpSection && (
              <div>
                <div className="flex flex-col items-stretch justify-between space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <div className="flex-grow">
                    <CustomCaptcha
                      ref={captchaRef}
                      onValidate={(isValid) => setIsCaptchaValid(isValid)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="w-[40%] text-white bg-gradient-to-t from-[#0a499e] to-[#208ef0] 
          hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
          font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-4"
                  disabled={isSubmitting}
                >
                  Request OTP
                </button>
                <button
                  type="button"
                  className=" text-[#646262bf] bg-[#efefefbf] border-[1px] border-[#868080bf]
          hover:bg-gradient-to-bl  
          font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-4 ml-5"
                  onClick={() => {
                    navigate("/auth", { replace: true });
                  }}
                >
                  Back to Login
                </button>
              </div>
            )}

            {otpSection && (
              <>
                <div className="relative z-0 w-full mb-4 group">
                  <span className="text-sm font-bold text-[#000000b3]">
                    OTP
                  </span>
                  <TextFieldAuto
                    label=""
                    name="OTP"
                    type="number"
                    control={control}
                    className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                  />
                </div>
                <div className="relative z-0 w-full mb-4 group">
                  <span className="text-sm font-bold text-[#000000b3]">
                    New Password
                  </span>
                  <TextFieldAuto
                    label=""
                    name="PASSWORD"
                    type="password"
                    control={control}
                    className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                  />
                </div>
                <div className="mb-[10px]">
                  <button
                    type="submit"
                    className=" text-white bg-gradient-to-t from-[#0a499e] to-[#208ef0] 
            hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
            font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-4"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className=" text-[#646262bf] bg-[#efefefbf] border-[1px] border-[#868080bf]
            hover:bg-gradient-to-bl  
            font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-4 ml-5"
                    onClick={() => {
                      navigate("/auth", { replace: true });
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <div>&nbsp;</div>
      </div>
    </>
  );
}

export default ForgotPassword;
