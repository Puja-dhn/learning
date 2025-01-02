import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
// import { utils, writeFile } from "xlsx";

import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { API_BASE_URL, ASSET_BASE_URL } from "@/features/common/constants";
// import { IOptionList } from "@/features/ui/types";
import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import { DropdownList, TextArea, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import { IOptionList } from "@/features/ui/types";
import IAreasList from "@/features/sis/types/sis/IAreasList";
import ILogImsFilterForm from "@/features/ims/types/ILogImsFilterForm";
import useIMSMasterDataQuery from "@/features/ims/hooks/useIMSMasterDataQuery";
import ILogImsData from "@/features/ims/types/ILogImsData";

import { InputText, SelectSearchable } from "@/features/ui/elements";
import useImsInvestigationDetailQuery from "@/features/ims/hooks/useImsInvestigationDetailQuery";
import ILogInvestigationData from "@/features/ims/types/ILogInvestigationData";
import { submitInvestigationData } from "@/features/ims/services/ims.services";
import Select from "react-select";

interface ILogImsTeamData {
  historyLogImsData: ILogImsData[];
}
interface DocumentRow {
  id: number;
  documentType: string;
  document: string;
}
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
const initialInvestigationValues: ILogInvestigationData = {
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
  repeated_incident: "",
  ims_photos: "",
  immediate_action: "",
  status: "",
  risk_identified: "",
  identified_control: "",
  control_type: "",
  control_description: "",
  control_adequate_desc: "",
  list_facts: "",
  risk_management: "",
  physical_factors: "",
  human_factors: "",
  system_factors: "",
  recommendations: "",
  documents: "",
};
const initialFilterValues: ILogImsFilterForm = {
  incident_no: null,
  department: "All",
  area: "All",
  injury_type: "All",
  factors: "All",
  date_from: "",
  date_to: "",
  status: "All",
};

function IncidentInvestigation() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [injuryType, setInjuryType] = useState<IOptionList[]>([]);
  const [factors, setFactors] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IAreasList[]>([]);
  const [users, setUsers] = useState<IOptionList[]>([]);
  const [filterUsers, setFilterUsers] = useState<IOptionList[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<IOptionList[]>([]);

  const {
    data: imsMasterData,
    isLoading: isIMSMasterDataLoading,
    isError: isIMSMasterDataError,
  } = useIMSMasterDataQuery();

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

      setDepartments(historyImsMasterData[0].DEPARTMENT);
      setInjuryType(historyImsMasterData[0].INJURYTYPE);
      setFactors(historyImsMasterData[0].FACTORS);
      setAreas(historyImsMasterData[0].AREA);
      setUsers(historyImsMasterData[0].USERS);
      setFilterUsers(historyImsMasterData[0].USERS);
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
  const [showInvestigationDialog, setShowInvestigationDialog] = useState({
    status: false,
  });
  const [injuryRow, setInjuryRow] = useState<any[]>([]);
  const [witTeamRow, setWitTeamRow] = useState<any[]>([]);
  const [suggTeamRow, setSuggTeamRow] = useState<any[]>([]);

  const [injuryFilterRow, setInjuryFilterRow] = useState<any[]>([]);
  const [witTeamFilterRow, setWitTeamFilterRow] = useState<any[]>([]);
  const [suggTeamFilterRow, setSuggTeamFilterRow] = useState<any[]>([]);

  const {
    reset: resetActionTaken,
    control: controlAction,
    watch: watchView,
  } = useForm<ILogImsData>({
    defaultValues: initialViewImsValues,
  });

  const {
    handleSubmit: handleSubmitInvestigation,
    reset: resetInvestigation,
    control: controlInvestigation,
    setValue,
    watch: watchInvestigation,
  } = useForm<ILogInvestigationData>({
    defaultValues: initialInvestigationValues,
  });

  const [modalImage, setModalImage] = useState<string>("");
  const [showImageDialog, setShowImageDialog] = useState({
    status: false,
  });

  const handlePDCAssignDialogClose = () => {
    setShowPDCAssignDialog((oldState) => ({ ...oldState, status: false }));
  };

  const handleInvestigationDialogClose = () => {
    setShowInvestigationDialog((oldState) => ({ ...oldState, status: false }));
  };

  const handleActionClick = (row: ILogInvestigationData) => {
    setImagePreviews(JSON.parse(row.ims_photos));
    resetInvestigation({
      disp_logno: row.disp_logno,
      incident_no: row.incident_no,
      inc_date_time: row.inc_date_time,
      department_id: row.department_id,
      department: row.department,
      area_id: row.area_id,
      area: row.area,
      injury_type: row.injury_type,
      factors: row.factors,
      reported_by: row.reported_by,
      exact_location: row.exact_location,
      potential_outcome: row.potential_outcome,
      action_taken: row.action_taken,
      incident_details: row.incident_details,
      immediate_action: row.immediate_action,
      repeated_incident: "No",
    });
    setShowInvestigationDialog({
      status: true,
    });
  };
  const handleViewClick = (row: ILogImsData) => {
    const injFilter = injuryRow.filter(
      (item) => item.header_id === row.incident_no,
    );
    setInjuryFilterRow(injFilter);
    const suggFilter = suggTeamRow.filter(
      (item) => item.header_id === row.incident_no,
    );
    setSuggTeamFilterRow(suggFilter);
    const wittFilter = witTeamRow.filter(
      (item) => item.header_id === row.incident_no,
    );
    setWitTeamFilterRow(wittFilter);
    setImagePreviews(JSON.parse(row.ims_photos));
    resetActionTaken({
      disp_logno: row.disp_logno,
      incident_no: row.incident_no,
      inc_date_time: row.inc_date_time,
      department_id: row.department_id,
      department: row.department,
      area_id: row.area_id,
      area: row.area,
      injury_type: row.injury_type,
      factors: row.factors,
      reported_by: row.reported_by,
      exact_location: row.exact_location,
      potential_outcome: row.potential_outcome,
      action_taken: row.action_taken,
      incident_details: row.incident_details,
      immediate_action: row.immediate_action,
    });
    setShowPDCAssignDialog({
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
          <IconButton
            className="ml-2"
            onClick={() => handleViewClick(params.row)}
          >
            <EyeIcon className="w-4 h-4" />
          </IconButton>
        </>
      ),
    },
    { field: "disp_logno", headerName: "Log No", width: 70 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "inc_date_time", headerName: "Incident Date Time", width: 250 },
    { field: "department", headerName: "Department", width: 240 },
    { field: "area", headerName: "Area", width: 250 },
    { field: "injury_type", headerName: "Injury Type", width: 220 },
    { field: "factors", headerName: "Factors", width: 220 },
    { field: "pending_on", headerName: "Pending On", width: 200 },
    { field: "log_by", headerName: "Log By", width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  // const [reportedByList, setReportedByList] = useState<IOptionList[]>([
  //   { id: 0, name: "All Reported By" },
  // ]);
  const queryClient = useQueryClient();

  const [filterList, setFilterList] = useState<ILogImsFilterForm>({
    ...initialFilterValues,
  });

  const isAdmin =
    authState.ROLES &&
    authState.ROLES.length > 0 &&
    authState.ROLES.includes(2);

  const {
    data: imsLogHistoryData,
    isLoading: isImsLogHistoryDataLoading,
    isError: isImsLogHistoryDataError,
  } = useImsInvestigationDetailQuery(filterList);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    watch: watchValues,
    formState: formStateFilter,
  } = useForm<ILogImsFilterForm>({
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

  const handleFilterFormSubmit: SubmitHandler<ILogImsFilterForm> = (values) => {
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
      const historyLogImsData = !isAdmin
        ? [
            ...imsLogHistoryData.historyLogImsData.filter(
              (item) => +item.created_by === authState.ID,
            ),
          ]
        : [...imsLogHistoryData.historyLogImsData];

      setTeamData({
        historyLogImsData,
      });
      setInjuryRow(imsLogHistoryData.INJURY_DETAILS);
      setSuggTeamRow(imsLogHistoryData.SUGG_TEAM);
      setWitTeamRow(imsLogHistoryData.WITNESS_TEAM);
    }
  }, [imsLogHistoryData, isImsLogHistoryDataLoading, isImsLogHistoryDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "imsDataQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "imsDataQuery",
    });
  };

  useEffect(() => {
    if (+watchValues("department") > 0) {
      const fArea = areas.filter(
        (item) => +item.parent_id === +watchValues("department"),
      );
      setFilteredAreas(fArea);
    }
  }, [watchValues("department")]);

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

  const [factRows, setFactRows] = useState<any>([]);
  const [facts, setFacts] = useState<string>("");
  const [physicalFactorRows, setPhysicalFactorRows] = useState<any>([]);
  const [humanFactorRows, setHumanFactorRows] = useState<any>([]);
  const [systemFactorRows, setSystemFactorRows] = useState<any>([]);
  const [recomendationRows, setRecomendationRows] = useState<any>([]);

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
  const handleExport = () => {
    const rows = teamData.historyLogImsData.map((item) => ({
      "Log No": item.disp_logno,
      Status: item.status,
      "Incident Date Time": item.inc_date_time,
      Department: item.department,
      Area: item.area,
      "Injury Type": item.injury_type,
      factors: item.factors,
      "Pending On": item.pending_on,
      "Log By": item.log_by,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.xlsx");
  };

  const handleInvestigationSubmit: SubmitHandler<ILogInvestigationData> = (
    values,
  ) => {
    if (factRows.length === 0) {
      alertToast.show("warning", "List Of Facts  required", true, 2000);
    } else if (values.risk_identified === "") {
      alertToast.show(
        "warning",
        "Please choose a option in Risk Management",
        true,
        2000,
      );
    } else if (physicalFactorRows.length === 0) {
      alertToast.show("warning", "Physical factor is required", true, 2000);
    } else if (humanFactorRows.length === 0) {
      alertToast.show("warning", "Human factor is required", true, 2000);
    } else if (systemFactorRows.length === 0) {
      alertToast.show("warning", "Syatem factor is required", true, 2000);
    } else if (recomendationRows.length === 0) {
      alertToast.show("warning", "Recommendation is required", true, 2000);
    } else {
      loader.show();
      submitInvestigationData(values)
        .then(() => {
          alertToast.show(
            "success",
            "Investigation Succesfully Completed",
            true,
            2000,
          );

          setShowInvestigationDialog((oldState) => ({
            ...oldState,
            status: false,
          }));
          queryClient.invalidateQueries({
            predicate: (query) =>
              query.queryKey[0] === "imsInvestigationDataQuery",
          });
        })

        .catch((err) => {
          if (err.response && err.response.status) {
            alertToast.show("warning", err.response.data.message, true);
          }
        })
        .finally(() => {
          loader.hide();
        });
    }
  };

  const handleInputChange = (factsname: string) => {
    setFacts(factsname);
  };

  const addFactsRow = () => {
    const listArr = [...factRows];
    const factsObject = {
      id: factRows.length + 1,
      facts,
    };
    listArr.push(factsObject);
    setFactRows(listArr);
    setValue("list_facts", JSON.stringify(listArr), { shouldValidate: true });
    setFacts("");
  };

  const removeFcatsRow = (id: number) => {
    const updatedFactRows = factRows.filter((item: any) => item.id !== id);
    setFactRows(updatedFactRows);
    setValue("list_facts", JSON.stringify(updatedFactRows), {
      shouldValidate: true,
    });
  };

  const [physicalFactorDescription, setPhysicalFactorDescription] =
    useState<string>("");

  const handlePhysicalFactorChange = (factsname: string) => {
    setPhysicalFactorDescription(factsname);
  };

  const addPhysicalFactorsRow = () => {
    const listArr = [...physicalFactorRows];
    const factsObject = {
      id: physicalFactorRows.length + 1,
      description: physicalFactorDescription,
    };
    listArr.push(factsObject);
    setPhysicalFactorRows(listArr);
    setValue("physical_factors", JSON.stringify(listArr), {
      shouldValidate: true,
    });
    setPhysicalFactorDescription("");
  };

  const removePhysicalFactorsRow = (id: number) => {
    const updatedFactRows = physicalFactorRows.filter(
      (item: any) => item.id !== id,
    );
    setPhysicalFactorRows(updatedFactRows);
    setValue("physical_factors", JSON.stringify(updatedFactRows), {
      shouldValidate: true,
    });
  };

  const [humanFactorDescription, setHumanFactorDescription] =
    useState<string>("");

  const handleHumanFactorChange = (factsname: string) => {
    setHumanFactorDescription(factsname);
  };

  const addHumanFactorsRow = () => {
    const listArr = [...humanFactorRows];
    const factsObject = {
      id: humanFactorRows.length + 1,
      description: humanFactorDescription,
    };
    listArr.push(factsObject);
    setHumanFactorRows(listArr);
    setValue("human_factors", JSON.stringify(listArr), {
      shouldValidate: true,
    });
    setHumanFactorDescription("");
  };

  const removeHumanFactorsRow = (id: number) => {
    const updatedFactRows = humanFactorRows.filter(
      (item: any) => item.id !== id,
    );
    setHumanFactorRows(updatedFactRows);
    setValue("human_factors", JSON.stringify(updatedFactRows), {
      shouldValidate: true,
    });
  };

  const [systemFactorDescription, setSystemFactorDescription] =
    useState<string>("");

  const handleSystemFactorChange = (factsname: string) => {
    setSystemFactorDescription(factsname);
  };

  const addSystemFactorsRow = () => {
    const listArr = [...systemFactorRows];
    const factsObject = {
      id: systemFactorRows.length + 1,
      description: systemFactorDescription,
    };
    listArr.push(factsObject);
    setSystemFactorRows(listArr);
    setValue("system_factors", JSON.stringify(listArr), {
      shouldValidate: true,
    });
    setSystemFactorDescription("");
  };

  const removeSystemFactorsRow = (id: number) => {
    const updatedFactRows = systemFactorRows.filter(
      (item: any) => item.id !== id,
    );
    setSystemFactorRows(updatedFactRows);
    setValue("system_factors", JSON.stringify(updatedFactRows), {
      shouldValidate: true,
    });
  };

  const [recomDescription, setRecomDescription] = useState<string>("");
  const [recomResponsibility, setRecomResponsibility] = useState<string>("");
  const [recomResponsibilityId, setRecomResponsibilityId] =
    useState<string>("");
  const [recomFactor, setRecomFactor] = useState<string>("");
  const [recomControltype, setRecomControlType] = useState<string>("");
  const [recomTargetDate, setRecomTargetDate] = useState<string>("");

  const handleRecomDescriptionChange = (name: string) => {
    setRecomDescription(name);
  };
  const handleRecomResponsibilityChange = (name: string) => {
    setRecomResponsibility(name);
  };
  const handleRecomFactorChange = (name: string) => {
    setRecomFactor(name);
  };
  const handleRecomControlTypeChange = (name: string) => {
    setRecomControlType(name);
  };
  const handleRecomTargetDateChange = (name: string) => {
    setRecomTargetDate(name);
  };

  const addRecommendationRow = () => {
    const listArr = [...recomendationRows];
    const factsObject = {
      id: recomendationRows.length + 1,
      recommendation: recomDescription,
      responsibility: recomResponsibility,
      resp_id: recomResponsibilityId,
      factor: recomFactor,
      control_type: recomControltype,
      target_date: recomTargetDate,
    };
    listArr.push(factsObject);
    setRecomendationRows(listArr);
    setValue("recommendations", JSON.stringify(listArr), {
      shouldValidate: true,
    });
    setRecomDescription("");
    setRecomResponsibility("");
    setRecomResponsibilityId("");
    setRecomFactor("");
    setRecomControlType("");
    setRecomTargetDate("");
  };

  const removeRecommendationRow = (id: number) => {
    const updatedFactRows = recomendationRows.filter(
      (item: any) => item.id !== id,
    );
    setRecomendationRows(updatedFactRows);
    setValue("recommendations", JSON.stringify(updatedFactRows), {
      shouldValidate: true,
    });
  };

  const [newDocument, setNewDocument] = useState<DocumentRow>({
    id: 0,
    documentType: "",
    document: "",
  });
  const [documentsRow, setDocumentsRow] = useState<DocumentRow[]>([]);

  // Add the new document to the table
  const addNewDocument = () => {
    if (!newDocument.documentType || !newDocument.document) {
      alertToast.show(
        "warning",
        "Please fill out both the document type and upload a document.",
        true,
        2000,
      );

      return;
    }
    const updatedDocumentsRow = [
      ...documentsRow,
      { ...newDocument, id: documentsRow.length + 1 },
    ];
    setDocumentsRow(updatedDocumentsRow);
    setNewDocument({ id: 0, documentType: "", document: "" }); // Reset the input fields
    setValue("documents", JSON.stringify(updatedDocumentsRow), {
      shouldValidate: true,
    });
  };
  const [selectedIssuer, setSelectedIssuer] =
    useState<string>("Select issuers");
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchTextChange = (newSearchText: string) => {
    setSearchText(newSearchText);
    if (newSearchText !== "") {
      const filtered = users.filter((option) =>
        option.name.toLowerCase().includes(newSearchText.toLowerCase()),
      );
      setFilterUsers(filtered);
    } else {
      setFilterUsers(users);
    }
  };

  const handleOptionChange = (selectedItem: IOptionList) => {
    setSelectedIssuer(selectedItem.name);
    setRecomResponsibility(selectedItem.name);
    setRecomResponsibilityId(selectedItem.id.toString());
  };

  const [showFtaDialog, setShowFtaDialog] = useState({
    status: false,
  });
  const handleFtaDialogClose = () => {
    setShowFtaDialog((oldState) => ({ ...oldState, status: false }));
  };
  const openFtaModal = () => {
    setShowFtaDialog({ status: true });
  };

  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-hidden text-sm md:p-6">
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">
          Incident Investigation
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
          <Paper sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={teamData.historyLogImsData}
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
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Injury Type:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.injury_type}
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
                            ? "text-red-500"
                            : row.status === "Team Formed"
                            ? "text-green-500"
                            : row.status === "Investigation"
                            ? "text-orange-500"
                            : "text-gray-600"
                        } dark:text-gray-400`}
                      >
                        {row.status}
                      </span>
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
        heading="Search Incident Data"
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
                name="injury_type"
                label="Injury Type"
                control={controlFilter}
                optionList={[{ id: "All", name: "All" }, ...injuryType]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="factors"
                label="Cause Of Incident"
                control={controlFilter}
                optionList={[{ id: "All", name: "All" }, ...factors]}
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
        heading="View Incident"
        onClose={handlePDCAssignDialogClose}
        openStatus={showPDCAssignDialog.status}
        hasSubmit={false}
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
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-1">
                  <TextField
                    name="inc_date_time"
                    label="Incident Date Time"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="department"
                    label="Department"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="area"
                    label="Area"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-1">
                  <TextField
                    name="reported_by"
                    label="Reported By"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="injury_type"
                    label="Injury Type"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="factors"
                    label="Cause Of Incident"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-1">
                  <TextArea
                    name="exact_location"
                    label="Exact Location"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextArea
                    name="potential_outcome"
                    label="Potential Outcome"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextArea
                    name="action_taken"
                    label="Immediate Action Taken"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 ">
                <div className="p-1">
                  <TextArea
                    name="incident_details"
                    label="Incident Details"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>

              <div className="py-1">
                <div className="border-b-[#00000036] border-b-[1px] pb-2">
                  <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                    Incident Photos:
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imagePreviews.map((preview: any, index: any) => (
                      <div key={index} className="relative">
                        <img
                          src={`${ASSET_BASE_URL}imsimages/logims/${
                            preview || ""
                          }`}
                          alt={`preview-${index}`}
                          className="object-cover h-20 rounded-lg cursor-pointer w-30"
                          onClick={() => openImageModal(preview)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {watchView("injury_type") === "Medical Center FAC" && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Injured Person Details &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Company Type
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Employee ID
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Name
                              </th>

                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Company
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Age
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sex
                              </th>

                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                BodyPart
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                InjuryNature
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {injuryFilterRow.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.company_type}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.employee_id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.name}
                                </td>

                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.company}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.age}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.sex}
                                </td>

                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.body_part}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.injury_nature}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Suggested Team (Investigation Team) &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Employee ID
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[50%]">
                              Name
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {suggTeamFilterRow &&
                            suggTeamFilterRow.length > 0 &&
                            suggTeamFilterRow.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {index + 2}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.name}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Witness &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Employee ID
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Name
                            </th>

                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Department/Company
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          {witTeamFilterRow &&
                            witTeamFilterRow.length > 0 &&
                            witTeamFilterRow.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.employee_id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.name}
                                </td>

                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.department}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalPopup>
      <ModalPopup
        heading="Incident Investigation"
        onClose={handleInvestigationDialogClose}
        openStatus={showInvestigationDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitInvestigation(handleInvestigationSubmit)();
        }}
        size="fullscreen"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <div className="flex flex-col w-full h-full p-2 overflow-auto ">
          <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
            <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
              <div className="flex flex-col gap-2">
                <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    General Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <TextField
                      name="inc_date_time"
                      label="Incident Date Time"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="department"
                      label="Department"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="area"
                      label="Area"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <TextField
                      name="reported_by"
                      label="Reported By"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="injury_type"
                      label="Injury Type"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="factors"
                      label="Cause Of Incident"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-1">
                    <TextArea
                      name="exact_location"
                      label="Exact Location"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextArea
                      name="potential_outcome"
                      label="Potential Outcome"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                  <div className="p-1">
                    <TextArea
                      name="action_taken"
                      label="Immediate Action taken"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 ">
                  <div className="p-1">
                    <TextArea
                      name="incident_details"
                      label="Incident Details"
                      control={controlInvestigation}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 ">
                  <div className="p-1 text-gray-700">
                    <input
                      type="checkbox"
                      value="Yes"
                      onChange={(e) =>
                        setValue(
                          "repeated_incident",
                          e.target.checked ? "Yes" : "No",
                          {
                            shouldValidate: true,
                          },
                        )
                      }
                      checked={
                        watchInvestigation("repeated_incident") === "Yes"
                      }
                    />{" "}
                    Repeated Incident?
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        List Of Facts &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Facts
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border-b">1</td>

                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={facts}
                                changeHandler={(e: any) => handleInputChange(e)}
                                className="w-full"
                              />
                            </td>

                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={addFactsRow}>
                                <PlusIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>
                          {factRows &&
                            factRows.length > 0 &&
                            factRows.map((item: any) => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.facts}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  <IconButton
                                    onClick={() => removeFcatsRow(item.id)}
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </IconButton>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Risk Management &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <div className="px-4 py-2 text-gray-700">
                        <span>Was the risk identified in HIRA / JSA?</span>
                        &nbsp;
                        <input
                          type="radio"
                          name="risk_identified"
                          value="Yes"
                          onChange={(e) =>
                            setValue("risk_identified", e.target.value, {
                              shouldValidate: true,
                            })
                          }
                        />
                        &nbsp; Yes &nbsp;
                        <input
                          type="radio"
                          name="risk_identified"
                          value="No"
                          onChange={(e) =>
                            setValue("risk_identified", e.target.value, {
                              shouldValidate: true,
                            })
                          }
                        />
                        &nbsp; No
                      </div>
                    </div>
                    {watchInvestigation("risk_identified") === "Yes" && (
                      <div className="mt-1">
                        <div className="px-4 py-2 text-gray-700">
                          <span>Was the identified control?</span>
                          &nbsp;
                          <input
                            type="radio"
                            name="identified_control"
                            value="Yes"
                            onChange={(e) =>
                              setValue("identified_control", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                          />
                          &nbsp; Yes &nbsp;
                          <input
                            type="radio"
                            name="identified_control"
                            value="No"
                            onChange={(e) =>
                              setValue("identified_control", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                          />
                          &nbsp; No
                        </div>
                      </div>
                    )}
                    {watchInvestigation("identified_control") === "Yes" && (
                      <div className="mt-1">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="px-4 py-2 text-gray-700 ">
                            <span>What was the identified control ?</span>
                            &nbsp;
                            <select
                              name="control_type"
                              onChange={(e) =>
                                setValue("control_type", e.target.value, {
                                  shouldValidate: true,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="Engineering">Engineering</option>
                              <option value="Administrative">
                                Administrative
                              </option>
                              <option value="PPE">PPE</option>
                            </select>
                          </div>
                          <div>
                            <TextField
                              name="control_description"
                              control={controlInvestigation}
                              className="w-full"
                              label="Description"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {watchInvestigation("identified_control") === "Yes" && (
                      <div className="mt-1">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="px-4 py-2 text-gray-700">
                            <TextField
                              name="control_adequate_desc"
                              control={controlInvestigation}
                              className="w-full"
                              label=" Why Control was not adequate ?"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-[#2d24b7] text-md dark:text-gray-300">
                        <a
                          className="pointer"
                          onClick={() => openFtaModal()}
                          role="button"
                          aria-label="Open FTA Modal"
                        >
                          FTA
                        </a>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Physical Factors &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Description
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border-b">1</td>

                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={physicalFactorDescription}
                                changeHandler={(e: any) =>
                                  handlePhysicalFactorChange(e)
                                }
                                className="w-full"
                              />
                            </td>

                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={addPhysicalFactorsRow}>
                                <PlusIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>
                          {physicalFactorRows &&
                            physicalFactorRows.length > 0 &&
                            physicalFactorRows.map((item: any) => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.description}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  <IconButton
                                    onClick={() =>
                                      removePhysicalFactorsRow(item.id)
                                    }
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </IconButton>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Human Factors &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Description
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border-b">1</td>

                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={humanFactorDescription}
                                changeHandler={(e: any) =>
                                  handleHumanFactorChange(e)
                                }
                                className="w-full"
                              />
                            </td>

                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={addHumanFactorsRow}>
                                <PlusIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>
                          {humanFactorRows &&
                            humanFactorRows.length > 0 &&
                            humanFactorRows.map((item: any) => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.description}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  <IconButton
                                    onClick={() =>
                                      removeHumanFactorsRow(item.id)
                                    }
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </IconButton>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        System Factors &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Description
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border-b">1</td>

                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={systemFactorDescription}
                                changeHandler={(e: any) =>
                                  handleSystemFactorChange(e)
                                }
                                className="w-full"
                              />
                            </td>

                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={addSystemFactorsRow}>
                                <PlusIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>
                          {systemFactorRows &&
                            systemFactorRows.length > 0 &&
                            systemFactorRows.map((item: any) => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.description}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  <IconButton
                                    onClick={() =>
                                      removeSystemFactorsRow(item.id)
                                    }
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </IconButton>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Check-list for Determining key Facts as a apart of
                        Incident Investigation : &nbsp;
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 p-2 md:grid-cols-3">
                      <div className="p-1">
                        <TextArea
                          name="what"
                          label="WHAT"
                          control={controlAction}
                        />
                      </div>
                      <div className="p-1">
                        <TextArea
                          name="ehen"
                          label="WHEN"
                          control={controlAction}
                        />
                      </div>
                      <div className="p-1">
                        <TextArea
                          name="where"
                          label="WHERE"
                          control={controlAction}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 p-2 md:grid-cols-3">
                      <div className="p-1">
                        <TextArea
                          name="who"
                          label="WHO"
                          control={controlAction}
                        />
                      </div>
                      <div className="p-1">
                        <TextArea
                          name="how"
                          label="HOW"
                          control={controlAction}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Recommendations &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Recommendation
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Responsibility
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Factor
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Control Type
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Target Date
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border-b">1</td>

                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={recomDescription}
                                changeHandler={(e: any) =>
                                  handleRecomDescriptionChange(e)
                                }
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              <SelectSearchable
                                selectedValue={selectedIssuer}
                                optionList={[...filterUsers]}
                                searchText={searchText}
                                searchTextChangeHandler={handleSearchTextChange}
                                onChange={handleOptionChange}
                                className="mt-[9px]"
                              />
                              {/* <InputText
                                type="text"
                                value={recomResponsibility}
                                changeHandler={(e: any) =>
                                  handleRecomResponsibilityChange(e)
                                }
                                className="w-full"
                              /> */}
                            </td>
                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={recomFactor}
                                changeHandler={(e: any) =>
                                  handleRecomFactorChange(e)
                                }
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              <select
                                value={recomControltype}
                                onChange={(e) =>
                                  handleRecomControlTypeChange(e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-700"
                              >
                                <option value="">Select</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Administrative">
                                  Administrative
                                </option>
                                <option value="PPE">PPE</option>
                                <option value="Preventive">Preventive</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="date"
                                value={recomTargetDate}
                                changeHandler={(e: any) =>
                                  handleRecomTargetDateChange(e)
                                }
                                className="w-full"
                              />
                            </td>

                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={addRecommendationRow}>
                                <PlusIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>
                          {recomendationRows &&
                            recomendationRows.length > 0 &&
                            recomendationRows.map((item: any) => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.recommendation}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.responsibility}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.factor}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.control_type}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.target_date}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  <IconButton
                                    onClick={() =>
                                      removeRecommendationRow(item.id)
                                    }
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </IconButton>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Upload Documents &nbsp;
                      </h3>
                    </div>
                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Document type
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Documents
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* First row for adding a new document */}
                          <tr>
                            <td className="px-4 py-2 border-b">--</td>
                            <td className="px-4 py-2 text-gray-700 border-b">
                              <input
                                type="text"
                                value={newDocument.documentType}
                                onChange={(e) =>
                                  setNewDocument({
                                    ...newDocument,
                                    documentType: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                placeholder="Enter document type"
                              />
                            </td>
                            <td className="px-4 py-2 text-gray-700 border-b">
                              <input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]; // Get the single file
                                  if (!file) return; // Exit if no file is selected

                                  const now = new Date();
                                  const date = now
                                    .toISOString()
                                    .slice(0, 10)
                                    .replace(/-/g, "");
                                  const time = now
                                    .toTimeString()
                                    .slice(0, 8)
                                    .replace(/:/g, "");
                                  const filename = `${date}_${time}_${file.name}`; // Construct the filename

                                  const formData = new FormData();
                                  formData.append("filename", filename);
                                  formData.append("originalname", file.name);
                                  formData.append("file", file); // Add the file itself

                                  fetch(
                                    `${API_BASE_URL}uploadInvestigationImage`,
                                    {
                                      method: "POST",
                                      body: formData,
                                    },
                                  )
                                    .then(async (response) => {
                                      if (!response.ok) {
                                        throw new Error(
                                          "Failed to upload the image.",
                                        );
                                      }
                                      setImagePreviews((prev: any) => [
                                        ...prev,
                                        filename,
                                      ]); // Add the uploaded file to previews
                                      setNewDocument({
                                        ...newDocument,
                                        document: filename, // Update the document in state
                                      });
                                    })
                                    .catch(() => {
                                      alertToast.show(
                                        "error",
                                        "Error uploading image",
                                        true,
                                      );
                                    });
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={addNewDocument}>
                                <PlusIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>

                          {/* Render added rows */}
                          {documentsRow.map((row, index) => (
                            <tr key={row.id}>
                              <td className="px-4 py-2 text-gray-700 border-b">
                                {index + 1}
                              </td>
                              <td className="px-4 py-2 text-gray-700 border-b">
                                {row.documentType}
                              </td>
                              <td className="px-4 py-2 text-gray-700 border-b">
                                {row.document || "N/A"}
                              </td>
                              <td className="px-4 py-2 text-gray-700 border-b">
                                <IconButton
                                  onClick={() => {
                                    const updatedDocumentsRow =
                                      documentsRow.filter(
                                        (r) => r.id !== row.id,
                                      );

                                    // Update the documentsRow state
                                    setDocumentsRow(updatedDocumentsRow);

                                    // Update the form value with the updated row list
                                    setValue(
                                      "documents",
                                      JSON.stringify(updatedDocumentsRow),
                                      {
                                        shouldValidate: true,
                                      },
                                    );
                                  }}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </IconButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalPopup>
      <ModalPopup
        heading="View Image"
        onClose={handleImageDialogClose}
        openStatus={showImageDialog.status}
        hasSubmit={false}
        size="fullscreen"
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <img
            src={`${ASSET_BASE_URL}imsimages/logims/${modalImage || ""}`}
            alt="previewimage"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </ModalPopup>
      <ModalPopup
        heading="FTA"
        onClose={handleFtaDialogClose}
        openStatus={showFtaDialog.status}
        hasSubmit={false}
        size="fullscreen"
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          content
        </div>
      </ModalPopup>
    </div>
  );
}

export default IncidentInvestigation;
