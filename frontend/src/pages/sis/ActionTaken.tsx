import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
// import { utils, writeFile } from "xlsx";

import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_BASE_URL, ASSET_BASE_URL } from "@/features/common/constants";
// import { IOptionList } from "@/features/ui/types";
import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import { DropdownList, TextArea, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import ModalPopupMobile from "@/features/ui/popup/ModalPopupMobile";
import ILogSioData from "@/features/sis/types/sis/ILogSioData";
import { ILogSIOData, ILogSioFilterForm } from "@/features/sis/types";
import ISIOPDCAssignData from "@/features/sis/types/sis/ISIOPDCAssignData";
import { IOptionList } from "@/features/ui/types";
import useSIOMasterDataQuery from "@/features/sis/hooks/useSIOMasterDataQuery";
import { submitActionTaken } from "@/features/sis/services/sis.services";
import useSisAssignedLogQuery from "@/features/sis/hooks/useSisAssignedLogQuery";
import IAreasList from "@/features/sis/types/sis/IAreasList";

interface ILogSioTeamData {
  historyLogSioData: ILogSioData[];
}

const initialFilterValues: ILogSioFilterForm = {
  id: null,
  department: "All",
  category: "All",
  area: "All",
  severity: "All",
  obs_date_from: "",
  obs_date_to: "",
  status: "All",
};

const initialActionTakenValues: ISIOPDCAssignData = {
  id: 0,
  obs_datetime: "",
  department: "",
  area: 0,
  category: "",
  severity: 0,
  obs_desc: "",
  obs_sugg: "",
  obs_photos: "",
  closure_desc: "",
  closure_photos: "",
  pending_on: "",
  responsibilities: "",
  status: "",
  target_date: "",
  action_plan: "",
};

const actionFormSchema = Yup.object().shape({
  closure_desc: Yup.string().required("Closure description is required"),
});

function ActionTaken() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [isDesktop, setIsDesktop] = useState(false);
  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [categories, setCategories] = useState<IOptionList[]>([]);
  const [severity, setSeverity] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IAreasList[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<IOptionList[]>([]);

  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const closureFileInputRef = useRef<HTMLInputElement | null>(null);
  const [closureImagePreviews, setClosureImagePreviews] = useState<any>([]);
  const [modalImage, setModalImage] = useState<string>("");
  const queryClient = useQueryClient();
  const {
    data: sioMasterData,
    isLoading: isSIOMasterDataLoading,
    isError: isSIOMasterDataError,
  } = useSIOMasterDataQuery();

  useEffect(() => {
    if (isSIOMasterDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isSIOMasterDataLoading && isSIOMasterDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isSIOMasterDataLoading && !isSIOMasterDataError && sioMasterData) {
      const historySIOMasterData = [sioMasterData.historySIOMasterData];

      setDepartments(historySIOMasterData[0].DEPARTMENT);
      setCategories(historySIOMasterData[0].CATEGORY);
      setSeverity(historySIOMasterData[0].SEVERITY);
      setAreas(historySIOMasterData[0].AREA);
    }
  }, [sioMasterData, isSIOMasterDataLoading, isSIOMasterDataError]);
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
  const [teamData, setTeamData] = useState<ILogSioTeamData>({
    historyLogSioData: [],
  });

  const [logDetails, setLogDetails] = useState<ILogSioTeamData>({
    historyLogSioData: [],
  });

  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState({
    status: false,
  });
  const [showPDCAssignDialog, setShowPDCAssignDialog] = useState({
    status: false,
  });
  const [showImageDialog, setShowImageDialog] = useState({
    status: false,
  });

  const {
    handleSubmit: handleSubmitActionDetails,
    reset: resetActionTaken,
    control: controlAction,
  } = useForm<ISIOPDCAssignData>({
    defaultValues: initialActionTakenValues,
    resolver: yupResolver(actionFormSchema),
  });

  const handlePDCAssignDialogClose = () => {
    setShowPDCAssignDialog((oldState) => ({ ...oldState, status: false }));
  };
  const handleActionClick = (row: ILogSIOData) => {
    resetActionTaken({
      id: row.id,
      obs_datetime: row.obs_datetime,
      department: row.department_id,
      area: +row.area_id,
      category: row.category_id,
      severity: row.severity,
      obs_desc: row.obs_desc,
      obs_sugg: row.obs_sugg,
      obs_photos: row.obs_photos,
      closure_desc: row.closure_desc,
      closure_photos: row.closure_photos,
      status: row.status,
      pending_on: row.pending_on,
      responsibilities: row.responsibilities,
      target_date: row.target_date,
      action_plan: row.action_plan,
    });
    setImagePreviews(JSON.parse(row.obs_photos));
    setShowPDCAssignDialog({
      status: true,
    });
  };
  const handleActionTakenSubmit: SubmitHandler<ISIOPDCAssignData> = (
    values,
  ) => {
    if (closureImagePreviews.length === 0) {
      alertToast.show("warning", "Closure photors is required", true, 2000);
    } else {
      values.closure_photos = JSON.stringify(closureImagePreviews);
      loader.show();
      submitActionTaken(values)
        .then(() => {
          alertToast.show("success", "SIO Closed Succesfully", true, 2000);
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "sioAssignedDataQuery",
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
    }
  };
  const handleActionTakenMobile: SubmitHandler<ISIOPDCAssignData> = (
    values,
  ) => {
    if (closureImagePreviews.length === 0) {
      alertToast.show("warning", "Closure photors is required", true, 2000);
    } else {
      values.closure_photos = JSON.stringify(closureImagePreviews);
      loader.show();
      submitActionTaken(values)
        .then(() => {
          alertToast.show("success", "SIO Closed Succesfully", true, 2000);
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "sioAssignedDataQuery",
          });
          setShowLogDetailsDialog((oldState) => ({
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
    }
  };
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <IconButton
          className="ml-2"
          onClick={() => handleActionClick(params.row)}
        >
          <PencilSquareIcon className="w-4 h-4" />
        </IconButton>
      ),
    },
    { field: "disp_logno", headerName: "Log No", width: 70 },
    { field: "obs_datetime", headerName: "Observation Date", width: 250 },
    { field: "department", headerName: "Department", width: 240 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "area", headerName: "Area", width: 250 },
    { field: "category", headerName: "Category", width: 220 },
    { field: "severity", headerName: "Severity", width: 220 },
    { field: "pending_on", headerName: "Pending On", width: 200 },
    { field: "log_by", headerName: "Log By", width: 200 },
    { field: "target_date", headerName: "PDC Date", width: 200 },
    { field: "closure_date", headerName: "Closure Date", width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  // const [reportedByList, setReportedByList] = useState<IOptionList[]>([
  //   { id: 0, name: "All Reported By" },
  // ]);

  const [filterList, setFilterList] = useState<ILogSioFilterForm>({
    ...initialFilterValues,
  });

  const CURR_OBS_STATUS_LIST = [
    { id: "Open", name: "Open" },
    { id: "PDC Assigned", name: "PDC Assigned" },
    { id: "Closed", name: "Closed" },
  ];

  const {
    data: sioLogHistoryData,
    isLoading: isSioLogHistoryDataLoading,
    isError: isSioLogHistoryDataError,
  } = useSisAssignedLogQuery(filterList);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    formState: formStateFilter,
    watch: watchValues,
  } = useForm<ILogSioFilterForm>({
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

  const handleFilterFormSubmit: SubmitHandler<ILogSioFilterForm> = (values) => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
    setFilterList({ ...values });
  };

  useEffect(() => {
    if (isSioLogHistoryDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isSioLogHistoryDataLoading && isSioLogHistoryDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isSioLogHistoryDataLoading &&
      !isSioLogHistoryDataError &&
      sioLogHistoryData
    ) {
      // const historyLogAectData = [...aectLogHistoryData.historyLogAectData];
      const historyLogSioData = [...sioLogHistoryData.historyLogSioData];

      setTeamData({
        historyLogSioData,
      });
    }
  }, [sioLogHistoryData, isSioLogHistoryDataLoading, isSioLogHistoryDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "sioAssignedDataQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "sioAssignedDataQuery",
    });
  };

  const {
    control: controlActionTaken,
    handleSubmit,
    reset: resetActionTakenMobile,
  } = useForm<ISIOPDCAssignData>({
    defaultValues: initialActionTakenValues,
    resolver: yupResolver(actionFormSchema),
  });

  const handleShowLogDetails = (logNo: number) => {
    const historyLogSioData = [
      ...teamData.historyLogSioData.filter((item) => item.id === logNo),
    ];
    resetActionTakenMobile({
      id: logNo,
    });
    setLogDetails({ historyLogSioData });
    setImagePreviews(JSON.parse(historyLogSioData[0].obs_photos));
    if (historyLogSioData[0].closure_photos !== "") {
      setClosureImagePreviews(JSON.parse(historyLogSioData[0].closure_photos));
    }
    setShowLogDetailsDialog({
      status: true,
    });
  };
  const handleLogDetailsDialogClose = () => {
    setShowLogDetailsDialog((oldState) => ({
      ...oldState,
      status: false,
    }));
  };

  useEffect(() => {
    if (+watchValues("department") > 0) {
      const fArea = areas.filter(
        (item) => +item.parent_id === +watchValues("department"),
      );
      setFilteredAreas(fArea);
    }
  }, [watchValues("department")]);

  const handleClosureFileButtonClick = () => {
    if (closureFileInputRef.current) {
      closureFileInputRef.current.click();
    }
  };
  const handleClosureFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    const filenames = files.map((file: any, index: number) => {
      const now = new Date();
      const date = now.toISOString().slice(0, 10).replace(/-/g, "");
      const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
      return `${date}_${time}_${index + 1}_${file.name}`;
    });

    const formData = new FormData();
    formData.append("filenames", JSON.stringify(filenames));
    formData.append(
      "orginalnames",
      JSON.stringify(files.map((file: any) => file.name)),
    );
    files.forEach((file: any) => {
      formData.append("files[]", file);
    });

    fetch(`${API_BASE_URL}uploadObsClosureImage`, {
      method: "POST",
      body: formData,
    })
      .then(async () => {
        setClosureImagePreviews(() => [...filenames]);
      })
      .catch(() => {
        alertToast.show("error", "Error Uploading Image", true);
      });
  };

  const handleDeleteClosureImage = (image: string) => {
    setClosureImagePreviews((prevPreviews: any) =>
      prevPreviews.filter((item: any) => item !== image),
    );

    fetch(`${API_BASE_URL}deleteObsClosureImage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageName: image, // The image name that needs to be deleted
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alertToast.show("success", "Image deleted successfully", true);
        } else {
          alertToast.show("error", "Error deleting image", true);
        }
      })
      .catch(() => {
        alertToast.show("error", "Error deleting image", true);
      });
  };
  const formatDate = (date: any) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleImageDialogClose = () => {
    setShowImageDialog((oldState) => ({ ...oldState, status: false }));
    setModalImage("");
  };
  const openImageModal = (image: any) => {
    setModalImage(image);
    setShowImageDialog({ status: true });
  };
  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-hidden text-sm md:p-6">
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">
          Action Taken
        </div>
        <div className="flex items-center justify-end gap-4 ml-20">
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
          <Paper sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={teamData.historyLogSioData}
              columns={columns}
              getRowId={(row) =>
                row.TEAM_ID || row.ID || Math.random().toString(36).substring(2)
              }
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              sx={{
                border: 0,
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#f5f5f5", // Background color for the header
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold", // Make the text bold
                },
              }}
            />
          </Paper>
          {/* <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {tableColumns.map((col) => (
                  <th
                    key={col.dbCol}
                    className={`py-3 px-6 sticky top-0 bg-gray-50 dark:bg-gray-700 ${col.minWidth}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamData.historyLogAectData.map((row) => (
                <tr
                  key={row.ID}
                  className="border-[1px] bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  {tableColumns.map((col) => (
                    <td
                      key={`${row.ID}_${col.dbCol}`}
                      className="px-6 py-4 font-normal text-cyan-700 whitespace-nowrap dark:text-white"
                    >
                      {row[col.dbCol as keyof ILogAectData]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>
      ) : (
        <div className="flex flex-col h-full gap-2 overflow-auto ">
          {teamData.historyLogSioData.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => handleShowLogDetails(row.id)}
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
                        {formatDate(row.obs_datetime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Severity:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.severity}
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
                      <span className="font-semibold">Reported By:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.pending_on}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 ">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={`${
                          row.status === "Open"
                            ? "text-red-500" // red color for "Open"
                            : row.status === "Closed"
                            ? "text-green-500" // green color for "Closed"
                            : row.status === "PDC Assigned"
                            ? "text-orange-500" // orange color for "PDC Assigned"
                            : "text-gray-600" // default gray if no match
                        } dark:text-gray-400`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>

                  {/* Chevron Icon for Details */}
                  <div className="absolute top-0 right-0 flex items-center justify-center h-full px-2">
                    <ChevronRightIcon
                      onClick={() => handleShowLogDetails(row.id)}
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
      {/* Table for larger screens (hidden on mobile) */}

      {/* Mobile Layout - Button view for log details (only visible on mobile) */}

      <ModalPopup
        heading="Search Observation Data"
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
                label="Obs No"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="department"
                label="Department"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Departments" },
                  ...departments,
                ]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="area"
                label="Area"
                control={controlFilter}
                optionList={[{ id: "All", name: "All Area" }, ...filteredAreas]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="category"
                label="Category"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Category" },
                  ...categories,
                ]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="SEVERITY"
                label="Severity"
                control={controlFilter}
                optionList={[{ id: "All", name: "All Severity" }, ...severity]}
              />
            </div>

            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="obs_date_from"
                label="Obs Date From"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="obs_date_to"
                label="Obs Date To"
                control={controlFilter}
              />
            </div>

            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="status"
                label="Status"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Status" },
                  ...CURR_OBS_STATUS_LIST,
                ]}
              />
            </div>
          </div>
        </form>
      </ModalPopup>

      <ModalPopup
        heading="Action Taken"
        onClose={handlePDCAssignDialogClose}
        openStatus={showPDCAssignDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitActionDetails(handleActionTakenSubmit)();
        }}
        size="fullscreen"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
            <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
              <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Observation Details
                </h2>
              </div>

              <form className="w-[100%]   gap-4  justify-evenly">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <TextField
                      type="text"
                      name="obs_datetime"
                      label="Observation Date Time"
                      control={controlAction}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <DropdownList
                      name="department"
                      label="Department"
                      control={controlAction}
                      optionList={[
                        { id: "", name: "Select Department" },
                        ...departments,
                      ]}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <DropdownList
                      name="area"
                      label="Area"
                      control={controlAction}
                      optionList={[{ id: "", name: "Select Area" }, ...areas]}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <DropdownList
                      name="category"
                      label="Category"
                      control={controlAction}
                      optionList={[
                        { id: "", name: "Select Category" },
                        ...categories,
                      ]}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <DropdownList
                      name="severity"
                      label="Severity"
                      control={controlAction}
                      optionList={[...severity]}
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-1">
                    <TextArea
                      name="obs_desc"
                      label="Observation Description"
                      control={controlAction}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextArea
                      name="obs_sugg"
                      label="Observation Suggestion"
                      control={controlAction}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex mt-4 space-x-4 overflow-x-auto">
                  {imagePreviews.map((preview: any, index: any) => (
                    <div key={index} className="relative">
                      <img
                        src={`${ASSET_BASE_URL}sioimages/${preview || ""}`}
                        alt={`preview-${index}`}
                        className="object-cover w-24 h-24 rounded-lg cursor-pointer"
                        onClick={() => openImageModal(preview)}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
                  <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Assigning Responsibilities
                    </h2>
                  </div>

                  <div className="w-[100%]   gap-4  justify-evenly">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-1">
                        <TextField
                          name="pending_on"
                          label="Responsible Person"
                          control={controlAction}
                          disabled
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          type="date"
                          name="target_date"
                          label="Target Date"
                          control={controlAction}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1">
                      <div className="p-1">
                        <TextArea
                          name="action_plan"
                          label="Action Plan"
                          control={controlAction}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
                  <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Closure Details
                    </h2>
                  </div>

                  <div className="w-[100%]   gap-4  justify-evenly">
                    <div className="grid grid-cols-1 md:grid-cols-1">
                      <div className="p-1">
                        <TextArea
                          name="closure_desc"
                          label="Closure Description"
                          control={controlAction}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 ">
                      <div className="p-1">
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 text-white bg-[#9fa5b1] rounded-lg focus:outline-none hover:bg-[#9fa5b1]"
                          onClick={handleClosureFileButtonClick}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Upload Photos
                        </button>
                        <input
                          type="file"
                          multiple
                          onChange={handleClosureFileChange}
                          style={{ display: "none" }}
                          ref={closureFileInputRef}
                          accept=".jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                    <div className="flex mt-4 space-x-4 overflow-x-auto">
                      {closureImagePreviews.map((preview: any, index: any) => (
                        <div key={index} className="relative">
                          <img
                            src={`${ASSET_BASE_URL}sioimages/${preview || ""}`}
                            alt={`preview-${index}`}
                            className="object-cover w-24 h-24 rounded-lg cursor-pointer"
                            onClick={() => openImageModal(preview)}
                          />
                          <button
                            onClick={() => handleDeleteClosureImage(preview)}
                            className="absolute top-0 right-0 p-1 text-xs text-white bg-red-500 rounded-full hover:bg-red-700"
                            type="button"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ModalPopup>
      <ModalPopupMobile
        heading="Action Taken"
        onClose={handleLogDetailsDialogClose}
        openStatus={showLogDetailsDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmit(handleActionTakenMobile)();
        }}
        hasReset={false}
        size="fullscreen"
        showError
      >
        <div className="p-2 text-sm dark:bg-gray-700 h-[100%]">
          {logDetails && logDetails.historyLogSioData.length > 0 && (
            <div className="p-2 bg-white dark:bg-gray-800 h-[100%]">
              <div className="space-y-4 text-[12px]">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800">
                  <div className="p-2 bg-[#dee9ff] rounded-t-lg dark:bg-gray-600">
                    <h2 className="font-semibold text-gray-800 text-md dark:text-gray-200">
                      Observation Details
                    </h2>
                  </div>
                  <div className="p-3 ">
                    <div className="flex border-b-[#00000036] border-b-[1px]">
                      <div className="flex-1">
                        <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                          Obs No:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {logDetails.historyLogSioData[0].disp_logno}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                          Date:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatDate(
                            logDetails.historyLogSioData[0].obs_datetime,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Log By:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            {logDetails.historyLogSioData[0].pending_on}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Observation Description:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            {logDetails.historyLogSioData[0].obs_desc}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Observation Suggestion:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            {logDetails.historyLogSioData[0].obs_sugg}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Severity:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            {logDetails.historyLogSioData[0].severity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Category:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            {logDetails.historyLogSioData[0].category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Department:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            {logDetails.historyLogSioData[0].department}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Area:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            {logDetails.historyLogSioData[0].area}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Status:
                          </span>
                          <span className="font-bold text-gray-600 dark:text-gray-400 ">
                            {logDetails.historyLogSioData[0].status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="border-b-[#00000036] border-b-[1px] pb-2">
                        <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                          Obs. Photos:
                        </span>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {imagePreviews.map((preview: any, index: any) => (
                            <div key={index} className="relative">
                              <img
                                src={`${ASSET_BASE_URL}sioimages/${
                                  preview || ""
                                }`}
                                alt={`preview-${index}`}
                                className="object-cover w-full h-20 rounded-lg cursor-pointer"
                                onClick={() => openImageModal(preview)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800">
                  <div className="p-2 bg-[#dee9ff] rounded-t-lg dark:bg-gray-600">
                    <h2 className="font-semibold text-gray-800 text-md dark:text-gray-200">
                      Assigning Responsibilities
                    </h2>
                  </div>
                  <div className="p-3 ">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="py-1">
                        <div className="flex border-b-[#00000036] border-b-[1px]">
                          <div className="flex-1">
                            <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                              Responsible Person:
                            </span>
                            <span className="font-bold text-gray-600 dark:text-gray-400 ">
                              {logDetails.historyLogSioData[0].responsibilities}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <div className="flex border-b-[#00000036] border-b-[1px]">
                          <div className="flex-1">
                            <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                              target date:
                            </span>
                            <span className="font-bold text-gray-600 dark:text-gray-400 ">
                              {logDetails.historyLogSioData[0].target_date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1">
                      <div className="py-1">
                        <div className="flex border-b-[#00000036] border-b-[1px]">
                          <div className="flex-1">
                            <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                              Action Plan:
                            </span>
                            <span className="font-bold text-gray-600 dark:text-gray-400 ">
                              {logDetails.historyLogSioData[0].action_plan}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
                  <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Closure Details
                    </h2>
                  </div>

                  <div className="w-[100%]   gap-4  justify-evenly">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-1">
                        <TextArea
                          name="closure_desc"
                          label="Closure Description"
                          control={controlActionTaken}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 ">
                      <div className="p-1">
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 text-white bg-[#9fa5b1] rounded-lg focus:outline-none hover:bg-[#9fa5b1]"
                          onClick={handleClosureFileButtonClick}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Upload Photos
                        </button>
                        <input
                          type="file"
                          multiple
                          onChange={handleClosureFileChange}
                          style={{ display: "none" }}
                          ref={closureFileInputRef}
                          accept=".jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                    <div className="flex mt-4 space-x-4 overflow-x-auto">
                      {closureImagePreviews.map((preview: any, index: any) => (
                        <div key={index} className="relative">
                          <img
                            src={`${ASSET_BASE_URL}sioimages/${preview || ""}`}
                            alt={`preview-${index}`}
                            className="object-cover w-24 h-24 rounded-lg cursor-pointer"
                            onClick={() => openImageModal(preview)}
                          />
                          <button
                            onClick={() => handleDeleteClosureImage(preview)}
                            className="absolute top-0 right-0 p-1 text-xs text-white bg-red-500 rounded-full hover:bg-red-700"
                            type="button"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalPopupMobile>
      <ModalPopup
        heading="View Image"
        onClose={handleImageDialogClose}
        openStatus={showImageDialog.status}
        hasSubmit={false}
        size="fullscreen"
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <img
            src={`${ASSET_BASE_URL}sioimages/${modalImage || ""}`}
            alt="previewimage"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </ModalPopup>
    </div>
  );
}

export default ActionTaken;
