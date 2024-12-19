import React, { useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { shallowEqual } from "react-redux";
import { IRegisterUserForm } from "@/features/authentication/types";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import {
  registerDomainUser,
  getUserEmpIdValidate,
} from "@/features/authentication/services/auth.service";
import { getSapUser } from "@/features/users/services/user.service";
// import LoginBg from "@/assets/images/loginbg5.png";
import LogoText from "@/assets/images/logotext.png";
import LoginBgMobile from "@/assets/images/loginbgmobile3.png";
import { useAppSelector } from "@/store/hooks";
import { ISSUE_TRACKING_URL } from "@/features/common/constants";
import TextFieldAuto from "@/features/ui/form/TextFieldAuto";

const initialFormValues: IRegisterUserForm = {
  NAME: "",
  EMAIL_ID: "",
  EMPLOYEE_ID: "",
  MOBILE: "",
  PASSWORD: "",
};

function DomainRegister() {
  const navigate = useNavigate();
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [empLoader, setEmpLoader] = useState(false);
  const [disabledName, setDisabledName] = useState(false);
  const [disabledEmail, setDisabledEmail] = useState(false);
  const [validateEmp, setValidateEmp] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const formSchema = Yup.object().shape({
    NAME: Yup.string()
      .trim()
      .required("Name is Required")
      .max(100, "Name can be maximum 100 characters")
      .min(3, "Name can be minimum 3 characters"),
    EMAIL_ID: Yup.string()
      .trim()
      .required("Email ID is Required")
      .max(100, "Email ID can be maximum 100 characters")
      .min(3, "Email ID can be minimum 3 characters")
      .matches(emailRegExp, "Email Id is not valid"),
    EMPLOYEE_ID: Yup.string().trim().required("Employee ID is Required"),
    MOBILE: Yup.string()
      .required("Mobile is Required")
      .max(10, "Mobile can be maximum 10 characters")
      .matches(phoneRegExp, "Mobile number is not valid"),
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

  const { handleSubmit, setValue, reset, control, formState } =
    useForm<IRegisterUserForm>({
      defaultValues: initialFormValues,
      resolver: yupResolver(formSchema),
    });

  const { isSubmitting } = formState;
  const getUsers = (value: number) => {
    getUserEmpIdValidate(value).then((res) => {
      if (res.data.length > 0) {
        alertToast.show(
          "warning",
          "Employee id is already registered. Please login",
          true,
        );
        setValue("NAME", "", { shouldValidate: true });
        setValue("EMAIL_ID", "", {
          shouldValidate: true,
        });
        setValue("MOBILE", "", { shouldValidate: true });
        setDisabledName(false);
        setDisabledEmail(false);
        setEmpLoader(false);
      } else {
        // loader.show();
        setEmpLoader(true);
        getSapUser(value.toString())
          .then((sapresponse) => {
            if (sapresponse.data) {
              // loader.hide();

              if (
                sapresponse.data.NAME !== "" &&
                sapresponse.data.NAME != null
              ) {
                setValue("NAME", sapresponse.data.NAME, {
                  shouldValidate: true,
                });
                setDisabledName(true);
              } else {
                setValue("NAME", "", { shouldValidate: true });
                setDisabledName(false);
              }

              if (
                sapresponse.data.EMAIL !== "" &&
                sapresponse.data.EMAIL != null
              ) {
                setValue("EMAIL_ID", sapresponse.data.EMAIL, {
                  shouldValidate: true,
                });
                setDisabledEmail(true);
              } else {
                setValue("EMAIL_ID", "", {
                  shouldValidate: true,
                });
                setDisabledEmail(false);
              }
              if (
                sapresponse.data.MOBILE !== "" &&
                sapresponse.data.MOBILE != null
              ) {
                setValue("MOBILE", sapresponse.data.MOBILE, {
                  shouldValidate: true,
                });
              } else {
                setValue("MOBILE", "", {
                  shouldValidate: true,
                });
              }
              setEmpLoader(false);
              setValidateEmp(true);
            } else {
              setValidateEmp(false);
              setEmpLoader(false);
              alertToast.show("warning", "Not a valid user", true);
              setValue("NAME", "", { shouldValidate: true });
              setDisabledName(false);
              setValue("EMAIL_ID", "", {
                shouldValidate: true,
              });
              setDisabledEmail(false);
              setValue("MOBILE", "", { shouldValidate: true });
            }
          })
          .catch((err) => {
            setEmpLoader(false);
            if (err.response && err.response.status) {
              if (err.response.data && err.response.data.errorMessage) {
                alertToast.show(
                  "warning",
                  err.response.data.errorMessage,
                  true,
                );
                setDisabledName(false);
                setDisabledEmail(false);
              } else {
                alertToast.show(
                  "warning",
                  "Error Fetching Data from API",
                  true,
                );
                setDisabledName(false);
                setDisabledEmail(false);
              }
            } else {
              alertToast.show(
                "error",
                "Unknown Error, Please contact Admin",
                true,
              );
              setDisabledName(false);
              setDisabledEmail(false);
            }
          });
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
      setDisabledName(false);
      setDisabledEmail(false);
    }
  };

  const handleFormSubmit: SubmitHandler<IRegisterUserForm> = (values) => {
    if (validateEmp) {
      loader.show();
      registerDomainUser(values)
        .then((regResponse) => {
          if (+regResponse.data > 0) {
            const dataArr = {
              NAME: values.NAME,
              MOBILE: values.MOBILE,
              EMAIL_ID: values.EMAIL_ID,
              EMPLOYEE_ID: values.EMPLOYEE_ID,
              LOCN_ID: regResponse.data,
            };
            fetch(ISSUE_TRACKING_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataArr),
            });

            reset({ ...initialFormValues });
            navigate("/auth/success", { replace: true });
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

  const handleBacktoLogin = () => {
    navigate("/auth/domain-login", { replace: true });
  };

  return (
    <>
      <div className="relative items-center justify-center hidden w-full h-[95vh] overflow-hidden border-gray-200 rounded-lg md:grid">
        <div className="grid grid-cols-2 w-[70vw] h-[70vh] border-gray-900 rounded-lg bg-white shadow-lg">
          <div className="grid grid-col-1 bg-gradient-to-r from-[#2090f4] to-[#0b499c] rounded-lg items-center justify-center">
            <img src={LogoText} alt="logo" className="h-[110px] " />
          </div>
          <div className="grid items-center justify-center w-full h-full grid-col-1">
            <div className="flex flex-col items-center justify-center gap-4 ">
              <h2 className="text-lg font-bold text-sky-800 dark:text-cyan-600">
                Create Your Account
              </h2>
              <form
                className="h-full max-w-md mx-auto overflow-auto"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit(handleFormSubmit)();
                }}
              >
                <div className="relative z-0 w-full mb-2 group">
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
                    className="rounded-none block border-[#09e6e4] py-0 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                  />
                  {empLoader && (
                    <div
                      role="status"
                      className="absolute right-[5%] top-[50%]"
                    >
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

                <div className="relative z-0 w-full mb-2 group">
                  <span className="text-sm font-bold text-[#000000b3]">
                    Name
                  </span>
                  <TextFieldAuto
                    label=""
                    name="NAME"
                    className="rounded-none block border-[#09e6e4] py-0 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                    control={control}
                    disabled={disabledName}
                  />
                </div>

                <div className="relative z-0 w-full mb-2 group">
                  <span className="text-sm font-bold text-[#000000b3]">
                    Email
                  </span>
                  <TextFieldAuto
                    label=""
                    className="rounded-none block border-[#09e6e4] py-0 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                    name="EMAIL_ID"
                    control={control}
                    disabled={disabledEmail}
                  />
                </div>
                <div className="relative z-0 w-full mb-2 group">
                  <span className="text-sm font-bold text-[#000000b3]">
                    Mobile
                  </span>
                  <TextFieldAuto
                    label=""
                    className="rounded-none block border-[#09e6e4] py-0 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                    name="MOBILE"
                    control={control}
                  />
                </div>

                <div className="relative z-0 w-full mb-2 group">
                  <span className="text-sm font-bold text-[#000000b3]">
                    Password
                  </span>
                  <TextFieldAuto
                    label=""
                    name="PASSWORD"
                    type="password"
                    control={control}
                    className="rounded-none block border-[#09e6e4] py-0 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-[30%] text-white bg-gradient-to-t from-[#0a499e] to-[#208ef0] 
              hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
              font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-2"
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className="w-[40%] text-[#646262bf] bg-[#efefefbf] border-[1px] border-[#868080bf]
              hover:bg-gradient-to-bl  
              font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-2 ml-5"
                  onClick={handleBacktoLogin}
                >
                  Back to Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Use for mobile device */}
      <div className="flex justify-center w-full h-full overflow-auto bg-white md:hidden">
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
          <div className="flex flex-col items-center justify-center gap-4 ">
            <h2 className="text-lg font-bold text-sky-800 dark:text-cyan-600">
              Create Your Account
            </h2>
            <form
              className="max-w-md mx-auto"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(handleFormSubmit)();
              }}
            >
              <div className="relative z-0 w-full mb-2 group">
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
                  className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
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

              <div className="relative z-0 w-full mb-2 group">
                <span className="text-sm font-bold text-[#000000b3]">Name</span>
                <TextFieldAuto
                  label=""
                  name="NAME"
                  className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                  control={control}
                  disabled={disabledName}
                />
              </div>
              <div className="relative z-0 w-full mb-2 group">
                <span className="text-sm font-bold text-[#000000b3]">
                  Email
                </span>
                <TextFieldAuto
                  label=""
                  className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                  name="EMAIL_ID"
                  control={control}
                  disabled={disabledEmail}
                />
              </div>
              <div className="relative z-0 w-full mb-2 group">
                <span className="text-sm font-bold text-[#000000b3]">
                  Mobile
                </span>
                <TextFieldAuto
                  label=""
                  className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                  name="MOBILE"
                  control={control}
                />
              </div>
              <div className="relative z-0 w-full mb-2 group">
                <span className="text-sm font-bold text-[#000000b3]">
                  Password
                </span>
                <TextFieldAuto
                  label=""
                  name="PASSWORD"
                  type="password"
                  control={control}
                  className="rounded-none block border-[#09e6e4] py-2.5 px-0 w-[350px] text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#09e6e4] focus:outline-none focus:ring-0 focus:border-[#09e6e4] peer"
                />
              </div>
              <div className="mb-[10px]">
                <button
                  type="submit"
                  className="w-[30%] text-white bg-gradient-to-t from-[#0a499e] to-[#208ef0] 
              hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
              font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-2"
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className="w-[40%] text-[#646262bf] bg-[#efefefbf] border-[1px] border-[#868080bf]
              hover:bg-gradient-to-bl  
              font-medium rounded-[30px] text-sm px-5 py-2.5 text-center mt-2 ml-5"
                  onClick={() => {
                    navigate("/auth", { replace: true });
                  }}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default DomainRegister;
