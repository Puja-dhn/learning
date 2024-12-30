import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
import { utils, writeFile } from "xlsx";
import { useDebounce } from "use-debounce";
import { t } from "i18next";

import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import { Button, IconButton } from "@/features/ui/buttons";
import { useUserDBQuery } from "@/features/common/hooks";
import { IUserData, IUserDataEdit, IUserFilter } from "@/features/users/types";
import { InputText, Select } from "@/features/ui/elements";
import { IOptionList } from "@/features/ui/types";
import useUserDetailsQuery from "@/features/users/hooks/useUserDetailsQuery";
import ModalPopup from "@/features/ui/popup";
import { DropdownList, TextField } from "@/features/ui/form";
import { API_BASE_URL, ASSET_BASE_URL } from "@/features/common/constants";
import {
  rectifyUserImages,
  updateUserData,
} from "@/features/users/services/user.service";

interface ILogUserTeamData {
  userDataList: IUserData[];
}

const initialFilterValues: IUserFilter = {
  id: 0,
  name: "",
  email: "",
  mobile: "",
  show_roles: 0,
  in_role: 1,
  in_role_list: [],
  in_mapping: 1,
  in_mapping_list: [],
  is_filter_query: 0,
};

interface IExportCol {
  name: string;
  key: keyof IUserData;
}

const filterSchema = Yup.object().shape({
  id: Yup.string().max(50, "Maximum 50 characters can be entered"),
  name: Yup.string().max(200, "Maximum 200 characters can be entered"),
  email: Yup.string().max(200, "Maximum 200 characters can be entered"),
});

const tableColumns = [
  {
    label: "ID",
    minWidth: "min-w-[100px]",
    dbCol: "ID",
    colType: "Normal",
  },
  {
    label: "Employee ID",
    minWidth: "min-w-[240px]",
    dbCol: "emp_no",
    colType: "Normal",
  },
  {
    label: "Name",
    minWidth: "min-w-[240px]",
    dbCol: "name",
    colType: "Normal",
  },
  {
    label: "Email",
    minWidth: "min-w-[270px]",
    dbCol: "email",
    colType: "Normal",
  },
  {
    label: "Mobile",
    minWidth: "min-w-[240px]",
    dbCol: "mobile",
    colType: "Normal",
  },
  {
    label: "Department",
    minWidth: "min-w-[240px]",
    dbCol: "department",
    colType: "Normal",
  },
  {
    label: "Designation",
    minWidth: "min-w-[240px]",
    dbCol: "designation",
    colType: "Normal",
  },
  {
    label: "Employee Type",
    minWidth: "min-w-[240px]",
    dbCol: "emp_type",
    colType: "Normal",
  },
  {
    label: "Status",
    minWidth: "min-w-[200px]",
    dbCol: "status",
    colType: "Normal",
  },
];

const initialEditValues: IUserDataEdit = {
  id: 0,
  emp_no: "",
  name: "",
  email: "",
  mobile: "",
  department: "",
  designation: "",
  emp_type: "Permanent",
  status: "",
  profile_pic_url: "",
  roles: "",
  is_profile_edit: 0,
  is_password_reset: 0,
  new_password: "",
};
const editSchema = Yup.object().shape({
  name: Yup.string()
    .required("Emp Name is required")
    .max(255, "Maximum 255 characters can be entered"),
  email: Yup.string()
    .required("Email is Required")
    .max(255, "Maximum 255 characters can be entered"),
  mobile: Yup.string()
    .required("Mobile is Required")
    .max(255, "Maximum 255 characters can be entered"),
  designation: Yup.string()
    .required("Designation is Required")
    .max(255, "Maximum 255 characters can be entered"),
  status: Yup.string()
    .required("Status is Required")
    .max(255, "Maximum 255 characters can be entered"),
});

