import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, IconButton } from "@/features/ui/buttons";
import { TextArea, TextField, DropdownList } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";

import { addNewSIOData } from "@/features/sis/services/sis.services";
import { IOptionList } from "@/features/ui/types";
import IAreasList from "@/features/sis/types/sis/IAreasList";
import useIMSMasterDataQuery from "@/features/ims/hooks/useIMSMasterDataQuery";
import ILogImsForm from "@/features/ims/types/ILogImsForm";
import { InputText } from "@/features/ui/elements";
import { addNewImsData } from "@/features/ims/services/ims.services";
import { API_BASE_URL, ASSET_BASE_URL } from "@/features/common/constants";
import ISelectList from "@/features/common/types/ISelectList";

const initialFormValues: ILogImsForm = {
  inc_date_time: "",
  department: "",
  area: "",
  reported_by: "",
  injury_type: "",
  factors: "",
  exact_location: "",
  potential_outcome: "",
  action_taken: "",
  injury_details: "",
  incident_details: "",
  ims_photos: "",
  immediate_action: "",
  suggested_team: "",
  witness: "",
};

const formSchema = Yup.object().shape({
  inc_date_time: Yup.string().required("Incident Date time is required"),
  department: Yup.string().required("Department is required"),
  area: Yup.string().required("Area is required"),
  reported_by: Yup.string().required("Reported By is required"),
  injury_type: Yup.string().required("Injury type is required"),
  factors: Yup.string().required("Factors is required"),
  exact_location: Yup.string().required("Exact location is required"),
  incident_details: Yup.string().required("Incident details is required"),
});

