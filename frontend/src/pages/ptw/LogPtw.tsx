import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, IconButton } from "@/features/ui/buttons";
import { TextArea, TextField, DropdownList } from "@/features/ui/form";
import { useAppSelector } from "@/store/hooks";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";

import { IOptionList } from "@/features/ui/types";
import { usePTWMasterDataQuery } from "@/features/ptw/hooks";
import IConfigsList from "@/features/ptw/types/ptw/IConfigsList";
import ILogPTWForm from "@/features/ptw/types/ptw/ILogPTWForm";
import IContractorList from "@/features/ptw/types/ptw/IContractorList";
import { InputText } from "@/features/ui/elements";
import { addNewPTWData } from "@/features/ptw/services/ptw.services";
import IAreasList from "@/features/sis/types/sis/IAreasList";

const today = new Date();

// Get the start of the current week (Monday)
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday (getDay() returns 0 for Sunday)
startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight

// Get the end of the current week (Sunday)
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to get to Sunday
endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day

// Format the dates to "YYYY-MM-DDThh:mm" format to match the "datetime-local" input type
const minDate = startOfWeek.toISOString().slice(0, 16); // "YYYY-MM-DDThh:mm"
const maxDate = endOfWeek.toISOString().slice(0, 16); // "YYYY-MM-DDThh:mm"

const initialFormValues: ILogPTWForm = {
  department: "",
  area: "",
  work_location: "",
  datetime_from: "",
  datetime_to: "",
  nearest_firealarm: "",
  job_description: "",
  moc_required: "",
  moc_title: "",
  moc_no: "",
  why_moc_remarks: "",
  equipment: "",
  supervisor_name: "",
  contractor: "",
  esic_no: "",
  associated_permit: "",
  hazard_identification: "",
  other_hazards: "",
  risk_assessment: "",
  ppe_required: "",
  ei_panel_name: "",
  ei_loto_no: "",
  ei_checked_by: "",
  ei_date_time: "",
  si_panel_name: "",
  si_loto_no: "",
  si_checked_by: "",
  si_date_time: "",
  general_work_dtls: "",
  annexture_v: "",
  work_height_checklist: "",
  work_height_supervision: "",
  confined_space_checklist: "",
  confined_space_supervision: "",
  confined_space_atmospheric: "",
  confined_space_oxygen_level: "",
  confined_space_lel: "",
  confined_space_toxic: "",
  confined_space_detector: "",
  lifting_work_checklist: "",
  esms_checklist: "",
  hot_work_checklist: "",
  equipment_checklist: "",
  pending_on: "",
  status: "",
};

const formSchema = Yup.object().shape({
  department: Yup.string().required("Department is required"),
  area: Yup.string().required("Area is required"),
  work_location: Yup.string().required("Work location is required"),
  datetime_from: Yup.string().required("Date time from is required"),
  datetime_to: Yup.string().required("Date time to is required"),
  nearest_firealarm: Yup.string().required(
    "Nearest Fire Alarm Point is required",
  ),
  job_description: Yup.string().required("Job Description is required"),
  supervisor_name: Yup.string().required("name of Supervisor is required"),
  contractor: Yup.string().required("Contractor is required"),
  esic_no: Yup.string().required("ESIC Reg No is required"),
});