function Users() {
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
  const [filterTicketNo, setFilterTicketNo] = useState("");
  const [filterLocation, setFilterLocation] = useState(0);

  const [debouncedFilterTicketNo] = useDebounce(filterTicketNo, 500);
  const [teamData, setTeamData] = useState<ILogUserTeamData>({
    userDataList: [],
  });

  const [filterList, setFilterList] = useState<IUserFilter>({
    ...initialFilterValues,
  });

  const appModePaddingClass =
    globalState.appMode === "FullScreen" ? "p-0 px-2.5 " : " p-2.5  pb-0 ";

  const isSuperUser =
    authState.ROLES &&
    authState.ROLES.length > 0 &&
    authState.ROLES.includes(1);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const [showEditDialog, setShowEditDialog] = useState({
    status: false,
    formInitialValues: initialEditValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    formState: formStateFilter,
    getValues: getValuesFilter,
    setValue: setValueFilter,
  } = useForm<IUserFilter>({
    defaultValues: initialFilterValues,
    resolver: yupResolver(filterSchema),
  });

  const { submitCount: submitCountFilter, errors: errorsFilter } =
    formStateFilter;

  const {
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    control: controlEdit,
    formState: formStateEdit,
    getValues: getValuesEdit,
    setValue: setValueEdit,
  } = useForm<IUserDataEdit>({
    defaultValues: initialEditValues,
    resolver: yupResolver(editSchema),
  });

  useEffect(() => {
    setFilterList({
      ...initialFilterValues,
    });
  }, []);

  const handleFilterDialogOpen = () => {
    resetFilter({
      ...filterList,
    });
    setShowFilterDialog({
      status: true,
      formInitialValues: {
        ...filterList,
      },
    });
  };

  const handleFilterDialogClose = () => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
  };

  const handleFilterFormSubmit: SubmitHandler<IUserFilter> = (values) => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
    setFilterList({ ...values, is_filter_query: 1 });
  };

  const { submitCount: submitCountEdit, errors: errorsEdit } = formStateEdit;

  const handleEditDialogOpen = (row: IUserData) => {
    const currRow = {
      ...initialEditValues,
      ...row,
      is_password_reset: 0,
      new_password: "",
      is_profile_edit: 0,
    };
    resetEdit({
      ...currRow,
    });
    setShowEditDialog({
      status: true,
      formInitialValues: {
        ...currRow,
      },
    });
    if (imgRef && imgRef.current) {
      imgRef.current.value = "";
    }
  };

  const handleEditDialogClose = () => {
    setShowEditDialog((oldState) => ({ ...oldState, status: false }));
  };

  const handleAddDialogOpen = () => {
    const currRow = {
      ...initialEditValues,
    };
    resetEdit({
      ...currRow,
      status: "active",
    });
    setShowEditDialog({
      status: true,
      formInitialValues: {
        ...currRow,
      },
    });
    if (imgRef && imgRef.current) {
      imgRef.current.value = "";
    }
  };

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
  } = useUserDetailsQuery(+debouncedFilterTicketNo, filterLocation, filterList);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    if (isUserDetailsDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isUserDetailsDataLoading && isUserDetailsDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isUserDetailsDataLoading &&
      !isUserDetailsDataError &&
      userDetailsData
    ) {
      setTeamData({ userDataList: [...userDetailsData] });
      setCurrentPage(1);
    }
  }, [userDetailsData, isUserDetailsDataLoading, isUserDetailsDataError]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers =
    teamData && teamData.userDataList && teamData.userDataList.length > 0
      ? teamData.userDataList.slice(indexOfFirstUser, indexOfLastUser)
      : [];
  const pageNumbers: number[] = [];

  for (
    let i = 1;
    i <= Math.ceil(teamData.userDataList.length / usersPerPage);
    i += 1
  ) {
    pageNumbers.push(i);
  }

  const dbTableCols = tableColumns.filter((item) => {
    let retVal = true;
    if (item.dbCol === "None") {
      retVal = false;
    }
    return retVal;
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "userDBQuery" ||
        query.queryKey[0] === "userDetailsQuery",
    });
  };

  const handleEditFormSubmit: SubmitHandler<IUserDataEdit> = (values) => {
    loader.show();
    updateUserData(values)
      .then(() => {
        alertToast.show("success", "Data Updated Succesfully", true, 2000);
        handleEditDialogClose();
        handleRefresh();
        if (imgRef && imgRef.current) {
          imgRef.current.value = "";
        }
      })
      .catch((err) => {
        if (err.response && err.response.status) {
          if (err.response.data && err.response.data.errorMessage) {
            alertToast.show("warning", err.response.data.errorMessage, true);
          } else {
            alertToast.show("error", t("form.errors.defaultError"), true);
          }
        }
      })
      .finally(() => {
        loader.hide();
      });
  };

  const handelExcelExport = () => {
    if (teamData && teamData.userDataList.length > 0) {
      const dbCols: IExportCol[] = dbTableCols.map((col) => {
        return {
          name: col.label,
          key: col.dbCol as keyof IUserData,
        };
      });
      const data = [{ ...dbCols.map((col) => col.name) }];
      for (let iRows = 0; iRows < teamData.userDataList.length; iRows += 1) {
        const currRow: string[] = [];
        dbCols.forEach((col) => {
          currRow.push(teamData.userDataList[iRows][col.key] as string);
        });
        data.push({ ...currRow });
      }
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(data, { skipHeader: true });
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, "UsersDetails.xlsx");
    }
  };

  const handleFilterTicketNoChange = (value: any) => {
    setFilterTicketNo(value);
  };

  const renderPaginationButton = (page: number, type: string) => {
    if (type === "Start") {
      let disabledClass = "";
      if (currentPage === 1) {
        disabledClass = "cursor-not-allowed opacity-50";
      }
      return (
        <li key="Start">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((oldState) => oldState - 1);
            }}
            className={`block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${disabledClass}`}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      );
    }

    if (type === "End") {
      let disabledClass = "";
      if (currentPage === pageNumbers.length) {
        disabledClass = "cursor-not-allowed opacity-50";
      }
      return (
        <li key="End">
          <button
            type="button"
            disabled={currentPage === pageNumbers.length}
            onClick={() => {
              setCurrentPage((oldState) => oldState + 1);
            }}
            className={`block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${disabledClass}`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      );
    }

    if (type === "Dummy") {
      return (
        <li key="Dummy">
          <button
            type="button"
            disabled
            className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg opacity-50 cursor-not-allowed hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            ...
          </button>
        </li>
      );
    }

    let currClass =
      "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
    if (page === currentPage) {
      currClass =
        "z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
    }
    return (
      <li key={page}>
        <button
          type="button"
          onClick={() => {
            setCurrentPage(page);
          }}
          className={`px-3 py-2 leading-tight border ${currClass}`}
        >
          {page <= 9 ? `0${page}` : page}
        </button>
      </li>
    );
  };

  const renderFirstHalfPageNumbers = () => {
    const halfNumberPages = Math.floor(pageNumbers.length / 2);
    let startPage = 1;
    let endPage = 8;

    if (
      (currentPage > pageNumbers.length - 7 &&
        currentPage <= pageNumbers.length) ||
      (currentPage >= 1 && currentPage <= 7) ||
      (currentPage > halfNumberPages && halfNumberPages > 15)
    ) {
      startPage = 1;
      endPage = 8;
    } else {
      if (currentPage < pageNumbers.length - 7) {
        endPage = currentPage + 1;
      } else {
        endPage = currentPage;
      }
      startPage = endPage - 7;
      if (startPage <= 0) {
        startPage = 1;
      }
    }

    return pageNumbers
      .filter((item) => item >= startPage && item <= endPage)
      .map((page) => renderPaginationButton(page, "Normal"));
  };

  const renderSecondHalfPageNumbers = () => {
    const halfNumberPages = Math.floor(pageNumbers.length / 2);
    let startPage = pageNumbers.length - 6;
    let endPage = pageNumbers.length;
    if (
      (currentPage > pageNumbers.length - 7 &&
        currentPage <= pageNumbers.length) ||
      (currentPage >= 1 && currentPage <= 7) ||
      currentPage <= halfNumberPages ||
      (halfNumberPages < 15 && currentPage <= pageNumbers.length - 7)
    ) {
      startPage = pageNumbers.length - 6;
      endPage = pageNumbers.length;
    } else {
      startPage = currentPage - 1;

      if (startPage > pageNumbers.length) {
        startPage = pageNumbers.length;
      }
      endPage = startPage + 6;
    }
    return pageNumbers
      .filter((item) => item >= startPage && item <= endPage)
      .map((page) => renderPaginationButton(page, "Normal"));
  };

  const handleInRoleChecked = (
    event: ChangeEvent<HTMLInputElement>,
    roleId: number,
  ) => {
    const arrRoleList = getValuesFilter("in_role_list");
    if (event.target.checked) {
      arrRoleList.push(roleId);
    } else {
      const currIndex = arrRoleList.findIndex((role) => role === roleId);
      if (currIndex >= 0) {
        arrRoleList.splice(currIndex, 1);
      }
    }
    setValueFilter("in_role_list", arrRoleList, { shouldValidate: true });
  };

  const getRoleCheckStatus = (roleId: number) => {
    return getValuesFilter("in_role_list").includes(roleId);
  };

  const handleInMappingChecked = (
    event: ChangeEvent<HTMLInputElement>,
    mappingId: string,
  ) => {
    const arrMappingList = getValuesFilter("in_mapping_list");
    if (event.target.checked) {
      arrMappingList.push(mappingId);
    } else {
      const currIndex = arrMappingList.findIndex(
        (mapping) => mapping === mappingId,
      );
      if (currIndex >= 0) {
        arrMappingList.splice(currIndex, 1);
      }
    }
    setValueFilter("in_mapping_list", arrMappingList, { shouldValidate: true });
  };

  const getMappingCheckStatus = (mappingId: string) => {
    return getValuesFilter("in_mapping_list").includes(mappingId);
  };

  const renderEditControl = (row: IUserData) => {
    return (
      <IconButton
        onClick={() => {
          handleEditDialogOpen(row);
        }}
      >
        <PencilSquareIcon className="w-4 h-4" />
      </IconButton>
    );
  };

  const handleUserRoleChecked = (
    event: ChangeEvent<HTMLInputElement>,
    roleId: number,
  ) => {
    const strRoles = getValuesEdit("roles");
    let arrRoles: string[] = [];
    if (strRoles.length > 0) {
      arrRoles = strRoles.split(", ");
    }
    const arrCurrRole = dbList.roleList.filter((item) => item.id === roleId)[0];
    const strCurrRoleText = `${arrCurrRole.name} (${arrCurrRole.id})`;

    if (event.target.checked) {
      arrRoles.push(strCurrRoleText);
    } else {
      const currIndex = arrRoles.findIndex((role) => role === strCurrRoleText);
      if (currIndex >= 0) {
        arrRoles.splice(currIndex, 1);
      }
    }

    const strRolesText = arrRoles.join(", ");
    setValueEdit("roles", strRolesText, { shouldValidate: true });
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
      return `${ASSET_BASE_URL}images/profile/${getValuesEdit(
        "profile_pic_url",
      )}`;
    }
    return `${ASSET_BASE_URL}images/profile/profile_photo_default.png`;
  };

  const handleProfileFileChange = (e: any) => {
    const formData = new FormData();
    formData.append("filename", `${getValuesEdit("id")}_temp.JPG`);
    formData.append("file", e.target.files[0]);
    setValueEdit("profile_pic_url", "profile_photo_default.png", {
      shouldValidate: true,
    });
    fetch(`${API_BASE_URL}uploadprofile`, {
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
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-700">Add / Update Users</span>
          {/* <div>
            <InputText
              value={filterTicketNo}
              changeHandler={(data) => {
                setFilterList({ ...filterList, is_filter_query: 0 });
                handleFilterTicketNoChange(data);
              }}
              size="sm"
              className="w-[240px] bg-transparent"
              placeholder="Search by Ticket No/ Name"
            />
          </div> */}
        </div>
        <div className="flex items-center justify-end gap-4 ml-20">
          <IconButton onClick={handleAddDialogOpen}>
            <PlusIcon className="w-4 h-4" />
          </IconButton>
          <IconButton onClick={handelExcelExport}>
            <ArrowDownTrayIcon className="w-4 h-4" />
          </IconButton>
          <IconButton onClick={handleFilterDialogOpen}>
            <FunnelIcon className="w-4 h-4" />
          </IconButton>
          <IconButton onClick={handleRefresh}>
            <ArrowPathIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
      <div className="h-full overflow-auto border-[1px] dark:border-gray-700">
        <table className="text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                key="ID"
                className="w-[140px]  text-right py-3 px-6 sticky top-0 bg-gray-50 dark:bg-gray-700 "
              >
                ID
              </th>
              {dbTableCols
                .filter((item) => item.dbCol !== "ID")
                .map((col) => (
                  <th
                    key={col.dbCol}
                    className={`${col.minWidth} py-3 px-6 sticky top-0 bg-gray-50 dark:bg-gray-700 `}
                  >
                    {col.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((row) => (
              <tr
                key={`${row.id}`}
                className="border-[1px] bg-white dark:bg-gray-800 dark:border-gray-700  "
              >
                <td
                  key={`${row.id}_ID`}
                  className="px-6 py-1 font-normal text-right text-cyan-700 whitespace-nowrap dark:text-white "
                >
                  <div className="w-[140px] grid grid-cols-[auto_1fr_auto] gap-2 justify-between items-center">
                    <div>{renderEditControl(row)}</div>
                    <div>
                      <img
                        className="h-[40px] w-[40px] rounded-full"
                        src={`${ASSET_BASE_URL}images/profile/${
                          row.profile_pic_url
                            ? row.profile_pic_url
                            : "profile_photo_default.png"
                        }`}
                        alt="profile"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = `${ASSET_BASE_URL}images/profile/profile_photo_default.png`;
                        }}
                      />
                    </div>
                    {row.id}
                  </div>
                </td>
                {dbTableCols
                  .filter((item) => item.dbCol !== "ID")
                  .map((col) => (
                    <td
                      key={`${row.id}_${col.dbCol}`}
                      className="px-6 py-4 font-normal text-cyan-700 whitespace-nowrap dark:text-white "
                    >
                      {row[col.dbCol as keyof IUserData]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center">
        {pageNumbers.length <= 0 && (
          <span className="text-sm text-gray-500">No Data Found</span>
        )}
        {pageNumbers.length > 0 && pageNumbers.length <= 15 && (
          <ul className="inline-flex items-center -space-x-px">
            {pageNumbers.length > 5 && renderPaginationButton(0, "Start")}
            {pageNumbers.map((page) => renderPaginationButton(page, "Normal"))}
            {pageNumbers.length > 5 && renderPaginationButton(0, "End")}
          </ul>
        )}
        {pageNumbers.length > 15 && (
          <ul className="inline-flex items-center -space-x-px">
            {renderPaginationButton(0, "Start")}
            {renderFirstHalfPageNumbers()}
            {renderPaginationButton(0, "Dummy")}
            {renderSecondHalfPageNumbers()}
            {renderPaginationButton(0, "End")}
          </ul>
        )}
      </div>
      <ModalPopup
        heading="Search Users"
        onClose={handleFilterDialogClose}
        openStatus={showFilterDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitFilter(handleFilterFormSubmit)();
        }}
        size="large"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <form className="bg-[#ecf3f9] dark:bg-gray-600 grid gap-2.5 p-2.5">
          <div className="flex flex-wrap justify-evenly items-center p-2.5 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500">
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="number"
                name="id"
                label="Employee ID"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField name="name" label="Name" control={controlFilter} />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField name="email" label="Email" control={controlFilter} />
            </div>

            {isSuperUser && (
              <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
                <DropdownList
                  name="show_roles"
                  label="Show Roles"
                  control={controlFilter}
                  optionList={[
                    { id: 0, name: "No" },
                    { id: 1, name: "Yes" },
                  ]}
                />
              </div>
            )}

            {isSuperUser && (
              <div className="flex flex-wrap items-center p-2 basis-full justify-evenly ">
                <div className="p-2 basis-full lg:basis-1/4">
                  <DropdownList
                    name="in_role"
                    label="Role Selection"
                    control={controlFilter}
                    optionList={[
                      { id: 1, name: "In Role" },
                      { id: 0, name: "Not In Role" },
                    ]}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-3/4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]  gap-2  justify-evenly ">
                  {dbList.roleList.map((role) => (
                    <div
                      key={role.id}
                      className="border-[1px] border-gray-300 rounded-lg dark:border-gray-500"
                    >
                      <label
                        htmlFor={`role-check-${role.id}`}
                        className="flex items-center justify-start w-full gap-2 p-2 text-sm rounded text-cyan-700 dark:text-gray-300"
                      >
                        <input
                          id={`role-check-${role.id}`}
                          type="checkbox"
                          checked={getRoleCheckStatus(+role.id)}
                          onChange={(event) => {
                            handleInRoleChecked(event, +role.id);
                          }}
                          name={`role-check-${role.id}`}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        {role.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* {isSuperUser && (
              <div className="flex flex-wrap items-center p-2 basis-full justify-evenly bg-gray-50 dark:bg-gray-700">
                <div className="p-2 basis-full lg:basis-1/4">
                  <DropdownList
                    name="in_mapping"
                    label="Mapping Selection"
                    control={controlFilter}
                    optionList={[
                      { id: 1, name: "In Mapping" },
                      { id: 0, name: "Not In Mapping" },
                    ]}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-3/4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]  gap-2  justify-evenly ">
                  {dbList.mappingList.map((mapping) => (
                    <div
                      key={mapping.id}
                      className="border-[1px] border-gray-300 rounded-lg dark:border-gray-500"
                    >
                      <label
                        htmlFor={`mapping-check-${mapping.id}`}
                        className="flex items-center justify-start w-full gap-2 p-2 text-sm rounded text-cyan-700 dark:text-gray-300"
                      >
                        <input
                          id={`mapping-check-${mapping.id}`}
                          type="checkbox"
                          checked={getMappingCheckStatus(mapping.id.toString())}
                          onChange={(event) => {
                            handleInMappingChecked(
                              event,
                              mapping.id.toString(),
                            );
                          }}
                          name={`mapping-check-${mapping.id}`}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        {mapping.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </form>
      </ModalPopup>
      <ModalPopup
        heading="Add / Edit User"
        onClose={handleEditDialogClose}
        openStatus={showEditDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitEdit(handleEditFormSubmit)();
        }}
        size="fullscreen"
        showError
        hasError={
          !(Object.keys(errorsEdit).length === 0) && submitCountEdit > 0
        }
      >
        <form className="w-full h-full bg-[#ecf3f9] dark:bg-gray-600 p-4">
          <div className="w-full h-full grid grid-cols-[7fr_2fr] gap-4 ">
            <div className="h-full grid grid-rows-[auto_1fr] gap-4 overflow-auto">
              <div className="flex flex-wrap justify-evenly items-center p-4 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500">
                <div className="hidden p-2 basis-full lg:basis-1/4">
                  <TextField
                    disabled
                    name="id"
                    label="Id"
                    control={controlEdit}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-1/4">
                  <TextField
                    name="emp_no"
                    label="Emp No"
                    control={controlEdit}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-1/4">
                  <TextField name="name" label="Name" control={controlEdit} />
                </div>

                <div className="p-2 basis-full lg:basis-1/4">
                  <TextField name="email" label="Email" control={controlEdit} />
                </div>
                <div className="p-2 basis-full lg:basis-1/4">
                  <TextField
                    name="mobile"
                    label="Mobile"
                    control={controlEdit}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-1/4">
                  <TextField
                    name="department"
                    label="Department"
                    control={controlEdit}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-1/4">
                  <TextField
                    name="designation"
                    label="Designation"
                    control={controlEdit}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-1/4">
                  <DropdownList
                    name="emp_type"
                    label="Employee Type"
                    control={controlEdit}
                    optionList={[
                      { id: "Permanent", name: "Permanent" },
                      { id: "Contractor", name: "Contractor" },
                      { id: "Intern", name: "Intern" },
                      { id: "Trainee", name: "Trainee" },
                    ]}
                  />
                </div>
                <div className="p-2 basis-full lg:basis-1/4">
                  <DropdownList
                    name="status"
                    label="Status"
                    control={controlFilter}
                    optionList={[
                      { id: "active", name: "Active" },
                      { id: "inactive", name: "InActive" },
                    ]}
                  />
                </div>
              </div>
              <div className="h-full grid grid-cols-[1fr_3fr] gap-4 overflow-auto">
                <div className="flex flex-wrap justify-evenly items-center p-4 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500">
                  {getValuesEdit("id") > 0 && (
                    <div className="h-full w-full grid grid-rows-[auto_1fr]">
                      <div className="h-[35px] text-sm font-semibold text-cyan-700 dark:text-cyan-200 text-center">
                        Reset Password
                      </div>
                      <div className="grid items-start grid-cols-1 gap-2 p-4 bg-gray-50 dark:bg-gray-700">
                        <div>
                          <label
                            htmlFor="passwordreset-check"
                            className="flex items-center justify-start w-full gap-2 p-2 text-sm rounded text-cyan-700 dark:text-gray-300"
                          >
                            <input
                              id="passwordreset-check"
                              type="checkbox"
                              checked={getValuesEdit("is_password_reset") === 1}
                              onChange={() => {
                                if (getValuesEdit("is_password_reset") === 0) {
                                  setValueEdit("is_password_reset", 1, {
                                    shouldValidate: true,
                                  });
                                } else {
                                  setValueEdit("is_password_reset", 0, {
                                    shouldValidate: true,
                                  });
                                  setValueEdit("new_password", "", {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                              name="passwordreset-check"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            Update Password
                          </label>
                          <TextField
                            showLabel={false}
                            type="password"
                            name="new_password"
                            label="New Password"
                            control={controlEdit}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-full flex flex-wrap justify-evenly items-center p-4 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500 overflow-auto">
                  <div className="h-full w-full grid grid-rows-[auto_1fr] overflow-auto">
                    <div className="h-[35px] text-sm font-semibold text-cyan-700 dark:text-cyan-200 text-center">
                      User Roles
                    </div>
                    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-700">
                      <div className=" p-4 basis-full grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]  gap-4 items-start  justify-evenly overflow-auto">
                        {dbList.roleList.map((role) => (
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
                                type="checkbox"
                                checked={getUserRoleCheckStatus(+role.id)}
                                onChange={(event) => {
                                  handleUserRoleChecked(event, +role.id);
                                }}
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
                        currentTarget.src = `${ASSET_BASE_URL}images/profile/profile_photo_default.png`;
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
      </ModalPopup>
    </div>
  );
}

export default Users;