function LogIms() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [injuryType, setInjuryType] = useState<IOptionList[]>([]);
  const [factors, setFactors] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IAreasList[]>([]);
  const [contractors, setContractors] = useState<IOptionList[]>([]);
  const [users, setUsers] = useState<IOptionList[]>([]);
  const [filterUsers, setFilterUsers] = useState<ISelectList[]>([]);
  const [bodypartList, setBodypartList] = useState<IOptionList[]>([]);
  const [injuryNameList, setInjuryNameList] = useState<IOptionList[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<IOptionList[]>([]);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [injuryName, setInjuryName] = useState<string>("");

  const [injuryRow, setInjuryRow] = useState<any[]>([]);
  const [newRow, setNewRow] = useState({
    companyType: "Permanent",
    employeeId: "",
    name: "",
    department: "",
    company: "",
    age: "",
    sex: "",
    deployedDate: "",
    bodyPart: "",
    injuryNature: "",
  });
  const [suggTeamRow, setSuggTeamRow] = useState<any[]>([]);
  const [suggTeamNewRow, setSuggTeamNewRow] = useState({
    id: "",
    name: "",
  });
  const [witTeamRow, setWitTeamRow] = useState<any[]>([]);
  const [witTeamNewRow, setWitTeamNewRow] = useState({
    employeeId: "",
    name: "",
    department: "",
  });

  const {
    data: imsMasterData,
    isLoading: isIMSMasterDataLoading,
    isError: isIMSSMasterDataError,
  } = useIMSMasterDataQuery();

  useEffect(() => {
    if (isIMSMasterDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isIMSMasterDataLoading && isIMSSMasterDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isIMSMasterDataLoading && !isIMSSMasterDataError && imsMasterData) {
      const historyIMSMasterData = [imsMasterData.historyIMSMasterData];

      setDepartments(historyIMSMasterData[0].DEPARTMENT);
      setInjuryType(historyIMSMasterData[0].INJURYTYPE);
      setFactors(historyIMSMasterData[0].FACTORS);
      setAreas(historyIMSMasterData[0].AREA);
      setContractors(historyIMSMasterData[0].CONTRACTORS);
      setUsers(historyIMSMasterData[0].USERS);
      const userOptions: ISelectList[] = historyIMSMasterData[0].USERS.map(
        (user: any) => ({
          value: user.id,
          label: user.name,
        }),
      );

      setFilterUsers(userOptions);
      setBodypartList(historyIMSMasterData[0].BODYPART);
      setInjuryNameList(historyIMSMasterData[0].INJURYNATURE);
    }
  }, [imsMasterData, isIMSMasterDataLoading, isIMSSMasterDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "imsMasterDataQuery",
    });
  }, []);

  const {
    handleSubmit,
    reset,
    control,
    formState,
    setValue,
    watch: watchValues,
  } = useForm<ILogImsForm>({
    defaultValues: initialFormValues,
    resolver: yupResolver(formSchema),
  });

  const { isSubmitting } = formState;

  const handleReset = () => {
    reset({
      ...initialFormValues,
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

  useEffect(() => {
    if (+watchValues("injury_type") > 0) {
      const injName = injuryType.filter(
        (item) => +item.id === +watchValues("injury_type"),
      )[0].name;
      setInjuryName(injName);
    }
  }, [watchValues("injury_type")]);

  const handleFormSubmit: SubmitHandler<ILogImsForm> = (values) => {
    if (imagePreviews.length === 0) {
      alertToast.show("warning", "Incident Photos are required", true, 5000);
      return;
    }
    if (injuryName === "Medical Center FAC") {
      if (watchValues("injury_details") === "") {
        alertToast.show("warning", "Injury details required", true, 2000);
      }
    }
    values.ims_photos = JSON.stringify(imagePreviews);
    loader.show();

    addNewImsData(values)
      .then(() => {
        alertToast.show("success", "Data added successfully", true, 2000);
        handleReset();
        setImagePreviews([]);
        setInjuryRow([]);
        setSuggTeamRow([]);
        setWitTeamRow([]);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "imsMasterDataQuery",
        });
      })
      .catch((err) => {
        if (err.response && err.response.status) {
          alertToast.show("warning", err.response.data.error, true);
        }
      })
      .finally(() => {
        loader.hide();
      });
  };
  const handleInputChange = (field: string, value: string) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const addRow = () => {
    // Check if all required fields are filled
    if (
      newRow.companyType &&
      newRow.employeeId &&
      newRow.name &&
      newRow.company &&
      newRow.age &&
      newRow.sex &&
      newRow.bodyPart &&
      newRow.injuryNature
    ) {
      setInjuryRow((prev) => {
        const updatedArray = [...prev, newRow];

        // Update the JSON value for the entire array
        setValue("injury_details", JSON.stringify(updatedArray));

        return updatedArray;
      });

      // Reset the new row input
      setNewRow({
        companyType: "Permanent",
        employeeId: "",
        name: "",
        department: "",
        company: "",
        age: "",
        sex: "",
        deployedDate: "",
        bodyPart: "",
        injuryNature: "",
      });
    } else {
      // Show warning if fields are empty
      alertToast.show(
        "warning",
        "All fields are required to add a new row.",
        true,
      );
    }
  };

  const removeRow = (index: number) => {
    setInjuryRow((prev) => {
      const updatedArray = prev.filter((_, i) => i !== index);

      // Update the JSON value with the updated array
      setValue("injury_details", JSON.stringify(updatedArray));

      return updatedArray;
    });
  };

  // Handle input changes for the suggested team row
  const handleSuggTeamInputChange = (field: string, value: string) => {
    const fusers = filterUsers.filter((item) => item.value === value);
    setSuggTeamNewRow((prev) => ({
      ...prev,
      id: value,
      name: fusers[0].label,
    }));
  };

  // Add a new suggested team row
  const addSuggTeamRow = () => {
    if (suggTeamNewRow.name) {
      setSuggTeamRow((prev) => {
        const updatedArray = [...prev, suggTeamNewRow];

        // Update the JSON value with the entire updated array
        setValue("suggested_team", JSON.stringify(updatedArray));

        return updatedArray;
      });

      // Reset the new row input
      setSuggTeamNewRow({
        id: "",
        name: "",
      });
    } else {
      alertToast.show(
        "warning",
        "All fields are required to add a new row.",
        true,
      );
    }
  };

  // Remove a suggested team row by index
  const removeSuggTeamRow = (index: number) => {
    setSuggTeamRow((prev) => {
      const updatedArray = prev.filter((_, i) => i !== index);

      // Update the JSON value with the updated array
      setValue("suggested_team", JSON.stringify(updatedArray));

      return updatedArray;
    });
  };

  const handleWitTeamInputChange = (field: string, value: string) => {
    setWitTeamNewRow((prev) => ({ ...prev, [field]: value }));
  };
  const addWitTeamRow = () => {
    if (
      witTeamNewRow.employeeId &&
      witTeamNewRow.name &&
      witTeamNewRow.department
    ) {
      // Append the new row to the array
      setWitTeamRow((prev) => {
        const updatedArray = [...prev, witTeamNewRow];

        // Store the entire array as a JSON string
        setValue("witness", JSON.stringify(updatedArray));

        return updatedArray;
      });

      // Reset the new row inputs
      setWitTeamNewRow({
        employeeId: "",
        name: "",
        department: "",
      });
    } else {
      // Show warning if fields are empty
      alertToast.show(
        "warning",
        "All fields are required to add a new row.",
        true,
      );
    }
  };

  // Remove a row by index
  const removeWitTeamRow = (index: number) => {
    setWitTeamRow((prev) => {
      const updatedWitTeamRow = prev.filter((_, i) => i !== index);

      // Update the "witness" value as JSON
      setValue("witness", JSON.stringify(updatedWitTeamRow));

      return updatedWitTeamRow;
    });
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

    fetch(`${API_BASE_URL}uploadImsImage`, {
      method: "POST",
      body: formData,
    })
      .then(async () => {
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

    fetch(`${API_BASE_URL}deleteImsImage`, {
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

  return (
    <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
      <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
        <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
          <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              General Information
            </h2>
          </div>

          <form className="w-[100%]   gap-4  justify-evenly">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-1">
                <TextField
                  type="datetime-local"
                  name="inc_date_time"
                  label="Incident Date Time"
                  control={control}
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="department"
                  label="Department"
                  control={control}
                  optionList={[
                    { id: "", name: "Select Department" },
                    ...departments,
                  ]}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-1">
                <TextField
                  name="reported_by"
                  label="Reported By"
                  control={control}
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="injury_type"
                  label="Injury Type"
                  control={control}
                  optionList={[
                    { id: "", name: "Select Injury Type" },
                    ...injuryType,
                  ]}
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="factors"
                  label="Cause Of Incident"
                  control={control}
                  optionList={[{ id: "", name: "Select" }, ...factors]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-1">
                <TextArea
                  name="exact_location"
                  label="Exact Location"
                  control={control}
                />
              </div>
              <div className="p-1">
                <TextArea
                  name="potential_outcome"
                  label="Potential Outcome"
                  control={control}
                />
              </div>
              <div className="p-1">
                <TextArea
                  name="action_taken"
                  label="Immediate Action taken"
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 ">
              <div className="p-1">
                <TextArea
                  name="incident_details"
                  label="Incident Details"
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 ">
              <div className="p-1">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-white bg-[#9fa5b1] rounded-lg focus:outline-none hover:bg-[#9fa5b1]"
                  onClick={handleButtonClick}
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
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
            </div>
            <div className="flex mt-4 space-x-4 overflow-x-auto">
              {imagePreviews.map((preview: any, index: any) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="relative">
                  <img
                    src={`${ASSET_BASE_URL}imsimages/logims/${preview || ""}`}
                    alt={`preview-${index}`}
                    className="object-cover w-24 h-24 rounded-lg"
                  />
                  <button
                    onClick={() => handleDelete(preview)}
                    className="absolute top-0 right-0 p-1 text-xs text-white bg-red-500 rounded-full hover:bg-red-700"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {injuryName === "Medical Center FAC" && (
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
                              Emp. Type
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Employee ID
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Name
                            </th>
                            {/* <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Department
                            </th> */}
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
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Input row for adding new rows */}
                          <tr>
                            <td className="px-4 py-2 border-b">1</td>
                            <td className="px-4 py-2 border-b">
                              <select
                                value={newRow.companyType}
                                onChange={(e) =>
                                  handleInputChange(
                                    "companyType",
                                    e.target.value,
                                  )
                                }
                                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                              >
                                <option value="Permanent">Permanent</option>
                                <option value="Contractor">Contractor</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={newRow.employeeId}
                                changeHandler={(e: any) =>
                                  handleInputChange("employeeId", e)
                                }
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={newRow.name}
                                changeHandler={(e: any) =>
                                  handleInputChange("name", e)
                                }
                                className="w-full"
                              />
                            </td>
                            {/* <td className="px-4 py-2 border-b">
                              <InputText
                                type="text"
                                value={newRow.department}
                                changeHandler={(e: any) =>
                                  handleInputChange("department", e)
                                }
                                className="w-full"
                              />
                            </td> */}
                            <td className="px-4 py-2 border-b">
                              {newRow.companyType === "Contractor" ? (
                                <select
                                  value={newRow.company}
                                  onChange={(e: any) =>
                                    handleInputChange("company", e.target.value)
                                  }
                                  name="company"
                                  className="bg-gray-50 border border-gray-300 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400"
                                >
                                  <option value="">Select Contractors</option>
                                  {contractors && contractors.length > 0 ? (
                                    contractors.map((item, index) => (
                                      <option key={index} value={item.name}>
                                        {item.name}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="" disabled>
                                      No contractors available
                                    </option>
                                  )}
                                </select>
                              ) : (
                                <InputText
                                  type="text"
                                  value={newRow.company}
                                  changeHandler={(e: any) =>
                                    handleInputChange("company", e)
                                  }
                                  className="w-full"
                                />
                              )}
                            </td>
                            <td className="px-4 py-2 border-b">
                              <InputText
                                type="number"
                                value={newRow.age}
                                changeHandler={(e: any) =>
                                  handleInputChange("age", e)
                                }
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              <select
                                value={newRow.sex}
                                onChange={(e: any) =>
                                  handleInputChange("sex", e.target.value)
                                }
                                name="sex"
                                className="bg-gray-50 border border-gray-300 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400"
                              >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </td>

                            <td className="px-4 py-2 border-b">
                              <select
                                value={newRow.bodyPart}
                                onChange={(e: any) =>
                                  handleInputChange("bodyPart", e.target.value)
                                }
                                name="bodyPart"
                                className="bg-gray-50 border border-gray-300 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400"
                              >
                                <option value="">Select</option>
                                {bodypartList &&
                                  bodypartList.length > 0 &&
                                  bodypartList.map((item, index) => (
                                    <option key={index} value={item.name}>
                                      {item.name}
                                    </option>
                                  ))}
                              </select>
                            </td>
                            <td className="px-4 py-2 border-b">
                              <select
                                value={newRow.injuryNature}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    "injuryNature",
                                    e.target.value,
                                  )
                                }
                                name="injuryNature"
                                className="bg-gray-50 border border-gray-300 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400"
                              >
                                <option value="">Select</option>
                                {injuryNameList &&
                                  injuryNameList.length > 0 &&
                                  injuryNameList.map((item, index) => (
                                    <option key={index} value={item.name}>
                                      {item.name}
                                    </option>
                                  ))}
                              </select>
                            </td>
                            <td className="px-4 py-2 border-b">
                              <IconButton onClick={addRow}>
                                <PlusIcon className="w-4 h-4" />
                              </IconButton>
                            </td>
                          </tr>

                          {/* Render additional rows from injuryRow */}
                          {injuryRow.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 border-b">
                                {index + 2}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {item.companyType}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {item.employeeId}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {item.name}
                              </td>
                              {/* <td className="px-4 py-2 border-b">
                                {item.department}
                              </td> */}
                              <td className="px-4 py-2 border-b">
                                {item.company}
                              </td>
                              <td className="px-4 py-2 border-b">{item.age}</td>
                              <td className="px-4 py-2 border-b">{item.sex}</td>

                              <td className="px-4 py-2 border-b">
                                {item.bodyPart}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {item.injuryNature}
                              </td>
                              <td className="px-4 py-2 border-b">
                                <IconButton onClick={() => removeRow(index)}>
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
              )}
              <div className="mt-2 grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
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
                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[9.5%]">
                            Sl. No.
                          </th>
                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[27%]">
                            Employee ID
                          </th>
                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[27%]">
                            Name
                          </th>

                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Input row for adding new rows */}
                        <tr>
                          <td className="px-4 py-2 border-b">1</td>
                          <td className="px-4 py-2 border-b">
                            <InputText
                              type="text"
                              value={suggTeamNewRow.id}
                              className="w-full "
                              disabled
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <Select
                              options={filterUsers}
                              onChange={(e: any) => {
                                if (e) {
                                  handleSuggTeamInputChange("name", e.value);
                                }
                              }}
                              className="mt-[4px] bg-gray-600 text-black rounded-lg "
                            />
                            {/* <select
                              value={suggTeamNewRow.id}
                              onChange={(e) =>
                                handleSuggTeamInputChange(
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                            >
                              <option value="">Select</option>
                              {users &&
                                users.length > 0 &&
                                users.map((item) => (
                                  <option value={item.id}>{item.name}</option>
                                ))}
                            </select> */}
                          </td>

                          <td className="px-4 py-2 border-b">
                            <IconButton onClick={addSuggTeamRow}>
                              <PlusIcon className="w-4 h-4" />
                            </IconButton>
                          </td>
                        </tr>

                        {/* Render additional rows from injuryRow */}
                        {suggTeamRow &&
                          suggTeamRow.length > 0 &&
                          suggTeamRow.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 border-b">
                                {index + 2}
                              </td>
                              <td className="px-4 py-2 border-b">{item.id}</td>
                              <td className="px-4 py-2 border-b">
                                {item.name}
                              </td>

                              <td className="px-4 py-2 border-b">
                                <IconButton
                                  onClick={() => removeSuggTeamRow(index)}
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
                      Witness &nbsp;
                    </h3>
                  </div>

                  <div className="mt-1">
                    <table className="min-w-full border-collapse table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                            Sl. No.
                          </th>
                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                            Employee ID
                          </th>
                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                            Name
                          </th>

                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                            Department/Company
                          </th>

                          <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Input row for adding new rows */}
                        <tr>
                          <td className="px-4 py-2 border-b">1</td>
                          <td className="px-4 py-2 border-b">
                            <InputText
                              type="text"
                              value={witTeamNewRow.employeeId}
                              changeHandler={(e: any) =>
                                handleWitTeamInputChange("employeeId", e)
                              }
                              className="w-full"
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <InputText
                              type="text"
                              value={witTeamNewRow.name}
                              changeHandler={(e: any) =>
                                handleWitTeamInputChange("name", e)
                              }
                              className="w-full"
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <InputText
                              type="text"
                              value={witTeamNewRow.department}
                              changeHandler={(e: any) =>
                                handleWitTeamInputChange("department", e)
                              }
                              className="w-full"
                            />
                          </td>

                          <td className="px-4 py-2 border-b">
                            <IconButton onClick={addWitTeamRow}>
                              <PlusIcon className="w-4 h-4" />
                            </IconButton>
                          </td>
                        </tr>

                        {/* Render additional rows from injuryRow */}
                        {witTeamRow &&
                          witTeamRow.length > 0 &&
                          witTeamRow.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 border-b">
                                {index + 2}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {item.employeeId}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {item.name}
                              </td>

                              <td className="px-4 py-2 border-b">
                                {item.department}
                              </td>

                              <td className="px-4 py-2 border-b">
                                <IconButton
                                  onClick={() => removeWitTeamRow(index)}
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIms;
