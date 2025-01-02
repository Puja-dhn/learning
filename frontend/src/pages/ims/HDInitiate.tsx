import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
// import { utils, writeFile } from "xlsx";

import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
// import { IOptionList } from "@/features/ui/types";
import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import { DropdownList, TextArea, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";

import { IOptionList } from "@/features/ui/types";
import IAreasList from "@/features/sis/types/sis/IAreasList";
import useIMSMasterDataQuery from "@/features/ims/hooks/useIMSMasterDataQuery";
import ILogImsData from "@/features/ims/types/ILogImsData";
import {
  closeRecommendation,
  submitHDInitiate,
} from "@/features/ims/services/ims.services";
import ILogRecomFilterForm from "@/features/ims/types/ILogRecomFilterForm";
import useRecomCloseQuery from "@/features/ims/hooks/useRecomCloseQuery";
import ILogRecommendationData from "@/features/ims/types/ILogRecommendationData";
import IRecomCloseForm from "@/features/ims/types/IRecomCloseForm";
import useHDInitiateQuery from "@/features/ims/hooks/useHDInitiateQuery";
import useHDMasterDataQuery from "@/features/ims/hooks/useHDMasterDataQuery";
import IDepartmentList from "@/features/ptw/types/ptw/IDepartmentList";
import IDepartment from "@/features/common/types/IDepartment";

interface ILogImsTeamData {
  historyLogImsData: ILogRecommendationData[];
}
const initialCloseRecomValues: IRecomCloseForm = {
  id: 0,
  close_remarks: "",
};
const initialViewImsValues: ILogImsData = {
  disp_logno: 0,
  incident_no: 0,
  inc_date_time: "",
  department_id: "",
  department: "",
  area_id: "",
  area: 0,
  injury_type: "",
  factors: "",
  reported_by: 0,
  exact_location: "",
  potential_outcome: "",
  action_taken: "",
  incident_details: "",
  ims_photos: "",
  immediate_action: "",
  status: "",
  pending_on: "",
  created_at: "",
  created_by: "",
  updated_at: "",
  updated_by: "",
  log_by: "",
  close_remarks: "",
};
const initialFilterValues: ILogRecomFilterForm = {
  incident_no: null,
  date_from: "",
  date_to: "",
  status: "Submitted",
};

function HDInitiate() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [users, setUsers] = useState<IOptionList[]>([]);
  const [injuryType, setInjuryType] = useState<IOptionList[]>([]);
  const [factors, setFactors] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IAreasList[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<IOptionList[]>([]);
  const [suggTeamRow, setSuggTeamRow] = useState<any[]>([]);
  const [suggTeamNewRow, setSuggTeamNewRow] = useState({
    id: "",
    name: "",
  });
  const queryClient = useQueryClient();
  const {
    data: imsMasterData,
    isLoading: isIMSMasterDataLoading,
    isError: isIMSMasterDataError,
  } = useHDMasterDataQuery();

  useEffect(() => {
    if (isIMSMasterDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isIMSMasterDataLoading && isIMSMasterDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isIMSMasterDataLoading && !isIMSMasterDataError && imsMasterData) {
      const historyImsMasterData = [imsMasterData.historyIMSMasterData];
      const ownDepartment = historyImsMasterData[0].DEPARTMENT.filter(
        (item) => +item.head_user_id === authState.ID,
      );
      const filteredArea = historyImsMasterData[0].AREA.filter(
        (item) => +item.parent_id === ownDepartment[0].id,
      );
      setAreas(filteredArea);
    }
  }, [imsMasterData, isIMSMasterDataLoading, isIMSMasterDataError]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // Initialize the screen size check
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [teamData, setTeamData] = useState<ILogImsTeamData>({
    historyLogImsData: [],
  });

  const [logDetails, setLogDetails] = useState<ILogImsTeamData>({
    historyLogImsData: [],
  });

  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState({
    status: false,
  });

  const [showPDCAssignDialog, setShowPDCAssignDialog] = useState({
    status: false,
  });

  const isDepartmentHead =
    authState.ROLES &&
    authState.ROLES.length > 0 &&
    authState.ROLES.includes(4);

  const {
    handleSubmit: handleSubmitPDCDetails,
    reset: resetActionTaken,
    control: controlAction,
  } = useForm<IRecomCloseForm>({
    defaultValues: initialCloseRecomValues,
  });

  const handlePDCAssignDialogClose = () => {
    setShowPDCAssignDialog((oldState) => ({ ...oldState, status: false }));
  };
  const handleActionClick = (row: ILogRecommendationData) => {
    resetActionTaken({
      id: row.id,
    });

    setShowPDCAssignDialog({
      status: true,
    });
  };

  const handleAssignPDCSubmit: SubmitHandler<IRecomCloseForm> = (values) => {
    loader.show();
    closeRecommendation(values)
      .then(() => {
        alertToast.show(
          "success",
          "Recommendation closed successfully",
          true,
          2000,
        );
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "recomCloseQuery",
        });
        setShowPDCAssignDialog((oldState) => ({
          ...oldState,
          status: false,
        }));
      })

      .catch((err) => {
        if (err.response && err.response.status) {
          alertToast.show("warning", err.response.data.errorMessage, true);
        }
      })
      .finally(() => {
        loader.hide();
      });
  };
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        // Check if the row status is 'Submitted'
        if (isDepartmentHead) {
          return (
            <IconButton
              className="ml-2"
              onClick={() => handleActionClick(params.row)}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </IconButton>
          );
        }
        // If the status is not 'Submitted', return null (no button will show)
        return null;
      },
    },
    { field: "disp_logno", headerName: "Log No", width: 70 },
    { field: "inc_date_time", headerName: "Incident Date Time", width: 250 },
    { field: "department", headerName: "Department", width: 240 },
    { field: "area", headerName: "Area", width: 250 },
    { field: "recommendation", headerName: "Recommendation", width: 220 },
    { field: "responsibility", headerName: "Responsibility", width: 220 },
    { field: "factor", headerName: "Factor", width: 200 },
    { field: "control_type", headerName: "Control Type", width: 200 },
    { field: "target_date", headerName: "Target Date", width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const [filterList, setFilterList] = useState<ILogRecomFilterForm>({
    ...initialFilterValues,
  });

  const {
    data: imsLogHistoryData,
    isLoading: isImsLogHistoryDataLoading,
    isError: isImsLogHistoryDataError,
  } = useHDInitiateQuery(filterList);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    formState: formStateFilter,
  } = useForm<ILogRecomFilterForm>({
    defaultValues: initialFilterValues,
  });

  const { submitCount: submitCountFilter, errors: errorsFilter } =
    formStateFilter;

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

  const handleFilterFormSubmit: SubmitHandler<ILogRecomFilterForm> = (
    values,
  ) => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
    setFilterList({ ...values });
  };

  useEffect(() => {
    if (isImsLogHistoryDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isImsLogHistoryDataLoading && isImsLogHistoryDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isImsLogHistoryDataLoading &&
      !isImsLogHistoryDataError &&
      imsLogHistoryData
    ) {
      // const historyLogAectData = [...aectLogHistoryData.historyLogAectData];
      const historyLogImsData = [...imsLogHistoryData.historyLogImsData];
      if (isDepartmentHead) {
        setTeamData({
          historyLogImsData,
        });
      }
    }
  }, [imsLogHistoryData, isImsLogHistoryDataLoading, isImsLogHistoryDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "hdInitiateQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "hdInitiateQuery",
    });
  };

  const handleShowLogDetails = (logNo: number) => {
    const historyLogImsData = [
      ...teamData.historyLogImsData.filter(
        (item) => item.incident_no === logNo,
      ),
    ];
    setLogDetails({ historyLogImsData });

    setShowLogDetailsDialog({
      status: true,
    });
  };

  const formatDate = (date: any) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleExport = () => {
    const rows = teamData.historyLogImsData.map((item) => ({
      "Log No": item.disp_logno,
      Status: item.status,
      "Incident Date Time": item.inc_date_time,
      Department: item.department,
      Area: item.area,
      Recommendation: item.recommendation,
      Responsibility: item.responsibility,
      Factor: item.factor,
      "Control type": item.control_type,
      "Target Date": item.target_date,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.xlsx");
  };
  const getSelectedValues = (rowId: any) => {
    // Get the row by ID and fetch all select elements within that row
    const row = document.querySelector(`tr[data-row-id="${rowId}"]`);

    // If the row is not found, return an empty array
    if (!row) {
      console.warn(`Row with id ${rowId} not found.`);
      return [];
    }

    const selects = row.querySelectorAll("select");

    // Extract values from each select
    const selectedValues = Array.from(selects).map((select) => ({
      area: select.getAttribute("data-area-id"),
      value: select.value,
    }));

    return selectedValues;
  };
  const handleRowActionClick = (row: ILogRecommendationData) => {
    const selectedValues = getSelectedValues(row.id);
    loader.show();
    submitHDInitiate(row.id, row.incident_no, JSON.stringify(selectedValues))
      .then(() => {
        alertToast.show("success", "HD Initiate Succesfully", true, 2000);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "hdMasterdataQuery",
        });
        setShowPDCAssignDialog((oldState) => ({
          ...oldState,
          status: false,
        }));
      })

      .catch((err) => {
        if (err.response && err.response.status) {
          alertToast.show("warning", err.response.data.errorMessage, true);
        }
      })
      .finally(() => {
        loader.hide();
      });
  };

  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-hidden text-sm md:p-6">
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">
          HD Initiate
        </div>
        <div className="flex items-center justify-end gap-4 ml-20">
          <IconButton onClick={handleExport}>
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
      {isDesktop ? (
        <div className="h-full overflow-auto border-[1px] dark:border-gray-700 ">
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="sticky top-0 px-6 py-3 bg-gray-50 dark:bg-gray-700">
                  Action
                </th>
                <th className="sticky top-0 px-6 py-3 bg-gray-50 dark:bg-gray-700">
                  Log No
                </th>
                <th className="sticky top-0 px-6 py-3 bg-gray-50 dark:bg-gray-700">
                  Recommendation
                </th>
                {areas &&
                  areas.length > 0 &&
                  areas.map((item) => (
                    <th className="sticky top-0 px-6 py-3 bg-gray-50 dark:bg-gray-700">
                      {item.name}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {teamData.historyLogImsData.map((row) => (
                <tr
                  key={row.id}
                  data-row-id={row.id}
                  className="border-[1px] bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-normal text-cyan-700 whitespace-nowrap dark:text-white">
                    <IconButton
                      className="ml-2"
                      onClick={() => handleRowActionClick(row)}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </IconButton>
                  </td>
                  <td className="px-6 py-4 font-normal text-cyan-700 whitespace-nowrap dark:text-white">
                    {row.disp_logno}
                  </td>
                  <td className="px-6 py-4 font-normal text-cyan-700 whitespace-nowrap dark:text-white">
                    {row.recommendation}
                  </td>
                  {areas &&
                    areas.length > 0 &&
                    areas.map((item) => (
                      <td
                        key={item.id}
                        className="px-6 py-4 font-normal text-cyan-700 whitespace-nowrap dark:text-white"
                      >
                        <select
                          data-area-id={item.id}
                          className="border-[1px] bg-white dark:bg-gray-800 dark:border-gray-700"
                        >
                          <option value="Applicable">Applicable</option>
                          <option value="Not Applicable" selected>
                            Not Applicable
                          </option>
                        </select>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-2 overflow-auto ">
          {teamData.historyLogImsData.map((row) => (
            <button
              key={row.incident_no}
              type="button"
              onClick={() => handleShowLogDetails(row.incident_no)}
              className="w-full"
            >
              <div className="relative flex items-start bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:shadow-gray-700 dark:border-gray-600">
                {/* Full-Height Vertical Log No */}
                <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-full  text-center text-white bg-[#6388bd] dark:bg-blue-900">
                  <span className="origin-center transform -rotate-90">
                    {row.disp_logno}
                  </span>
                </div>

                {/* Content Section */}
                <div className="w-full p-2 ml-5 text-xs text-gray-700 dark:text-gray-300">
                  {/* First Row (Reported Date and Category) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[50%]">
                      <span className="font-semibold">Date:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatDate(row.inc_date_time)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-2">
                    <div className="flex items-center w-full space-x-4">
                      <span className="font-semibold">Area:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {" "}
                        {row.area}
                      </span>
                    </div>
                  </div>

                  {/* Second Row (Reported By and Severity) */}

                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 ">
                      <span className="font-semibold">Status:</span>
                      <span className="text-gray-600">{row.status}</span>
                    </div>
                  </div>

                  {/* Chevron Icon for Details */}
                  <div className="absolute top-0 right-0 flex items-center justify-center h-full px-2">
                    <ChevronRightIcon
                      onClick={() => handleShowLogDetails(row.incident_no)}
                      height={20}
                      className="text-[#014098] transition-colors duration-300 cursor-pointer hover:text-blue-700"
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <ModalPopup
        heading="Search Recommendation"
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
                name="incident_no"
                label="Incident No"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="date_from"
                label="Date From"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="date_to"
                label="Date To"
                control={controlFilter}
              />
            </div>
          </div>
        </form>
      </ModalPopup>

      <ModalPopup
        heading="HD Initiate"
        onClose={handlePDCAssignDialogClose}
        openStatus={showPDCAssignDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitPDCDetails(handleAssignPDCSubmit)();
        }}
        size="medium"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
            <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
              <div className="grid grid-cols-1 ">
                <div className="p-1">
                  <DropdownList
                    name="department"
                    label="Area"
                    control={controlFilter}
                    optionList={[{ id: "", name: "Select Area" }]}
                  />
                  <DropdownList
                    name="department"
                    label="Mark Status"
                    control={controlFilter}
                    optionList={[
                      { id: "", name: "Select" },
                      { id: "Applicable", name: "Applicable" },
                      { id: "Not Applicable", name: "Not Applicable" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
}

export default HDInitiate;