interface IAnxPerson {
  name: string;
  contractor: string;
  trade: string;
  ticketNo: string;
}
function LogPtw() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [configs, setConfigs] = useState<IConfigsList[]>([]);
  const [areas, setAreas] = useState<IAreasList[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<IOptionList[]>([]);

  const [contractors, setContractors] = useState<IOptionList[]>([]);

  const [isHazardSectionOpen, setIsHazardSectionOpen] = useState(false);
  const [hazardsChecklist, setHazardsChecklist] = useState<IOptionList[]>([]);
  const [isRiskSectionOpen, setIsRiskSectionOpen] = useState(false);
  const [riskChecklist, setRiskChecklist] = useState<IOptionList[]>([]);
  const [isPPESectionOpen, setIsPPESectionOpen] = useState(false);
  const [isEquipmentSectionOpen, setIsEquipmentSectionOpen] = useState(false);
  const [ppeChecklist, setPPEChecklist] = useState<IOptionList[]>([]);
  const [equipmentChecklist, setEquipmentChecklist] = useState<IOptionList[]>(
    [],
  );
  const [isIsolationSectionOpen, setIsIsolationSectionOpen] = useState(false);

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

  const [attPerName, setAttPername] = useState<string>("");
  const [attContractor, setAttContractor] = useState<string>("");
  const [attTrade, setAttTrade] = useState<string>("");
  const [attTicketNo, setAttTicketNo] = useState<string>("");
  const [departmentHeadName, setDepartmentHeadName] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");

  const [anxRows, setAnxRows] = useState<IAnxPerson[]>([]);
  const {
    handleSubmit,
    reset,
    control,
    formState,

    setValue,
    watch: watchValues,
  } = useForm<ILogPTWForm>({
    defaultValues: initialFormValues,
    resolver: yupResolver(formSchema),
  });
  const { isSubmitting } = formState;
  // Handle adding a new row
  const addRow = () => {
    if (attPerName === "") {
      alertToast.show("warning", "Name of person required", true);
    } else if (attContractor === "") {
      alertToast.show("warning", "Contractor required", true);
    } else if (attTrade === "") {
      alertToast.show("warning", "Trade is required", true);
    } else if (attTicketNo === "") {
      alertToast.show("warning", "Ticket No is required", true);
    } else {
      let oldRows = [];
      if (watchValues("annexture_v") !== "") {
        oldRows = JSON.parse(watchValues("annexture_v"));
      }

      const newRow: IAnxPerson = {
        name: attPerName,
        contractor: attContractor,
        trade: attTrade,
        ticketNo: attTicketNo,
      };
      oldRows.push(newRow);
      setAnxRows(oldRows);
      setValue("annexture_v", JSON.stringify(oldRows), {
        shouldValidate: true,
      });
      setAttPername("");
      setAttContractor("");
      setAttTrade("");
      setAttTicketNo("");
    }
  };

  // Handle removing a row
  const removeRow = (index: number) => {
    const currAnxRows = JSON.parse(watchValues("annexture_v"));
    const currRowIndex = currAnxRows.findIndex((item: any) => item === index);
    currAnxRows.splice(currRowIndex, 1);
    setAnxRows(currAnxRows);
    setValue("annexture_v", JSON.stringify(currAnxRows), {
      shouldValidate: true,
    });
  };

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
        if (ownDepartment.length > 0) {
          setDepartmentHeadName(ownDepartment[0].head_name);
          setValue("department", ownDepartment[0].name, {
            shouldValidate: true,
          });
          setDepartmentId(ownDepartment[0].id.toString());
        }

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

        const filterEquipment = historyPTWMasterData[0].CONFIG.filter(
          (item: any) => item.type === "Tools and Equipment",
        ).map((check: any) => ({
          id: check.id,
          name: check.checklist,
        }));
        setEquipmentChecklist(filterEquipment);

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
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "ptwMasterDataQuery",
    });
  }, []);

  const handleReset = () => {
    reset({
      ...initialFormValues,
    });
  };

  useEffect(() => {
    if (+departmentId > 0) {
      const fArea = areas.filter((item) => +item.parent_id === +departmentId);
      setFilteredAreas(fArea);
    }
  }, [departmentId]);

  const handleHazardsChecklistChange = (event: any, itemId: any) => {
    let hazardChecklist = [];
    if (watchValues("hazard_identification") !== "") {
      hazardChecklist = JSON.parse(watchValues("hazard_identification"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      hazardChecklist.push(itemIdStr);
    } else {
      const currRowIndex = hazardChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      hazardChecklist.splice(currRowIndex, 1);
    }
    setValue("hazard_identification", JSON.stringify(hazardChecklist), {
      shouldValidate: true,
    });
  };

  const handleRisksChecklistChange = (event: any, itemId: any) => {
    let riskChecklist = [];
    if (watchValues("risk_assessment") !== "") {
      riskChecklist = JSON.parse(watchValues("risk_assessment"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      riskChecklist.push(itemIdStr);
    } else {
      const currRowIndex = riskChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      riskChecklist.splice(currRowIndex, 1);
    }
    setValue("risk_assessment", JSON.stringify(riskChecklist), {
      shouldValidate: true,
    });
  };

  const handlePPEChecklistChange = (event: any, itemId: any) => {
    let ppeCheckpoints = [];
    if (watchValues("ppe_required") !== "") {
      ppeCheckpoints = JSON.parse(watchValues("ppe_required"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      ppeCheckpoints.push(itemIdStr);
    } else {
      const currRowIndex = ppeCheckpoints.findIndex(
        (item: any) => item === itemIdStr,
      );
      ppeCheckpoints.splice(currRowIndex, 1);
    }
    setValue("ppe_required", JSON.stringify(ppeCheckpoints), {
      shouldValidate: true,
    });
  };

  const handleEquipmentChecklistChange = (event: any, itemId: any) => {
    let equipmentCheckpoints = [];
    if (watchValues("equipment_checklist") !== "") {
      equipmentCheckpoints = JSON.parse(watchValues("equipment_checklist"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      equipmentCheckpoints.push(itemIdStr);
    } else {
      const currRowIndex = equipmentCheckpoints.findIndex(
        (item: any) => item === itemIdStr,
      );
      equipmentCheckpoints.splice(currRowIndex, 1);
    }
    setValue("equipment_checklist", JSON.stringify(equipmentCheckpoints), {
      shouldValidate: true,
    });
  };

  const handleGeneralWorkChecklistChange = (event: any, itemId: any) => {
    let generalChecklist = [];
    if (watchValues("general_work_dtls") !== "") {
      generalChecklist = JSON.parse(watchValues("general_work_dtls"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      generalChecklist.push(itemIdStr);
    } else {
      const currRowIndex = generalChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      generalChecklist.splice(currRowIndex, 1);
    }
    setValue("general_work_dtls", JSON.stringify(generalChecklist), {
      shouldValidate: true,
    });
  };

  const handleWHChecklistChange = (event: any, itemId: any) => {
    let whChecklist = [];
    if (watchValues("work_height_checklist") !== "") {
      whChecklist = JSON.parse(watchValues("work_height_checklist"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      whChecklist.push(itemIdStr);
    } else {
      const currRowIndex = whChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      whChecklist.splice(currRowIndex, 1);
    }
    setValue("work_height_checklist", JSON.stringify(whChecklist), {
      shouldValidate: true,
    });
  };

  const handleConfinedSpaceChecklistChange = (event: any, itemId: any) => {
    let confinedChecklist = [];
    if (watchValues("confined_space_checklist") !== "") {
      confinedChecklist = JSON.parse(watchValues("confined_space_checklist"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      confinedChecklist.push(itemIdStr);
    } else {
      const currRowIndex = confinedChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      confinedChecklist.splice(currRowIndex, 1);
    }
    setValue("confined_space_checklist", JSON.stringify(confinedChecklist), {
      shouldValidate: true,
    });
  };

  const handleLiftingChecklistChange = (event: any, itemId: any) => {
    let liftingChecklist = [];
    if (watchValues("lifting_work_checklist") !== "") {
      liftingChecklist = JSON.parse(watchValues("lifting_work_checklist"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      liftingChecklist.push(itemIdStr);
    } else {
      const currRowIndex = liftingChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      liftingChecklist.splice(currRowIndex, 1);
    }
    setValue("lifting_work_checklist", JSON.stringify(liftingChecklist), {
      shouldValidate: true,
    });
  };

  const handleEsmsChecklistChange = (event: any, itemId: any) => {
    let esmsChecklist = [];
    if (watchValues("esms_checklist") !== "") {
      esmsChecklist = JSON.parse(watchValues("esms_checklist"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      esmsChecklist.push(itemIdStr);
    } else {
      const currRowIndex = esmsChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      esmsChecklist.splice(currRowIndex, 1);
    }
    setValue("esms_checklist", JSON.stringify(esmsChecklist), {
      shouldValidate: true,
    });
  };

  const handleHotWorkChecklistChange = (event: any, itemId: any) => {
    let hotwrkChecklist = [];
    if (watchValues("hot_work_checklist") !== "") {
      hotwrkChecklist = JSON.parse(watchValues("hot_work_checklist"));
    }
    const itemIdStr = String(itemId);
    if (event.target.checked) {
      hotwrkChecklist.push(itemIdStr);
    } else {
      const currRowIndex = hotwrkChecklist.findIndex(
        (item: any) => item === itemIdStr,
      );
      hotwrkChecklist.splice(currRowIndex, 1);
    }
    setValue("hot_work_checklist", JSON.stringify(hotwrkChecklist), {
      shouldValidate: true,
    });
  };

  const [associatedIds, setAssociatedIds] = useState<string[]>([]);

  const handleAssCheckboxChange = (id: any) => {
    let assIds = [];
    if (watchValues("associated_permit") !== "") {
      assIds = JSON.parse(watchValues("associated_permit"));
    }

    if (id === "Work at Height") {
      setIsAssWHSectionOpen((prev) => !prev);
      if (isAssWHSectionOpen) {
        const currRowIndex = assIds.findIndex((item: any) => item === id);
        assIds.splice(currRowIndex, 1);
        setAssociatedIds(assIds);
      } else {
        setAssociatedIds((prevIds) => [...prevIds, id]);
        assIds.push(id);
      }
    }
    if (id === "Confined Space") {
      setIsAssConfinedSectionOpen((prev) => !prev);
      if (isAssConfinedSectionOpen) {
        const currRowIndex = assIds.findIndex((item: any) => item === id);
        assIds.splice(currRowIndex, 1);
        setAssociatedIds(assIds);
      } else {
        setAssociatedIds((prevIds) => [...prevIds, id]);
        assIds.push(id);
      }
    }
    if (id === "Lifting Work") {
      setIsAssLiftingSectionOpen((prev) => !prev);
      if (isAssLiftingSectionOpen) {
        const currRowIndex = assIds.findIndex((item: any) => item === id);
        assIds.splice(currRowIndex, 1);
        setAssociatedIds(assIds);
      } else {
        setAssociatedIds((prevIds) => [...prevIds, id]);
        assIds.push(id);
      }
    }
    if (id === "ESMS Work Permit") {
      setIsAssEsmsSectionOpen((prev) => !prev);
      if (isAssEsmsSectionOpen) {
        const currRowIndex = assIds.findIndex((item: any) => item === id);
        assIds.splice(currRowIndex, 1);
        setAssociatedIds(assIds);
      } else {
        setAssociatedIds((prevIds) => [...prevIds, id]);
        assIds.push(id);
      }
    }
    if (id === "Hot Work") {
      setIsAssHotWrkSectionOpen((prev) => !prev);
      if (isAssHotWrkSectionOpen) {
        const currRowIndex = assIds.findIndex((item: any) => item === id);
        assIds.splice(currRowIndex, 1);
        setAssociatedIds(assIds);
      } else {
        setAssociatedIds((prevIds) => [...prevIds, id]);
        assIds.push(id);
      }
    }
    setValue("associated_permit", JSON.stringify(assIds), {
      shouldValidate: true,
    });
  };

  const handleFormSubmit: SubmitHandler<ILogPTWForm> = (values: any) => {
    if (watchValues("moc_required") === "") {
      alertToast.show(
        "warning",
        "Please select moc is required or not",
        true,
        2000,
      );
    } else if (
      watchValues("moc_required") === "Yes" &&
      watchValues("moc_title") === ""
    ) {
      alertToast.show("warning", "MOC title is required", true, 2000);
    } else if (
      watchValues("moc_required") === "Yes" &&
      watchValues("moc_no") === ""
    ) {
      alertToast.show("warning", "MOC no is required", true, 2000);
    } else if (
      watchValues("moc_required") === "No" &&
      watchValues("why_moc_remarks") === ""
    ) {
      alertToast.show("warning", "MOC remarks is required", true, 2000);
    } else {
      loader.show();
      addNewPTWData(values)
        .then(() => {
          alertToast.show("success", "Data added successfully", true, 2000);
          handleReset();
          // Invalidate queries
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "ptwMasterDataQuery",
          });
          navigate("/ptw/view-ptw", { replace: true });
        })
        .catch((err: any) => {
          if (err.response && err.response.status) {
            alertToast.show("warning", err.response.data.message, true);
          }
        })
        .finally(() => {
          loader.hide();
        });
    }
  };

  return (
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
                  control={control}
                  disabled
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="area"
                  label="Area"
                  control={control}
                  optionList={[
                    { id: "", name: "Select Area" },
                    ...filteredAreas,
                  ]}
                />
              </div>
              <div className="p-1">
                <TextField
                  name="work_location"
                  label="Work Location"
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-1">
                <TextField
                  type="datetime-local"
                  name="datetime_from"
                  label="Date Time From"
                  minimum={minDate}
                  maximum={maxDate}
                  control={control}
                />
              </div>
              <div className="p-1">
                <TextField
                  type="datetime-local"
                  name="datetime_to"
                  label="Date Time To"
                  minimum={minDate}
                  maximum={maxDate}
                  control={control}
                />
              </div>
              <div className="p-1">
                <TextField
                  type="text"
                  name="nearest_firealarm"
                  label="Nearest Manual Call Points"
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1">
              <div className="p-1">
                <TextArea
                  name="job_description"
                  label="Job Description"
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1">
              <div className="p-1">
                Is MOC Required ?{" "}
                <input
                  type="radio"
                  name="moc_required"
                  value="Yes"
                  onChange={(e) =>
                    setValue("moc_required", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
                &nbsp;&nbsp;Yes &nbsp;&nbsp;
                <input
                  type="radio"
                  name="moc_required"
                  value="No"
                  onChange={(e) =>
                    setValue("moc_required", e.target.value, {
                      shouldValidate: true,
                    })
                  }
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
                    control={control}
                  />
                </div>
                <div className="p-1">
                  <TextField name="moc_no" label="Moc No" control={control} />
                </div>
              </div>
            )}
            {watchValues("moc_required") === "No" && (
              <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="p-1">
                  <TextArea
                    name="why_moc_remarks"
                    label="Why MOC Not Required "
                    control={control}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-1">
                <TextField
                  name="supervisor_name"
                  label="Name of Supervisor"
                  control={control}
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="contractor"
                  label="Contractor"
                  control={control}
                  optionList={[
                    { id: "", name: "Select Contractor" },
                    ...contractors,
                  ]}
                />
              </div>
              <div className="p-1">
                <TextField
                  name="esic_no"
                  label="ESIC Reg No"
                  control={control}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 p-4 md:grid-cols-6">
              Associated Permit(s) &nbsp;&nbsp;
              <div className="p-1">
                Work at Height &nbsp;
                {/* <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => setIsAssWHSectionOpen((prev) => !prev)}
                  checked={isAssWHSectionOpen}
                /> */}
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => handleAssCheckboxChange("Work at Height")}
                  checked={isAssWHSectionOpen}
                />
              </div>
              <div className="p-1">
                Confined Space &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => handleAssCheckboxChange("Confined Space")}
                  checked={isAssConfinedSectionOpen}
                />
              </div>
              <div className="p-1">
                Lifiting Work &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => handleAssCheckboxChange("Lifting Work")}
                  checked={isAssLiftingSectionOpen}
                />
              </div>
              <div className="p-1">
                ESMS Work Permit &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => handleAssCheckboxChange("ESMS Work Permit")}
                  checked={isAssEsmsSectionOpen}
                />
              </div>
              <div className="p-1">
                Hot Work &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => handleAssCheckboxChange("Hot Work")}
                  checked={isAssHotWrkSectionOpen}
                />
              </div>
            </div>
          </div>
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
                  onChange={() => setIsHazardSectionOpen(true)}
                  checked={isHazardSectionOpen}
                />
                &nbsp;&nbsp;Yes&nbsp;&nbsp;
                <input
                  type="radio"
                  name="hazard_identifications"
                  value="No"
                  onChange={() => setIsHazardSectionOpen(false)}
                  checked={!isHazardSectionOpen}
                />
                &nbsp;&nbsp;No
              </div>

              {/* Conditionally render collapsible section */}
              {isHazardSectionOpen && (
                <div className="p-2 mt-1 ">
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
                                    onChange={(event: any) =>
                                      handleHazardsChecklistChange(
                                        event,
                                        item2.id,
                                      )
                                    }
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
                      control={control}
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
                  onChange={() => setIsRiskSectionOpen(true)}
                  checked={isRiskSectionOpen}
                />
                &nbsp;&nbsp;Yes&nbsp;&nbsp;
                <input
                  type="radio"
                  name="risk_assessment"
                  value="No"
                  onChange={() => setIsRiskSectionOpen(false)}
                  checked={!isRiskSectionOpen}
                />
                &nbsp;&nbsp;No
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`risk_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handleRisksChecklistChange(
                                        event,
                                        item2.id,
                                      )
                                    }
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
                  onChange={() => setIsPPESectionOpen(true)}
                  checked={isPPESectionOpen}
                />
                &nbsp;&nbsp;Yes&nbsp;&nbsp;
                <input
                  type="radio"
                  name="ppe_required"
                  value="No"
                  onChange={() => setIsPPESectionOpen(false)}
                  checked={!isPPESectionOpen}
                />
                &nbsp;&nbsp;No
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`risk_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handlePPEChecklistChange(event, item2.id)
                                    }
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
                  Tools and Equipment required for the job identified,available
                  and inspected OK &nbsp;
                </h3>
                <input
                  type="radio"
                  name="equipment_required"
                  value="Yes"
                  onChange={() => setIsEquipmentSectionOpen(true)}
                  checked={isEquipmentSectionOpen}
                />
                &nbsp;&nbsp;Yes&nbsp;&nbsp;
                <input
                  type="radio"
                  name="equipment_required"
                  value="No"
                  onChange={() => setIsEquipmentSectionOpen(false)}
                  checked={!isEquipmentSectionOpen}
                />
                &nbsp;&nbsp;No
              </div>

              {/* Conditionally render collapsible section */}
              {isEquipmentSectionOpen && (
                <div className="p-2 mt-1 ">
                  {equipmentChecklist && equipmentChecklist.length > 0 && (
                    <div>
                      {equipmentChecklist
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`equipment_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handleEquipmentChecklistChange(
                                        event,
                                        item2.id,
                                      )
                                    }
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
                    <div className="p-1">
                      <TextArea
                        name="equipment"
                        label="	Equipment(s) to be worked on "
                        control={control}
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
                <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                  Isolation Details &nbsp;
                </h3>
                <input
                  type="radio"
                  name="isolation_required"
                  value="Yes"
                  onChange={() => setIsIsolationSectionOpen(true)}
                  checked={isIsolationSectionOpen}
                />
                &nbsp;&nbsp;Yes&nbsp;&nbsp;
                <input
                  type="radio"
                  name="isolation_required"
                  value="No"
                  onChange={() => setIsIsolationSectionOpen(false)}
                  checked={!isIsolationSectionOpen}
                />
                &nbsp;&nbsp;No
              </div>

              {isIsolationSectionOpen && (
                // <div className="grid grid-cols-1 p-2 mt-1 md:grid-cols-2 ">
                //   {/* Electrical Isolation Section */}
                //   <div className="mb-4">
                //     <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                //       Electrical Isolation
                //     </h3>
                //     {/* Content for Electrical Isolation */}
                //     <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                //       <div className="p-1">
                //         <TextField
                //           name="drive_panel_name"
                //           label="Drive/Panel Name"
                //           control={control}
                //         />
                //       </div>
                //       <div className="p-1">
                //         <TextField
                //           name="loto_no"
                //           label="LOTO No"
                //           control={control}
                //         />
                //       </div>
                //     </div>
                //     <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                //       <div className="p-1">
                //         <TextField
                //           name="checked_by"
                //           label="Checked By"
                //           control={control}
                //         />
                //       </div>
                //       <div className="p-1">
                //         <TextField
                //           name="date_time"
                //           label="Date & Time"
                //           control={control}
                //         />
                //       </div>
                //     </div>
                //   </div>

                //   {/* Service Isolation Section */}
                //   <div>
                //     <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                //       Service Isolation
                //     </h3>
                //     {/* Content for Service Isolation */}
                //     <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                //       <div className="p-1">
                //         <TextField
                //           name="drive_panel_name_service"
                //           label="Steam/Air/Water/Gas"
                //           control={control}
                //         />
                //       </div>
                //       <div className="p-1">
                //         <TextField
                //           name="loto_no_service"
                //           label="LOTO No"
                //           control={control}
                //         />
                //       </div>
                //     </div>
                //     <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                //       <div className="p-1">
                //         <TextField
                //           name="checked_by_service"
                //           label="Checked By"
                //           control={control}
                //         />
                //       </div>
                //       <div className="p-1">
                //         <TextField
                //           name="date_time_service"
                //           label="Date & Time"
                //           control={control}
                //         />
                //       </div>
                //     </div>
                //   </div>
                // </div>
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
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="ei_loto_no"
                          label="LOTO No"
                          control={control}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                      <div className="p-1">
                        <TextField
                          name="ei_checked_by"
                          label="Checked By"
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="ei_date_time"
                          label="Date & Time"
                          control={control}
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
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="si_loto_no"
                          label="LOTO No"
                          control={control}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                      <div className="p-1">
                        <TextField
                          name="si_checked_by"
                          label="Checked By"
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="si_date_time"
                          label="Date & Time"
                          control={control}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="grid border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
            <div className="p-1">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                  Trail & Energisation Details &nbsp;
                </h3>
                <input
                  type="radio"
                  name="trail_required"
                  value="Yes"
                  onChange={() => setIsTrailSectionOpen(true)}
                  checked={isTrailSectionOpen}
                />
                &nbsp;&nbsp;Yes&nbsp;&nbsp;
                <input
                  type="radio"
                  name="trail_required"
                  value="No"
                  onChange={() => setIsTrailSectionOpen(false)}
                  checked={!isTrailSectionOpen}
                />
                &nbsp;&nbsp;No
              </div>

              {isTrailSectionOpen && (
                <div className="grid grid-cols-1 p-2 mt-4 border-2 border-gray-200 rounded-lg md:grid-cols-2 dark:border-gray-500">
                  <div className="p-1">
                    <TextField
                      name="energisation_approved_by"
                      label="Energisation Approved By"
                      control={control}
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      type="datetime-local"
                      name="energisation_date_time"
                      label="Date & Time"
                      control={control}
                    />
                  </div>
                </div>
              )}
            </div>
          </div> */}
          <div className="grid border-[1px] border-gray-200 rounded-lg dark:border-gray-500 dark:bg-gray-800">
            <div className="">
              <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                  General Work/Cold Work &nbsp;
                </h3>
                {/* <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => setIsAssGenSectionOpen((prev) => !prev)}
                  checked={isAssGenSectionOpen}
                /> */}
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
                            <div className="p-1" key={index}>
                              <label>
                                <input
                                  type="checkbox"
                                  name={`general_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                  value="Yes"
                                  onChange={(event: any) =>
                                    handleGeneralWorkChecklistChange(
                                      event,
                                      item2.id,
                                    )
                                  }
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
                    control={control}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
            <div className="">
              <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                  List of persons attached to this permit (Other than custodian,
                  issuer and initiator) &nbsp;
                </h3>
              </div>

              <div className="mt-1">
                <table className="min-w-full border-collapse table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left border-b">Sl. No.</th>
                      <th className="px-4 py-2 text-left border-b">
                        Name of Person
                      </th>
                      <th className="px-4 py-2 text-left border-b">
                        Own / Contractor
                      </th>
                      <th className="px-4 py-2 text-left border-b">Trade</th>
                      <th className="px-4 py-2 text-left border-b">ESIC No.</th>
                      <th className="px-4 py-2 text-left border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b">1</td>
                      <td className="px-4 py-2 border-b">
                        <InputText
                          value={attPerName}
                          changeHandler={(e: any) => setAttPername(e)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <InputText
                          value={attContractor}
                          changeHandler={(e: any) => setAttContractor(e)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <InputText
                          value={attTrade}
                          changeHandler={(e: any) => setAttTrade(e)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <InputText
                          value={attTicketNo}
                          changeHandler={(e: any) => setAttTicketNo(e)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <IconButton onClick={addRow}>
                          <PlusIcon className="w-4 h-4" />
                        </IconButton>
                      </td>
                    </tr>

                    {/* Render additional rows from anxRows */}
                    {anxRows &&
                      anxRows.length > 0 &&
                      anxRows.map((item: IAnxPerson, index: number) => {
                        return (
                          <tr key={index}>
                            <td className="px-4 py-2 border-b">{index + 2}</td>{" "}
                            {/* Display row number starting from 2 */}
                            <td className="px-4 py-2 border-b">{item.name}</td>
                            <td className="px-4 py-2 border-b">
                              {item.contractor}
                            </td>
                            <td className="px-4 py-2 border-b">{item.trade}</td>
                            <td className="px-4 py-2 border-b">
                              {item.ticketNo}
                            </td>
                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={() => removeRow(index)}>
                                <TrashIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* {isAssGenSectionOpen && (
            <div className="grid border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
              <div className="p-1">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                    General Work/Cold Work
                  </h3>
                </div>
                <div className="p-2 mt-4 border-2 border-gray-200 rounded-lg dark:border-gray-500">
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
                            className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-4"
                            key={rowIndex}
                          >
                            {row.map((item2: any, index: any) => (
                              <div className="p-1" key={index}>
                                <label>
                                  {item2.name}&nbsp;
                                  <input
                                    type="checkbox"
                                    name={`risk_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                  />
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
                      control={control}
                    />
                  </div>
                </div>
              </div>
            </div>
          )} */}
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`ass_wh_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handleWHChecklistChange(event, item2.id)
                                    }
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
                      name="work_height_supervision"
                      label="Supervision provided by(Atomberg's Emp)"
                      control={control}
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`ass_confined_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handleConfinedSpaceChecklistChange(
                                        event,
                                        item2.id,
                                      )
                                    }
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
                    control={control}
                  />
                  <TextField
                    name="confined_space_atmospheric"
                    label="Atmospheric Checks done by"
                    control={control}
                  />
                  <TextField
                    name="confined_space_oxygen_level"
                    label="Oxygen level (19% - 21%)"
                    control={control}
                  />
                  <TextField
                    name="confined_space_lel"
                    label="Explosive LEL & UEL"
                    control={control}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-4">
                  <TextField
                    name="confined_space_toxic"
                    label="Toxic"
                    control={control}
                  />
                  <TextField
                    name="confined_space_detector"
                    label="Detector Details"
                    control={control}
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`ass_lifting_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handleLiftingChecklistChange(
                                        event,
                                        item2.id,
                                      )
                                    }
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`ass_esms_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handleEsmsChecklistChange(event, item2.id)
                                    }
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
                              <div className="p-1" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={`ass_lifting_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                    value="Yes"
                                    onChange={(event: any) =>
                                      handleHotWorkChecklistChange(
                                        event,
                                        item2.id,
                                      )
                                    }
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
          <div className="grid grid-cols-1 p-4 border border-gray-200 rounded-lg shadow-lg dark:border-gray-500 dark:bg-gray-800">
            {/* Title/Certification Text */}
            <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              I certify that the above check points have been verified and found
              satisfactory.
            </div>

            {/* Name of Initiator */}
            <div className="flex items-center mb-3 space-x-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Name of Initiator:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {authState.NAME}
              </span>
            </div>

            {/* Custodian */}
            <div className="flex items-center mb-4 space-x-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Custodian:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {departmentHeadName}
              </span>
            </div>

            {/* Submit Button */}
            <div className="mt-2">
              <Button
                disabled={isSubmitting}
                onClick={() => {
                  handleSubmit(handleFormSubmit)();
                }}
                btnType="primary"
                className="w-auto px-4 py-2 font-semibold text-white transition-all duration-200 ease-in-out rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogPtw;
