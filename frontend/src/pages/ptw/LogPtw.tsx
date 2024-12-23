import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { Button, IconButton } from "@/features/ui/buttons";
import { TextArea, TextField, DropdownList } from "@/features/ui/form";
import { useAppSelector } from "@/store/hooks";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";

import ILogSisForm from "@/features/sis/types/sis/ILogSisForm";
import { addNewSIOData } from "@/features/sis/services/sis.services";
import { IOptionList } from "@/features/ui/types";
import useSIOMasterDataQuery from "@/features/sis/hooks/useSIOMasterDataQuery";
import { API_BASE_URL, ASSET_BASE_URL } from "@/features/common/constants";
import { usePTWMasterDataQuery } from "@/features/ptw/hooks";
import IConfigsList from "@/features/ptw/types/ptw/IConfigsList";
import ILogPTWForm from "@/features/ptw/types/ptw/ILogPTWForm";
import IContractorList from "@/features/ptw/types/ptw/IContractorList";
import {
  ArrowDownTrayIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { InputText } from "@/features/ui/elements";
import { min } from "lodash";

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
  pending_on: "",
  status: "",
};

const formSchema = Yup.object().shape({
  OBS_DATE_TIME: Yup.string().required("Observation Date time is required"),
  DEPARTMENT: Yup.string().required("Department is required"),
  AREA: Yup.string().required("Area is required"),
  CATEGORY: Yup.string().required("Category is required"),
  SEVERITY: Yup.string().required("Severity is required"),
  STATUS: Yup.string().required("Status is required"),
  OBS_DESC: Yup.string().required("Observation Description is required"),
  OBS_SUGG: Yup.string().required("Observation Suggestion is required"),
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
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const closureFileInputRef = useRef<HTMLInputElement | null>(null);

  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [configs, setConfigs] = useState<IConfigsList[]>([]);
  const [areas, setAreas] = useState<IOptionList[]>([]);
  const [masterContractors, setMasterContractors] = useState<IContractorList[]>(
    [],
  );
  const [contractors, setContractors] = useState<IOptionList[]>([]);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [closureImagePreviews, setClosureImagePreviews] = useState<any>([]);

  const [collapseFilter, setCollapseFilter] = useState(true);
  const [isHazardSectionOpen, setIsHazardSectionOpen] = useState(false);
  const [hazardsChecklist, setHazardsChecklist] = useState<IOptionList[]>([]);
  const [isRiskSectionOpen, setIsRiskSectionOpen] = useState(false);
  const [riskChecklist, setRiskChecklist] = useState<IOptionList[]>([]);
  const [isPPESectionOpen, setIsPPESectionOpen] = useState(false);
  const [ppeChecklist, setPPEChecklist] = useState<IOptionList[]>([]);
  const [isIsolationSectionOpen, setIsIsolationSectionOpen] = useState(false);
  const [isTrailSectionOpen, setIsTrailSectionOpen] = useState(false);
  const [isAssGenSectionOpen, setIsAssGenSectionOpen] = useState(false);
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

  const [anxRows, setAnxRows] = useState<IAnxPerson[]>([]);

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
      const newRow: IAnxPerson = {
        name: attPerName,
        contractor: attContractor,
        trade: attTrade,
        ticketNo: attTicketNo,
      };
      setAnxRows([...anxRows, newRow]);
      setAttPername("");
      setAttContractor("");
      setAttTrade("");
      setAttTicketNo("");
    }
  };

  // Handle removing a row
  const removeRow = (index: number) => {
    setAnxRows(anxRows.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof IAnxPerson,
  ) => {
    const updatedRows = [...anxRows];
    updatedRows[index][field] = e.target.value;
    setAnxRows(updatedRows);
  };

  const {
    data: ptwMasterData,
    isLoading: isPTWMasterDataLoading,
    isError: isPTWMasterDataError,
  } = usePTWMasterDataQuery();

  const {
    handleSubmit,
    reset,
    control,
    formState,
    getValues,
    setValue,
    watch: watchValues,
  } = useForm<ILogPTWForm>({
    defaultValues: initialFormValues,
  });

  const { isSubmitting, submitCount, errors } = formState;

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
        //setDepartments(historyPTWMasterData[0].DEPARTMENT);
        setValue("department", ownDepartment[0].name, { shouldValidate: true });
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
    if (globalState && globalState.areaId >= 0) {
      handleReset();
    }
  }, [globalState]);

  const isHiddenHirarchy = collapseFilter;

  const handleCollpaseToggle = () => {
    setCollapseFilter(!collapseFilter);
  };
  const [hazardCheckboxState, setHazardCheckboxState] = useState([]);
  const handleHazardsChecklistChange = (event: any, itemId: any) => {
    setHazardCheckboxState((prevState: any) => {
      if (event.target.checked) {
        return [...prevState, itemId];
      } else {
        return prevState.filter((id: any) => id !== itemId);
      }
    });
  };

  const handleFormSubmit: SubmitHandler<ILogPTWForm> = (values: any) => {
    const jsonCheckedHazards = JSON.stringify(hazardCheckboxState);
    console.log(jsonCheckedHazards);
    // loader.show();

    // addNewPTWData(values)
    //   .then(() => {
    //     alertToast.show("success", "Data added successfully", true, 2000);
    //     handleReset();
    //     // Invalidate queries
    //     queryClient.invalidateQueries({
    //       predicate: (query) => query.queryKey[0] === "sioMasterDataQuery",
    //     });
    //   })
    //   .catch((err) => {
    //     if (err.response && err.response.status) {
    //       alertToast.show("warning", err.response.data.errorMessage, true);
    //     }
    //   })
    //   .finally(() => {
    //     loader.hide();
    //   });
  };

  const handleFileChange = (e: any) => {
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

    fetch(`${API_BASE_URL}uploadObsImage`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        setImagePreviews(() => [...filenames]);
      })
      .catch(() => {
        alertToast.show("error", "Error Uploading Image", true);
      });
  };

  const handleDelete = (image: string) => {
    setImagePreviews((prevPreviews: any) =>
      prevPreviews.filter((item: any) => item !== image),
    );

    fetch(`${API_BASE_URL}deleteObsImage`, {
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

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClosureFileButtonClick = () => {
    if (closureFileInputRef.current) {
      closureFileInputRef.current.click();
    }
  };
  const handleClosureFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file: any) => URL.createObjectURL(file));
    setClosureImagePreviews((prevPreviews: any) => [
      ...prevPreviews,
      ...previews,
    ]);
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
                  optionList={[{ id: "", name: "Select Area" }, ...areas]}
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
                  label="Nearest Fire Alarm Point"
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
                Moc Required ?{" "}
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
              <div className="grid grid-cols-1 md:grid-cols-3">
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
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => setIsAssWHSectionOpen((prev) => !prev)}
                  checked={isAssWHSectionOpen}
                />
              </div>
              <div className="p-1">
                Confined Space &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => setIsAssConfinedSectionOpen((prev) => !prev)}
                  checked={isAssConfinedSectionOpen}
                />
              </div>
              <div className="p-1">
                Lifiting Work &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => setIsAssLiftingSectionOpen((prev) => !prev)}
                  checked={isAssLiftingSectionOpen}
                />
              </div>
              <div className="p-1">
                ESMS Work Permit &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => setIsAssEsmsSectionOpen((prev) => !prev)}
                  checked={isAssEsmsSectionOpen}
                />
              </div>
              <div className="p-1">
                Hot Work &nbsp;
                <input
                  type="checkbox"
                  value="Yes"
                  onChange={() => setIsAssHotWrkSectionOpen((prev) => !prev)}
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
                      name="other_specific_hazards"
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
                          name="drive_panel_name"
                          label="Drive/Panel Name"
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="loto_no"
                          label="LOTO No"
                          control={control}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                      <div className="p-1">
                        <TextField
                          name="checked_by"
                          label="Checked By"
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="date_time"
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
                          name="drive_panel_name_service"
                          label="Steam/Air/Water/Gas"
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="loto_no_service"
                          label="LOTO No"
                          control={control}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 p-2 md:grid-cols-2">
                      <div className="p-1">
                        <TextField
                          name="checked_by_service"
                          label="Checked By"
                          control={control}
                        />
                      </div>
                      <div className="p-1">
                        <TextField
                          name="date_time_service"
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
                                  name={`risk_${item2.id}`} // You can use a unique identifier if available (like `item.id`)
                                  value="Yes"
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
                  List of persons attached to this permit (Annexure V) &nbsp;
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
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <TextField
                      name="ass_wh_supervision"
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
                    name="ass_wh_supervision"
                    label="Supervision provided by(Atomberg's Emp)"
                    control={control}
                  />
                  <TextField
                    name="ass_wh_atmospheric_check"
                    label="Atmospheric Checks done by"
                    control={control}
                  />
                  <TextField
                    name="ass_wh_oxygen_level"
                    label="Oxygen level (19% - 21%)"
                    control={control}
                  />
                  <TextField
                    name="ass_wh_lel_uel"
                    label="Explosive LEL & UEL"
                    control={control}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-4">
                  <TextField
                    name="ass_wh_toxic"
                    label="Toxic"
                    control={control}
                  />
                  <TextField
                    name="ass_wh_detector_details"
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
          <div className="grid border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
            <div className="font-bold">
              I Certified that the above check points have been verified and
              found satisfactory.
            </div>
            <div>
              <span className="font-semibold">Name Of Initiator:</span>{" "}
              {authState.NAME}
            </div>
            <div>
              <span className="font-semibold">Custodian:</span>{" "}
              {departmentHeadName}
            </div>
            <div className="grid grid-cols-1 mt-2">
              <div className="p-1">
                <Button
                  disabled={isSubmitting}
                  onClick={() => {
                    handleSubmit(handleFormSubmit)();
                  }}
                  btnType="primary"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogPtw;
