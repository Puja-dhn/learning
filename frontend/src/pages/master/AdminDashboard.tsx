import React, { useEffect, useState } from "react";

import { shallowEqual } from "react-redux";

import { CheckIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
import { useInactiveUserList } from "@/features/common/hooks";
import { IUsers } from "@/features/common/types";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";

import { useAppSelector } from "@/store/hooks";
import { IconButton } from "@/features/ui/buttons";
import { activateUser } from "@/features/users/services/user.service";

function AdminDashboard() {
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const [inactiveUserList, setInactiveUserList] = useState<IUsers[]>([]);
  const queryClient = useQueryClient();
  const {
    data: userList,
    isLoading: isInactiveUserListLoading,
    isError: isInactiveUserListError,
  } = useInactiveUserList();

  useEffect(() => {
    if (isInactiveUserListLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isInactiveUserListLoading && isInactiveUserListError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isInactiveUserListLoading && !isInactiveUserListError && userList) {
      // on team change, calculate the team data and set tema data state

      setInactiveUserList([...userList.userList]);
    }
  }, [userList, isInactiveUserListLoading, isInactiveUserListError]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "inactiveUserList",
    });
  };
  const handleApproveUser = (employee_id: string) => {
    loader.show();
    activateUser(employee_id)
      .then(() => {
        alertToast.show("success", "User Activate Succesfully", true, 2000);
        handleRefresh();
      })
      .catch((err) => {
        if (err.response && err.response.status) {
          if (err.response.data && err.response.data.errorTransKey) {
            alertToast.show("warning", err.response.data.errorMessage, true);
          }
        }
      })
      .finally(() => {
        loader.hide();
      });
  };
  const appModePaddingClass =
    globalState.appMode === "FullScreen" ? "p-0 px-2.5 " : " p-2.5  pb-0 ";

  return (
    <div
      className={`relative w-full h-full grid grid-rows-[auto_1fr] ${appModePaddingClass} gap-2.5  overflow-auto `}
    >
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-start gap-2">
          <div>New Registered Users</div>
        </div>
      </div>

      <div className="h-full w-full overflow-auto border-[1px] dark:border-gray-700">
        <table className="text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="min-w-[100px] py-3 px-6 sticky left-0 top-0 z-[3] bg-gray-50 dark:bg-gray-700 ">
                Sl No
              </th>
              <th className="min-w-[250px] py-3 px-6 text-center bg-gray-50 dark:bg-gray-700 ">
                Employee ID
              </th>
              <th className="min-w-[250px] py-3 px-6 text-center bg-gray-50 dark:bg-gray-700 ">
                Name
              </th>
              <th className="min-w-[200px] py-3 px-6 text-center  bg-gray-50 dark:bg-gray-700 ">
                Email
              </th>
              <th className="min-w-[200px] py-3 px-6 text-center  bg-gray-50 dark:bg-gray-700 ">
                Mobile
              </th>
              <th className="min-w-[200px] py-3 px-6 text-center  bg-gray-50 dark:bg-gray-700 ">
                Date
              </th>
              <th className="w-[400px] py-3 px-6 text-center  bg-gray-50 dark:bg-gray-700 ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {inactiveUserList.map((row, index) => (
              <tr
                key={row.EMPLOYEE_ID}
                className="border-[1px] bg-white dark:bg-gray-800 dark:border-gray-700  "
              >
                <td className="sticky left-0 px-6 py-4 font-normal text-gray-900 bg-white z-[1] whitespace-nowrap dark:text-white dark:bg-gray-800 dark:border-gray-700">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-normal text-center text-gray-900 bg-white z-[1] whitespace-nowrap dark:text-white dark:bg-gray-800 dark:border-gray-700">
                  {row.EMPLOYEE_ID}
                </td>
                <td className="px-6 py-4 font-normal text-center text-gray-900 bg-white z-[1] whitespace-nowrap dark:text-white dark:bg-gray-800 dark:border-gray-700">
                  {row.NAME}
                </td>
                <td className="px-6 py-4 font-normal text-center text-gray-900 bg-white z-[1] whitespace-nowrap dark:text-white dark:bg-gray-800 dark:border-gray-700">
                  {row.EMAIL}
                </td>
                <td className="px-6 py-4 font-normal text-center text-gray-900 bg-white z-[1] whitespace-nowrap dark:text-white dark:bg-gray-800 dark:border-gray-700">
                  {row.MOBILE}
                </td>
                <td className="px-6 py-4 font-normal text-center text-gray-900 bg-white z-[1] whitespace-nowrap dark:text-white dark:bg-gray-800 dark:border-gray-700">
                  {row.DATE}
                </td>
                <td className="px-6 py-4 font-normal text-center text-gray-900 bg-white z-[1] whitespace-nowrap dark:text-white dark:bg-gray-800 dark:border-gray-700">
                  <IconButton
                    className="bg-green-400"
                    onClick={() => {
                      handleApproveUser(row.EMPLOYEE_ID);
                    }}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
