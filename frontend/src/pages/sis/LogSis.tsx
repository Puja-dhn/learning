import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { Button } from "@/features/ui/buttons";
import { TextArea, TextField, DropdownList } from "@/features/ui/form";
import { useAppSelector } from "@/store/hooks";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";

import ILogSisForm from "@/features/sis/types/sis/ILogSisForm";
import { addNewSIOData } from "@/features/sis/services/sis.services";
import { IOptionList } from "@/features/ui/types";
import useSIOMasterDataQuery from "@/features/sis/hooks/useSIOMasterDataQuery";

const initialFormValues: ILogSisForm = {
  OBS_DATE_TIME: "",
  DEPARTMENT: "",
  AREA: "",
  CATEGORY: "",
  SEVERITY: "Minor",
  STATUS: "Open",
  OBS_DESC: "",
  OBS_SUGG: "",
  OBS_PHOTOS: "",
  CLOSE_DESC: "",
  CLOSE_PHOTOS: "",
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

function LogSis() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const closureFileInputRef = useRef<HTMLInputElement | null>(null);

  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [categories, setCategories] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IOptionList[]>([]);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [closureImagePreviews, setClosureImagePreviews] = useState<any>([]);

  const [collapseFilter, setCollapseFilter] = useState(true);

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
      setAreas(historySIOMasterData[0].AREA);
    }
  }, [sioMasterData, isSIOMasterDataLoading, isSIOMasterDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "sioMasterDataQuery",
    });
  }, []);

  const CURR_OBS_SEVERITY_LIST = [
    { id: "Minor", name: "Minor" },
    { id: "Serious", name: "Serious" },
  ];
  const CURR_OBS_STATUS = [
    { id: "Open", name: "Open" },
    { id: "Closed", name: "Closed" },
  ];

  const {
    handleSubmit,
    reset,
    control,
    formState,
    getValues,
    setValue,
    watch: watchValues,
  } = useForm<ILogSisForm>({
    defaultValues: initialFormValues,
    resolver: yupResolver(formSchema),
  });

  const { isSubmitting, submitCount, errors } = formState;

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

  const handleFormSubmit: SubmitHandler<ILogSisForm> = (values) => {
    if (imagePreviews.length === 0) {
      alertToast.show("warning", "Observation photos are required", true, 5000);
      return;
    }

    if (values.STATUS === "Closed") {
      if (!values.CLOSE_DESC || values.CLOSE_DESC.trim() === "") {
        alertToast.show(
          "warning",
          "Closure description is required",
          true,
          5000,
        );
        return;
      }

      if (closureImagePreviews.length === 0) {
        alertToast.show("warning", "Closure images are required", true, 5000);
        return;
      }
    }
    values.OBS_PHOTOS = imagePreviews.join(",");
    if (values.STATUS === "Closed") {
      values.CLOSE_PHOTOS = closureImagePreviews.join(",");
    }
    loader.show();

    addNewSIOData(values)
      .then(() => {
        alertToast.show("success", "Data added successfully", true, 2000);
        handleReset();
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "aectDataPendingQuery",
        });
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

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file: any) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews: any) => [...prevPreviews, ...previews]);
  };
  const handleDelete = (index: any) => {
    setImagePreviews((prevPreviews: any[]) =>
      prevPreviews.filter((_, i) => i !== index),
    );
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleStatusChange = (value: string | number) => {
    if (value === "Closed") {
    } else {
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
  const handleDeleteClosureImage = (index: any) => {
    setClosureImagePreviews((prevPreviews: any[]) =>
      prevPreviews.filter((_, i) => i !== index),
    );
  };
  return (
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
                  type="datetime-local"
                  name="OBS_DATE_TIME"
                  label="Observation Date Time"
                  control={control}
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="DEPARTMENT"
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
                  name="AREA"
                  label="Area"
                  control={control}
                  optionList={[{ id: "", name: "Select Area" }, ...areas]}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-1">
                <DropdownList
                  name="CATEGORY"
                  label="Category"
                  control={control}
                  optionList={[
                    { id: "", name: "Select Category" },
                    ...categories,
                  ]}
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="SEVERITY"
                  label="Severity"
                  control={control}
                  optionList={[...CURR_OBS_SEVERITY_LIST]}
                />
              </div>
              <div className="p-1">
                <DropdownList
                  name="STATUS"
                  label="Observation Status"
                  control={control}
                  optionList={[...CURR_OBS_STATUS]}
                  changeHandler={handleStatusChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-1">
                <TextArea
                  name="OBS_DESC"
                  label="Observation Description"
                  control={control}
                />
              </div>
              <div className="p-1">
                <TextArea
                  name="OBS_SUGG"
                  label="Observation Suggestion"
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 ">
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
                />
              </div>
            </div>
            <div className="flex mt-4 space-x-4 overflow-x-auto">
              {imagePreviews.map((preview: any, index: any) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`preview-${index}`}
                    className="object-cover w-24 h-24 rounded-lg"
                  />
                  <button
                    onClick={() => handleDelete(index)}
                    className="absolute top-0 right-0 p-1 text-xs text-white bg-red-500 rounded-full hover:bg-red-700"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {watchValues("STATUS") === "Closed" && (
              <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
                <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Closure Details
                  </h2>
                </div>

                <div className="w-[100%]   gap-4  justify-evenly">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="p-1">
                      <TextArea
                        name="CLOSE_DESC"
                        label="Closure Description"
                        control={control}
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
                      />
                    </div>
                  </div>
                  <div className="flex mt-4 space-x-4 overflow-x-auto">
                    {closureImagePreviews.map((preview: any, index: any) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          className="object-cover w-24 h-24 rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteClosureImage(index)}
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
            )}
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

export default LogSis;
