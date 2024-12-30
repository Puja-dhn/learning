import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { t } from "i18next";
import { useQueryClient } from "react-query";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import { useUserDBQuery } from "@/features/common/hooks";
import { IUserFilter, IUserProfileEdit } from "@/features/users/types";
import { IOptionList } from "@/features/ui/types";
import useUserDetailsQuery from "@/features/users/hooks/useUserDetailsQuery";
import { DropdownList, TextField } from "@/features/ui/form";
import { API_BASE_URL, ASSET_BASE_URL } from "@/features/common/constants";
import { updateUserProfile } from "@/features/users/services/user.service";
import { Button } from "@/features/ui/buttons";

const initialFilterValues: IUserFilter = {
  id: 0,
  name: "",
  email: "",
  mobile: "",
  show_roles: 1,
  in_role: 1,
  in_role_list: [],
  in_mapping: 1,
  in_mapping_list: [],
  is_filter_query: 0,
};

const initialEditValues: IUserProfileEdit = {
  id: 0,
  name: "",
  email: "",
  mobile: "",
  designation: "",
  emp_type: "",
  status: "",
  profile_pic_url: "",
  roles: "",
  is_profile_edit: 0,
  new_password: "",
  emp_no: "",
};

function UserProfile() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const imgRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [dbList, setDBList] = useState<{
    roleList: IOptionList[];
    mappingList: IOptionList[];
  }>({
    roleList: [],
    mappingList: [],
  });
  const [filterList, setFilterList] = useState<IUserFilter>({
    ...initialFilterValues,
  });

  const appModePaddingClass =
    globalState.appMode === "FullScreen" ? "p-0 px-2.5 " : " p-2.5  pb-0 ";

  const {
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    control: controlEdit,
    formState: formStateEdit,
    getValues: getValuesEdit,
    setValue: setValueEdit,
  } = useForm<IUserProfileEdit>({
    defaultValues: initialEditValues,
  });

  const { submitCount: submitCountEdit, errors: errorsEdit } = formStateEdit;
  const {
    data: userDBListData,
    isLoading: isUserDBListDataLoading,
    isError: isUserDBListDataError,
  } = useUserDBQuery();

  useEffect(() => {
    if (isUserDBListDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isUserDBListDataLoading && isUserDBListDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isUserDBListDataLoading && !isUserDBListDataError && userDBListData) {
      setDBList({
        roleList: [...userDBListData.roleList],
        mappingList: [...userDBListData.mappingList],
      });
    }
  }, [userDBListData, isUserDBListDataLoading, isUserDBListDataError]);

  const {
    data: userDetailsData,
    isLoading: isUserDetailsDataLoading,
    isError: isUserDetailsDataError,
  } = useUserDetailsQuery(authState.ID, 0, filterList);

  useEffect(() => {
    if (isUserDetailsDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isUserDetailsDataLoading && isUserDetailsDataError) {
      alertToast.show("error", "Error Reading API", true);
    }
    if (userDetailsData && userDetailsData.length > 0) {
      resetEdit({ ...userDetailsData[0] });
    }
  }, [userDetailsData, isUserDetailsDataLoading, isUserDetailsDataError]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "userDBQuery" ||
        query.queryKey[0] === "userDetailsQuery",
    });
  };
  const handleEditFormSubmit: SubmitHandler<IUserProfileEdit> = (values) => {
    loader.show();
    updateUserProfile(values)
      .then(() => {
        alertToast.show("success", "Data Updated Succesfully", true, 2000);
        handleRefresh();
        if (imgRef && imgRef.current) {
          imgRef.current.value = "";
        }
      })
      .catch((err) => {
        if (err.response && err.response.status) {
          if (err.response.data && err.response.data.errorTransKey) {
            alertToast.show(
              "warning",
              t(`form.errors.${err.response.data.errorTransKey}`),
              true,
            );
          } else {
            alertToast.show("error", t("form.errors.defaultError"), true);
          }
        }
      })
      .finally(() => {
        loader.hide();
      });
  };

  const getUserRoleCheckStatus = (roleId: number) => {
    const strRoles = getValuesEdit("roles");
    let arrRoles: string[] = [];
    if (strRoles.length > 0) {
      arrRoles = strRoles.split(", ");
    }
    const arrCurrRole = dbList.roleList.filter((item) => item.id === roleId)[0];
    const strCurrRoleText = `${arrCurrRole.name} (${arrCurrRole.id})`;
    return arrRoles.includes(strCurrRoleText);
  };

  const getProfileUrl = () => {
    if (getValuesEdit("profile_pic_url")) {
      return `${ASSET_BASE_URL}/images/profile/${getValuesEdit(
        "profile_pic_url",
      )}`;
    }
    return `${ASSET_BASE_URL}/images/profile/profile_photo_default.png`;
  };

  const handleProfileFileChange = (e: any) => {
    const formData = new FormData();
    formData.append("filename", `${getValuesEdit("id")}_temp.JPG`);
    formData.append("file", e.target.files[0]);
    setValueEdit("profile_pic_url", "profile_photo_default.png", {
      shouldValidate: true,
    });
    fetch(`${API_BASE_URL}/uploadprofile`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          setValueEdit("profile_pic_url", `${getValuesEdit("id")}_temp.JPG`, {
            shouldValidate: true,
          });
          setValueEdit("is_profile_edit", 1, { shouldValidate: true });
        } else {
          alertToast.show("error", "Error Uploading Image", true);
        }
      })
      .catch(() => {
        alertToast.show("error", "Error Uploading Image", true);
      });
  };

  return (
    <div
      className={`relative w-full h-full grid grid-rows-[auto_1fr_auto] gap-2.5 overflow-auto ${appModePaddingClass} `}
    >
      <form className="w-full h-full bg-[#ecf3f9] dark:bg-gray-600 p-4">
        <div className="w-full h-full grid grid-cols-[7fr_2fr] gap-4 ">
          <div className="h-full grid grid-rows-[auto_1fr] gap-4 overflow-auto">
            <div className="flex flex-wrap justify-evenly items-center p-4 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500">
              <div className="p-2 basis-full lg:basis-1/3">
                <TextField
                  disabled
                  name="emp_no"
                  label="Employee ID"
                  control={controlEdit}
                />
              </div>
              <div className="p-2 basis-full lg:basis-1/3">
                <TextField
                  disabled
                  name="name"
                  label="Employee Name"
                  control={controlEdit}
                />
              </div>
              <div className="p-2 basis-full lg:basis-1/3">
                <TextField
                  disabled
                  name="email"
                  label="Email"
                  control={controlEdit}
                />
              </div>
              <div className="p-2 basis-full lg:basis-1/3">
                <TextField name="mobile" label="Mobile" control={controlEdit} />
              </div>
              <div className="p-2 basis-full lg:basis-1/3">
                <TextField
                  disabled
                  name="designation"
                  label="Designation"
                  control={controlEdit}
                />
              </div>
              <div className="p-2 basis-full lg:basis-1/3">
                <TextField
                  disabled
                  name="emp_type"
                  label="Employee Type"
                  control={controlEdit}
                />
              </div>
              <div className="p-2 basis-full lg:basis-1/3">
                <TextField
                  type="password"
                  name="new_password"
                  label="Password"
                  control={controlEdit}
                />
              </div>

              <div className="p-2 basis-full lg:basis-1/4" />
            </div>
            <div className="grid h-full gap-4 overflow-auto">
              <div className="h-full flex flex-wrap justify-evenly items-center p-4 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500 overflow-auto">
                <div className="h-full w-full grid grid-rows-[auto_1fr] overflow-auto">
                  <div className="h-[35px] text-sm font-semibold text-cyan-700 dark:text-cyan-200 text-center">
                    User Roles
                  </div>
                  <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-700">
                    <div className=" p-4 basis-full grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]  gap-4 items-start  justify-evenly overflow-auto">
                      {dbList.roleList
                        .filter((item) => getUserRoleCheckStatus(+item.id))
                        .map((role) => (
                          <div
                            key={role.id}
                            className="border-[1px] border-gray-300 rounded-lg dark:border-gray-500 shadow-md "
                          >
                            <label
                              htmlFor={`userrole-check-${role.id}`}
                              className="flex items-center justify-start w-full gap-2 p-4 text-sm rounded text-cyan-700 dark:text-gray-300"
                            >
                              <input
                                id={`userrole-check-${role.id}`}
                                disabled
                                type="checkbox"
                                checked
                                name={`userrole-check-${role.id}`}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {role.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full grid grid-rows-[auto_1fr] gap-4 overflow-auto">
            <div className="flex flex-wrap justify-evenly items-center p-4 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500">
              <div className="grid grid-rows-[1fr_auto] gap-2 items-center justify-center p-2 basis-full">
                <div className="flex items-center justify-center">
                  <img
                    className="w-[80%] "
                    src={getProfileUrl()}
                    alt="profile"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = `${ASSET_BASE_URL}/images/profile/profile_photo_default.png`;
                    }}
                  />
                </div>
                <div className="w-full overflow-hidden">
                  <input
                    className="block w-full text-xs text-gray-900 border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    name="file"
                    onChange={handleProfileFileChange}
                    accept="image/jpeg"
                    ref={imgRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="flex items-center border-[1px] border-gray-200 rounded-lg p-2.5   dark:border-gray-500 dark:bg-gray-800">
        <Button
          onClick={() => {
            handleSubmitEdit(handleEditFormSubmit)();
          }}
          btnType="primary"
        >
          Submit
        </Button>
        {!(Object.keys(errorsEdit).length === 0) && submitCountEdit > 0 && (
          <p className="ml-auto text-xs font-semibold text-red-500">
            One or More Errors, Check field for Details.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
