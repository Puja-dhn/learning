import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ArrowPathIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
// import { utils, writeFile } from "xlsx";

import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";

import { ILogSIOData, ILogSioFilterForm } from "@/features/sis/types";
import ISIOPDCAssignData from "@/features/sis/types/sis/ISIOPDCAssignData";
import { IOptionList } from "@/features/ui/types";
import * as XLSX from "xlsx";
import usePtwOpenLogDetailQuery from "@/features/ptw/hooks/usePtwOpenLogDetailQuery";
import { usePTWMasterDataQuery } from "@/features/ptw/hooks";
import ILogPtwData from "@/features/ptw/types/ptw/ILogPtwData";
import ILogPTWApproveForm from "@/features/ptw/types/ptw/ILogPTWApproveForm";
import { TextArea } from "@/features/ui/form";
import { submitCustodianApproval } from "@/features/ptw/services/ptw.services";

interface ILogPtwTeamData {
  historyLogPtwData: ILogPtwData[];
}
const initialApproveValues: ILogPTWApproveForm = {
  id: 0,
  comments: "",
};
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

function ApprovePtw() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [categories, setCategories] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IOptionList[]>([]);
  const [users, setUsers] = useState<IOptionList[]>([]);
  const [custodianName, setCustodianName] = useState<string>("");
  const [issuerName, setIssuerName] = useState<string>("");

  const {
    data: ptwMasterData,
    isLoading: isPTWMasterDataLoading,
    isError: isPTWMasterDataError,
  } = usePTWMasterDataQuery();

  useEffect(() => {
    if (isPTWMasterDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isPTWMasterDataLoading && isPTWMasterDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isPTWMasterDataLoading && !isPTWMasterDataError && ptwMasterData) {
      const historyPTWMasterData = [ptwMasterData.historyPTWMasterData];
      if (historyPTWMasterData.length > 0) {
        setDepartments(historyPTWMasterData[0].DEPARTMENT);
        setAreas(historyPTWMasterData[0].AREA);
        setUsers(historyPTWMasterData[0].USERS);
        loader.hide();
      } else {
        loader.show();
      }
    }
  }, [ptwMasterData, isPTWMasterDataLoading, isPTWMasterDataError]);

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
  const [teamData, setTeamData] = useState<ILogPtwTeamData>({
    historyLogPtwData: [],
  });

  const [logDetails, setLogDetails] = useState<ILogPtwTeamData>({
    historyLogPtwData: [],
  });

  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState({
    status: false,
  });

  const [showApproveDialog, setShowApproveDialog] = useState({
    status: false,
  });
  const [showImageDialog, setShowImageDialog] = useState({
    status: false,
  });

  const {
    handleSubmit: handleApproveDetails,
    reset: resetApproveForm,
    control: controlApprove,
    formState: formStatePDC,
  } = useForm<ILogPTWApproveForm>({
    defaultValues: initialApproveValues,
  });

  const { submitCount, errors } = formStatePDC;
  const handleApproveDialogClose = () => {
    setShowApproveDialog((oldState) => ({ ...oldState, status: false }));
  };
  const handleActionClick = (row: ILogPtwData) => {
    const currPtw = teamData.historyLogPtwData.filter(
      (item: ILogPtwData) => +item.id === +row.id,
    );
    setIssuerName(currPtw[0].log_by);
    setCustodianName(currPtw[0].pending_on);
    resetApproveForm({
      id: +row.id,
    });
    setShowApproveDialog({
      status: true,
    });
  };
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton
            className="ml-2"
            onClick={() => handleActionClick(params.row)}
          >
            <PencilSquareIcon className="w-4 h-4" />
          </IconButton>
          <IconButton className="ml-2">
            <EyeIcon className="w-4 h-4" />
          </IconButton>
        </>
      ),
    },
    { field: "disp_logno", headerName: "Log No", width: 70 },
    { field: "department", headerName: "Department", width: 240 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "area", headerName: "Area", width: 250 },
    { field: "datetime_from", headerName: "Time From", width: 220 },
    { field: "datetime_to", headerName: "Time To", width: 220 },
    { field: "work_location", headerName: "Work Location", width: 200 },
    { field: "pending_on", headerName: "Pending On", width: 200 },
    { field: "log_by", headerName: "Log By", width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  // const [reportedByList, setReportedByList] = useState<IOptionList[]>([
  //   { id: 0, name: "All Reported By" },
  // ]);
  const queryClient = useQueryClient();

  const [filterList, setFilterList] = useState<ILogSioFilterForm>({
    ...initialFilterValues,
  });

  const isAdmin =
    authState.ROLES &&
    authState.ROLES.length > 0 &&
    authState.ROLES.includes(2);

  const CURR_OBS_SEVERITY_LIST = [
    { id: "Minor", name: "Minor" },
    { id: "Serious", name: "Serious" },
  ];
  const CURR_OBS_STATUS_LIST = [
    { id: "Open", name: "Open" },
    { id: "PDC Assigned", name: "PDC Assigned" },
    { id: "Closed", name: "Closed" },
  ];

  const {
    data: ptwLogHistoryData,
    isLoading: isPtwLogHistoryDataLoading,
    isError: isPtwLogHistoryDataError,
  } = usePtwOpenLogDetailQuery(filterList);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    formState: formStateFilter,
  } = useForm<ILogSioFilterForm>({
    defaultValues: initialFilterValues,
  });

  const { submitCount: submitCountFilter, errors: errorsFilter } =
    formStateFilter;

  const handleReset = () => {
    resetFilter({
      ...initialFilterValues,
    });
  };

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
    if (isPtwLogHistoryDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isPtwLogHistoryDataLoading && isPtwLogHistoryDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isPtwLogHistoryDataLoading &&
      !isPtwLogHistoryDataError &&
      ptwLogHistoryData
    ) {
      // const historyLogAectData = [...aectLogHistoryData.historyLogAectData];
      const historyLogPtwData = !isAdmin
        ? [
            ...ptwLogHistoryData.historyLogPtwData.filter(
              (item: any) => +item.created_by === authState.ID,
            ),
          ]
        : [...ptwLogHistoryData.historyLogptwData];

      setTeamData({
        historyLogPtwData,
      });
    }
  }, [ptwLogHistoryData, isPtwLogHistoryDataLoading, isPtwLogHistoryDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "openPtwDataQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "openPtwDataQuery",
    });
  };

  const handleShowLogDetails = (logNo: number) => {
    const historyLogPtwData = [
      ...teamData.historyLogPtwData.filter((item) => +item.id === +logNo),
    ];
    setLogDetails({ historyLogPtwData });

    setShowLogDetailsDialog({
      status: true,
    });
  };
  const handleLogDetailsDialogClose = () => {
    setShowLogDetailsDialog((oldState) => ({
      ...oldState,
      status: false,
    }));
    setImagePreviews([]);
  };

  const customNoRowsOverlay = () => {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        No Data Available
      </div>
    );
  };

  const handleApproveFormSubmit: SubmitHandler<ILogPTWApproveForm> = (
    values: any,
  ) => {
    loader.show();
    submitCustodianApproval(values)
      .then(() => {
        alertToast.show(
          "success",
          "Custodian Approved Succesfully",
          true,
          2000,
        );
        setShowApproveDialog((oldState) => ({
          ...oldState,
          status: false,
        }));
        handleRefresh();
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
  const handleExport = () => {
    const rows = teamData.historyLogPtwData.map((item: ILogPtwData) => ({
      "Log No": item.disp_logno,
      Department: item.department,
      Status: item.status,
      Area: item.area,
      "Time From": item.datetime_from,
      "Time To": item.datetime_to,
      "Work Location": item.work_location,
      "Pending On": item.pending_on,
      "Log By": item.log_by,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.xlsx");
  };
  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-hidden text-sm md:p-6">
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">
          Approve PTW
        </div>
        <div className="flex items-center justify-end gap-4 ml-20">
          <IconButton onClick={handleExport}>
            <ArrowDownTrayIcon className="w-4 h-4" />
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
              rows={teamData.historyLogPtwData}
              columns={columns}
              getRowId={(row) =>
                row.TEAM_ID || row.ID || Math.random().toString(36).substring(2)
              }
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
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
        </div>
      ) : (
        <div className="flex flex-col h-full gap-2 overflow-auto ">working</div>
      )}
      <ModalPopup
        heading="Comment by Custodian"
        onClose={handleApproveDialogClose}
        openStatus={showApproveDialog.status}
        hasSubmit
        onSubmit={() => {
          handleApproveDetails(handleApproveFormSubmit)();
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
              <form className="w-[100%]   gap-4  justify-evenly">
                <div className="p-2 text-gray-700 basis-full sm:basis-1/2 lg:basis-1/2 dark:text-gray-300">
                  <span className="font-semibold">
                    Name of Custodian:&nbsp;&nbsp;
                  </span>
                  {custodianName}
                </div>
                <div className="p-2 text-gray-700 basis-full sm:basis-1/2 lg:basis-1/2 dark:text-gray-300">
                  <span className="font-semibold">
                    Name of Issuer:&nbsp;&nbsp;
                  </span>
                  {issuerName}
                </div>
                <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/2">
                  <TextArea
                    name="comments"
                    label="Comments"
                    control={controlApprove}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
}

export default ApprovePtw;
