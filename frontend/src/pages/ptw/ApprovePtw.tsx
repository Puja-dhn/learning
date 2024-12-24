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
import { TextArea, TextField } from "@/features/ui/form";
import { submitCustodianApproval } from "@/features/ptw/services/ptw.services";
import ILogPTWData from "@/features/ptw/types/ptw/ILogPtwData";
import IConfigsList from "@/features/ptw/types/ptw/IConfigsList";
import IContractorList from "@/features/ptw/types/ptw/IContractorList";

interface ILogPtwTeamData {
  historyLogPtwData: ILogPtwData[];
}
interface IAnxPerson {
  name: string;
  contractor: string;
  trade: string;
  ticketNo: string;
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
  const [modalImage, setModalImage] = useState<string>("");
  const [isHazardSectionOpen, setIsHazardSectionOpen] = useState(false);
  const [hazardsChecklist, setHazardsChecklist] = useState<IOptionList[]>([]);
  const [configs, setConfigs] = useState<IConfigsList[]>([]);

  const [masterContractors, setMasterContractors] = useState<IContractorList[]>(
    [],
  );
  const [contractors, setContractors] = useState<IOptionList[]>([]);
  const [departmentHeadName, setDepartmentHeadName] = useState<string>("");
  const [isRiskSectionOpen, setIsRiskSectionOpen] = useState(false);
  const [riskChecklist, setRiskChecklist] = useState<IOptionList[]>([]);
  const [isPPESectionOpen, setIsPPESectionOpen] = useState(false);
  const [ppeChecklist, setPPEChecklist] = useState<IOptionList[]>([]);
  const [assGenChecklist, setAssGenChecklist] = useState<IOptionList[]>([]);
  const [isAssWHSectionOpen, setIsAssWHSectionOpen] = useState(false);
  const [assWHChecklist, setAssWHChecklist] = useState<IOptionList[]>([]);
  const [isAssConfinedSectionOpen, setIsAssConfinedSectionOpen] =
    useState(false);
  const [assConfinedChecklist, setAssConfinedChecklist] = useState<
    IOptionList[]
  >([]);
  const [isAssLiftingSectionOpen, setIsAssLiftingSectionOpen] = useState(false);
  const [assLiftingChecklist, setAssLiftingChecklist] = useState<IOptionList[]>(
    [],
  );
  const [isAssEsmsSectionOpen, setIsAssEsmsSectionOpen] = useState(false);
  const [assEsmsChecklist, setAssEsmsChecklist] = useState<IOptionList[]>([]);
  const [isAssHotWrkSectionOpen, setIsAssHotWrkSectionOpen] = useState(false);
  const [assHotWrkChecklist, setAssHotWrkChecklist] = useState<IOptionList[]>(
    [],
  );
  const [issuerName, setIssuerName] = useState<string>("");
  const [custodianName, setCustodianName] = useState<string>("");

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

      if (historyPTWMasterData && historyPTWMasterData.length > 0) {
        const ownDepartment = historyPTWMasterData[0].DEPARTMENT.filter(
          (item: any) => +item.id === +authState.DEPARTMENT,
        );
        setDepartmentHeadName(ownDepartment[0].head_name);
        setConfigs(historyPTWMasterData[0].CONFIG);
        setAreas(historyPTWMasterData[0].AREA);

        const filtercontractors = historyPTWMasterData[0].CONTRACTORS.map(
          (contractor: any) => ({
            id: contractor.id,
            name: contractor.contractor_name,
          }),
        );
        setContractors(filtercontractors);
        const filterhazards = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "Hazard Identification",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setHazardsChecklist(filterhazards);
        const filterRisks = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "Risk Assessment",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));

        setRiskChecklist(filterRisks);
        const filterPPE = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "PPE Required",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setPPEChecklist(filterPPE);

        const filterAssGen = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "General Work",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setAssGenChecklist(filterAssGen);

        const filterAssWH = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "Work at Height",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setAssWHChecklist(filterAssWH);

        const filterAssConfined = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "Confined Space",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setAssConfinedChecklist(filterAssConfined);

        const filterAssLifting = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "Lifiting Work",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setAssLiftingChecklist(filterAssLifting);

        const filterAssEsms = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "ESMS Work Permit",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setAssEsmsChecklist(filterAssEsms);

        const filterAssHotWrk = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "Hot Work",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setAssHotWrkChecklist(filterAssHotWrk);
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
  const [showViewPtwDialog, setShowViewPtwDialog] = useState({
    status: false,
  });
  const [associatedIds, setAssociatedIds] = useState<any[]>([]);
  const [hazardsChecklistIds, setHazardsChecklistIds] = useState<any[]>([]);
  const [riskChecklistIds, setRiskChecklistIds] = useState<any[]>([]);
  const [ppeChecklistIds, setPPEChecklistIds] = useState<any[]>([]);
  const [assGenChecklistIds, setAssGenChecklistIds] = useState<any[]>([]);
  const [assWHChecklistIds, setAssWHChecklistIds] = useState<any[]>([]);
  const [assConfinedChecklistIds, setAssConfinedChecklistIds] = useState<any[]>(
    [],
  );
  const [assLiftingChecklistIds, setAssLiftingChecklistIds] = useState<any[]>(
    [],
  );
  const [assEsmsChecklistIds, setAssEsmsChecklistIds] = useState<any[]>([]);
  const [assHotWrkChecklistIds, setAssHotWrkChecklistIds] = useState<any[]>([]);

  const [anxRows, setAnxRows] = useState<IAnxPerson[]>([]);

  const {
    reset: resetViewDetails,
    control: controlView,

    watch: watchValues,
  } = useForm<ILogPTWData>({});

  const handleViewPtwDialogClose = () => {
    setShowViewPtwDialog((oldState) => ({ ...oldState, status: false }));
  };

  const handleViewClick = (row: ILogPTWData) => {
    if (row.associated_permit !== "") {
      setAssociatedIds(JSON.parse(row.associated_permit));
    }
    if (row.hazard_identification !== "") {
      setIsHazardSectionOpen(true);
      setHazardsChecklistIds(JSON.parse(row.hazard_identification));
    }
    if (row.risk_assessment !== "") {
      setIsRiskSectionOpen(true);
      setRiskChecklistIds(JSON.parse(row.risk_assessment));
    }
    if (row.ppe_required !== "") {
      setIsPPESectionOpen(true);
      setPPEChecklistIds(JSON.parse(row.ppe_required));
    }
    if (row.annexture_v !== "") {
      setAnxRows(JSON.parse(row.annexture_v));
    }
    if (row.general_work_dtls !== "") {
      setAssGenChecklistIds(JSON.parse(row.general_work_dtls));
    }
    if (row.work_height_checklist !== "") {
      setIsAssWHSectionOpen(true);
      setAssWHChecklistIds(JSON.parse(row.work_height_checklist));
    }
    if (row.confined_space_checklist !== "") {
      setIsAssConfinedSectionOpen(true);
      setAssConfinedChecklistIds(JSON.parse(row.confined_space_checklist));
    }
    if (row.lifting_work_checklist !== "") {
      setIsAssLiftingSectionOpen(true);
      setAssLiftingChecklistIds(JSON.parse(row.lifting_work_checklist));
    }
    if (row.esms_checklist !== "") {
      setIsAssConfinedSectionOpen(true);
      setAssEsmsChecklistIds(JSON.parse(row.esms_checklist));
    }
    if (row.hot_work_checklist !== "") {
      setIsAssHotWrkSectionOpen(true);
      setAssHotWrkChecklistIds(JSON.parse(row.hot_work_checklist));
    }

    resetViewDetails({
      id: row.id,
      department: row.department,
      department_id: row.department_id,
      area_id: row.area_id,
      area: row.area,
      work_location: row.work_location,
      datetime_from: row.datetime_from,
      datetime_to: row.datetime_to,
      nearest_firealarm: row.nearest_firealarm,
      job_description: row.job_description,
      moc_required: row.moc_required,
      moc_title: row.moc_title,
      moc_no: row.moc_no,
      supervisor_name: row.supervisor_name,
      pending_on_id: row.pending_on_id,
      pending_on: row.pending_on,
      status: row.status,
      contractor: row.contractor,
      esic_no: row.esic_no,
      associated_permit: row.associated_permit,
      hazard_identification: row.hazard_identification,
      other_hazards: row.other_hazards,
      risk_assessment: row.risk_assessment,
      ppe_required: row.ppe_required,
      ei_panel_name: row.ei_panel_name,
      ei_loto_no: row.ei_loto_no,
      ei_checked_by: row.ei_checked_by,
      ei_date_time: row.ei_date_time,
      si_panel_name: row.si_panel_name,
      si_loto_no: row.si_loto_no,
      si_checked_by: row.si_checked_by,
      si_date_time: row.si_date_time,
      general_work_dtls: row.general_work_dtls,
      annexture_v: row.annexture_v,
      work_height_checklist: row.work_height_checklist,
      work_height_supervision: row.work_height_supervision,
      confined_space_checklist: row.confined_space_checklist,
      confined_space_supervision: row.confined_space_supervision,
      confined_space_atmospheric: row.confined_space_atmospheric,
      confined_space_oxygen_level: row.confined_space_oxygen_level,
      confined_space_lel: row.confined_space_lel,
      confined_space_toxic: row.confined_space_toxic,
      confined_space_detector: row.confined_space_detector,
      lifting_work_checklist: row.lifting_work_checklist,
      esms_checklist: row.esms_checklist,
      hot_work_checklist: row.hot_work_checklist,
      equipment: row.equipment,
    });

    setShowViewPtwDialog({
      status: true,
    });
  };

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
            onClick={() => handleViewClick(params.row)}
          >
            <EyeIcon className="w-4 h-4" />
          </IconButton>
          <IconButton
            className="ml-2"
            onClick={() => handleActionClick(params.row)}
          >
            <PencilSquareIcon className="w-4 h-4" />
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
  const handleCheckAssPermit = (type: any) => {
    if (associatedIds.includes(type)) {
      return true;
    }
  };
  const handleCheckedHazards = (type: any) => {
    if (hazardsChecklistIds.includes(`${type}`)) {
      return true;
    }
  };
  const handleCheckedRisksAsse = (type: any) => {
    if (riskChecklistIds.includes(`${type}`)) {
      return true;
    }
  };
  const handleCheckedPPE = (type: any) => {
    if (ppeChecklistIds.includes(`${type}`)) {
      return true;
    }
  };
  const handleCheckedGenChecklist = (type: any) => {
    if (assGenChecklistIds.includes(`${type}`)) {
      return true;
    }
  };

  const handleCheckedAssWhChecklist = (type: any) => {
    if (assWHChecklistIds.includes(`${type}`)) {
      return true;
    }
  };
  const handleCheckedAssConfinedChecklist = (type: any) => {
    if (assConfinedChecklistIds.includes(`${type}`)) {
      return true;
    }
  };
  const handleCheckeAssLiftingChecklist = (type: any) => {
    if (assLiftingChecklistIds.includes(`${type}`)) {
      return true;
    }
  };
  const handleCheckedEsmsChecklist = (type: any) => {
    if (assEsmsChecklistIds.includes(`${type}`)) {
      return true;
    }
  };
  const handleCheckedHotWrkChecklist = (type: any) => {
    if (assHotWrkChecklistIds.includes(`${type}`)) {
      return true;
    }
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
        heading="View Permit Details"
        onClose={handleViewPtwDialogClose}
        openStatus={showViewPtwDialog.status}
        hasSubmit={false}
        size="fullscreen"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
            <form className="w-[100%]   flex gap-2 flex-col  justify-evenly">
              <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
                <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                  <h2 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                    General Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <TextField
                      name="department"
                      label="Department"
                      control={controlView}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="area"
                      label="Area"
                      control={controlView}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="work_location"
                      label="Work Location"
                      control={controlView}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <TextField
                      name="datetime_from"
                      label="Date Time From"
                      control={controlView}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="datetime_to"
                      label="Date Time To"
                      control={controlView}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      type="text"
                      name="nearest_firealarm"
                      label="Nearest Fire Alarm Point"
                      control={controlView}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1">
                  <div className="p-1">
                    <TextArea
                      name="job_description"
                      label="Job Description"
                      control={controlView}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1">
                  <div className="p-1 text-gray-700 ">
                    Is MOC Required ?{" "}
                    <input
                      type="radio"
                      name="moc_required"
                      value="Yes"
                      checked={watchValues("moc_required") === "Yes"}
                    />
                    &nbsp;&nbsp;Yes &nbsp;&nbsp;
                    <input
                      type="radio"
                      name="moc_required"
                      value="No"
                      checked={watchValues("moc_required") === "No"}
                    />
                    &nbsp;&nbsp;No
                  </div>
                </div>
                {watchValues("moc_required") === "Yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-1">
                      <TextField
                        name="moc_title"
                        label="Moc Title"
                        control={controlView}
                        disabled
                      />
                    </div>
                    <div className="p-1">
                      <TextField
                        name="moc_no"
                        label="Moc No"
                        control={controlView}
                        disabled
                      />
                    </div>
                  </div>
                )}
                {watchValues("moc_required") === "No" && (
                  <div className="grid grid-cols-1 md:grid-cols-1">
                    <div className="p-1">
                      <TextArea
                        name="why_moc_remarks"
                        label="Why MOC select No (Remarks) "
                        control={controlView}
                        disabled
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-1">
                  <div className="p-1">
                    <TextArea
                      name="equipment"
                      label="	Equipment(s) to be worked on "
                      control={controlView}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <TextField
                      name="supervisor_name"
                      label="Name of Supervisor"
                      control={controlView}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="contractor"
                      label="Contractor"
                      control={controlView}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="esic_no"
                      label="ESIC Reg No"
                      control={controlView}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 p-4 text-gray-700 md:grid-cols-6">
                  Associated Permit(s) &nbsp;&nbsp;
                  <div className="p-1">
                    Work at Height &nbsp;
                    <input
                      type="checkbox"
                      value="Yes"
                      checked={handleCheckAssPermit("Work at Height")}
                    />
                  </div>
                  <div className="p-1">
                    Confined Space &nbsp;
                    <input
                      type="checkbox"
                      value="Yes"
                      checked={handleCheckAssPermit("Confined Space")}
                    />
                  </div>
                  <div className="p-1">
                    Lifiting Work &nbsp;
                    <input
                      type="checkbox"
                      value="Yes"
                      checked={handleCheckAssPermit("Lifting Work")}
                    />
                  </div>
                  <div className="p-1">
                    ESMS Work Permit &nbsp;
                    <input
                      type="checkbox"
                      value="Yes"
                      checked={handleCheckAssPermit("ESMS Work Permit")}
                    />
                  </div>
                  <div className="p-1">
                    Hot Work &nbsp;
                    <input
                      type="checkbox"
                      value="Yes"
                      checked={handleCheckAssPermit("Hot Work")}
                    />
                  </div>
                </div>
              </div>
              {/* others data */}
              <div className="grid border-[1px] border-gray-200 rounded-lg dark:border-gray-500 dark:bg-gray-800">
                <div className="">
                  <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                    <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                      Hazard Identification &nbsp;
                    </h3>
                    <input
                      type="radio"
                      name="hazard_identifications"
                      value="Yes"
                      checked={watchValues("hazard_identification") !== ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">Yes</span>
                    &nbsp;&nbsp;
                    <input
                      type="radio"
                      name="hazard_identifications"
                      value="No"
                      checked={watchValues("hazard_identification") === ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">No</span>
                  </div>

                  {/* Conditionally render collapsible section */}
                  {isHazardSectionOpen && (
                    <div className="p-2 mt-1 text-gray-700">
                      {hazardsChecklist && hazardsChecklist.length > 0 && (
                        <div>
                          {hazardsChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]); // Create a new row every 3 items
                              rows[rows.length - 1].push(item); // Add item to the last row
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div className="p-1 " key={index}>
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`hazard_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckedHazards(item2.id)}
                                      />
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="p-1">
                        <TextField
                          name="other_hazards"
                          label="Any other specific hazards"
                          control={controlView}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                <div className="">
                  <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                    <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                      Risk Assessment &nbsp;
                    </h3>
                    <input
                      type="radio"
                      name="risk_assessment"
                      value="Yes"
                      checked={watchValues("risk_assessment") !== ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">Yes</span>
                    &nbsp;&nbsp;
                    <input
                      type="radio"
                      name="risk_assessment"
                      value="No"
                      checked={watchValues("risk_assessment") === ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">No</span>
                  </div>

                  {/* Conditionally render collapsible section */}
                  {isRiskSectionOpen && (
                    <div className="p-2 mt-1 border-2 ">
                      {riskChecklist && riskChecklist.length > 0 && (
                        <div>
                          {riskChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]); // Create a new row every 3 items
                              rows[rows.length - 1].push(item); // Add item to the last row
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div
                                    className="p-1 text-gray-700"
                                    key={index}
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`risk_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckedRisksAsse(
                                          item2.id,
                                        )}
                                      />{" "}
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                <div className="">
                  <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                    <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                      PPE Required &nbsp;
                    </h3>
                    <input
                      type="radio"
                      name="ppe_required"
                      value="Yes"
                      checked={watchValues("ppe_required") !== ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">Yes</span>
                    &nbsp;&nbsp;
                    <input
                      type="radio"
                      name="ppe_required"
                      value="No"
                      checked={watchValues("ppe_required") === ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">No</span>
                  </div>

                  {/* Conditionally render collapsible section */}
                  {isPPESectionOpen && (
                    <div className="p-2 mt-1 ">
                      {ppeChecklist && ppeChecklist.length > 0 && (
                        <div>
                          {ppeChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]); // Create a new row every 3 items
                              rows[rows.length - 1].push(item); // Add item to the last row
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div
                                    className="p-1 text-gray-700"
                                    key={index}
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`risk_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckedPPE(item2.id)}
                                      />
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                <div className="">
                  <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                    <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                      Isolation Details &nbsp;
                    </h3>
                    <input
                      type="radio"
                      name="isolation_required"
                      value="Yes"
                      checked={watchValues("ei_panel_name") !== ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">Yes</span>
                    &nbsp;&nbsp;
                    <input
                      type="radio"
                      name="isolation_required"
                      value="No"
                      checked={watchValues("ei_panel_name") === ""}
                    />
                    &nbsp;&nbsp;<span className="text-black">No</span>
                  </div>

                  {watchValues("ei_panel_name") !== "" && (
                    <div className="grid grid-cols-1 gap-4 p-2 mt-1 md:grid-cols-2">
                      {/* Electrical Isolation Section */}
                      <div className="p-1 mb-4 border-r-2 md:col-span-1">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Electrical Isolation
                        </h3>
                        {/* Content for Electrical Isolation */}
                        <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                          <div className="p-1">
                            <TextField
                              name="ei_panel_name"
                              label="Drive/Panel Name"
                              control={controlView}
                              disabled
                            />
                          </div>
                          <div className="p-1">
                            <TextField
                              name="ei_loto_no"
                              label="LOTO No"
                              control={controlView}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                          <div className="p-1">
                            <TextField
                              name="ei_checked_by"
                              label="Checked By"
                              control={controlView}
                              disabled
                            />
                          </div>
                          <div className="p-1">
                            <TextField
                              name="ei_date_time"
                              label="Date & Time"
                              control={controlView}
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      {/* Vertical Divider (Visible only on desktop) */}
                      {/* <div className="hidden md:block border-l border-gray-300 w-[10px]" /> */}

                      {/* Service Isolation Section */}
                      <div className="p-1 md:col-span-1">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Service Isolation
                        </h3>
                        {/* Content for Service Isolation */}
                        <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                          <div className="p-1">
                            <TextField
                              name="si_panel_name"
                              label="Steam/Air/Water/Gas"
                              control={controlView}
                              disabled
                            />
                          </div>
                          <div className="p-1">
                            <TextField
                              name="si_loto_no"
                              label="LOTO No"
                              control={controlView}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                          <div className="p-1">
                            <TextField
                              name="si_checked_by"
                              label="Checked By"
                              control={controlView}
                              disabled
                            />
                          </div>
                          <div className="p-1">
                            <TextField
                              name="si_date_time"
                              label="Date & Time"
                              control={controlView}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid border-[1px] border-gray-200 rounded-lg dark:border-gray-500 dark:bg-gray-800">
                <div className="">
                  <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                    <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                      General Work/Cold Work &nbsp;
                    </h3>
                  </div>

                  <div className="p-2 mt-1">
                    {assGenChecklist && assGenChecklist.length > 0 && (
                      <div>
                        {assGenChecklist
                          .reduce((rows: any, item: any, index: any) => {
                            if (index % 4 === 0) rows.push([]);
                            rows[rows.length - 1].push(item);
                            return rows;
                          }, [])
                          .map((row: any, rowIndex: any) => (
                            <div
                              className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                              key={rowIndex}
                            >
                              {row.map((item2: any, index: any) => (
                                <div className="p-1 text-gray-700" key={index}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      name={`general_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                      value="Yes"
                                      checked={handleCheckedGenChecklist(
                                        item2.id,
                                      )}
                                    />
                                    &nbsp;
                                    {item2.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
                    <div className="grid grid-cols-1">
                      <TextField
                        name="ass_gen_supervision"
                        label="Supervision provided by"
                        control={controlView}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                <div className="">
                  <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                    <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                      List of persons attached to this permit (Annexure V)
                      &nbsp;
                    </h3>
                  </div>

                  <div className="mt-1">
                    <table className="min-w-full border-collapse table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left border-b">
                            Sl. No.
                          </th>
                          <th className="px-4 py-2 text-left border-b">
                            Name of Person
                          </th>
                          <th className="px-4 py-2 text-left border-b">
                            Own / Contractor
                          </th>
                          <th className="px-4 py-2 text-left border-b">
                            Trade
                          </th>
                          <th className="px-4 py-2 text-left border-b">
                            ESIC No.
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Render additional rows from anxRows */}
                        {anxRows &&
                          anxRows.length > 0 &&
                          anxRows.map((item: IAnxPerson, index: number) => {
                            return (
                              <tr key={index}>
                                <td className="px-4 py-2 border-b">
                                  {index + 2}
                                </td>{" "}
                                {/* Display row number starting from 2 */}
                                <td className="px-4 py-2 border-b">
                                  {item.name}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {item.contractor}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {item.trade}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {item.ticketNo}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {isAssWHSectionOpen && (
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Work at Height
                      </h3>
                    </div>
                    <div className="p-2 mt-1 ">
                      {assWHChecklist && assWHChecklist.length > 0 && (
                        <div>
                          {assWHChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]);
                              rows[rows.length - 1].push(item);
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div
                                    className="p-1 text-gray-700"
                                    key={index}
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`ass_wh_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckedAssWhChecklist(
                                          item2.id,
                                        )}
                                      />
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-1">
                        <TextField
                          name="ass_wh_supervision"
                          label="Supervision provided by(Atomberg's Emp)"
                          control={controlView}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isAssConfinedSectionOpen && (
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Confined Space
                      </h3>
                    </div>
                    <div className="p-2 mt-1 ">
                      {assConfinedChecklist && assConfinedChecklist.length > 0 && (
                        <div>
                          {assConfinedChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]);
                              rows[rows.length - 1].push(item);
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div
                                    className="p-1 text-gray-700"
                                    key={index}
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`ass_confined_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckedAssConfinedChecklist(
                                          item2.id,
                                        )}
                                      />
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-4">
                      <TextField
                        name="confined_space_supervision"
                        label="Supervision provided by(Atomberg's Emp)"
                        control={controlView}
                      />
                      <TextField
                        name="confined_space_atmospheric"
                        label="Atmospheric Checks done by"
                        control={controlView}
                      />
                      <TextField
                        name="confined_space_oxygen_level"
                        label="Oxygen level (19% - 21%)"
                        control={controlView}
                      />
                      <TextField
                        name="confined_space_lel"
                        label="Explosive LEL & UEL"
                        control={controlView}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-4">
                      <TextField
                        name="confined_space_toxic"
                        label="Toxic"
                        control={controlView}
                      />
                      <TextField
                        name="confined_space_detector"
                        label="Detector Details"
                        control={controlView}
                      />
                    </div>
                  </div>
                </div>
              )}
              {isAssLiftingSectionOpen && (
                <div className="grid border-[1px] border-gray-200 rounded-lg dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Lifiting Work
                      </h3>
                    </div>
                    <div className="p-2 mt-1 ">
                      {assLiftingChecklist && assLiftingChecklist.length > 0 && (
                        <div>
                          {assLiftingChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]);
                              rows[rows.length - 1].push(item);
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div
                                    className="p-1 text-gray-700"
                                    key={index}
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`ass_lifting_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckeAssLiftingChecklist(
                                          item2.id,
                                        )}
                                      />
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {isAssEsmsSectionOpen && (
                <div className="grid border-[1px] border-gray-200 rounded-lg dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        ESMS Work Permit
                      </h3>
                    </div>
                    <div className="p-2 mt-1 ">
                      {assEsmsChecklist && assEsmsChecklist.length > 0 && (
                        <div>
                          {assEsmsChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]);
                              rows[rows.length - 1].push(item);
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div
                                    className="p-1 text-gray-700"
                                    key={index}
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`ass_esms_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckedEsmsChecklist(
                                          item2.id,
                                        )}
                                      />
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {isAssHotWrkSectionOpen && (
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Hot Work
                      </h3>
                    </div>
                    <div className="p-2 mt-1">
                      {assHotWrkChecklist && assHotWrkChecklist.length > 0 && (
                        <div>
                          {assHotWrkChecklist
                            .reduce((rows: any, item: any, index: any) => {
                              if (index % 4 === 0) rows.push([]);
                              rows[rows.length - 1].push(item);
                              return rows;
                            }, [])
                            .map((row: any, rowIndex: any) => (
                              <div
                                className="grid grid-cols-1 gap-2 mb-4 border-b border-gray-200 md:grid-cols-4"
                                key={rowIndex}
                              >
                                {row.map((item2: any, index: any) => (
                                  <div
                                    className="p-1 text-gray-700"
                                    key={index}
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        name={`ass_lifting_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                        value="Yes"
                                        checked={handleCheckedHotWrkChecklist(
                                          item2.id,
                                        )}
                                      />
                                      &nbsp;
                                      {item2.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* end */}
            </form>
          </div>
        </div>
      </ModalPopup>
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
