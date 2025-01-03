import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { Button } from "@/features/ui/buttons";
import { DropdownList, TextArea, TextField } from "@/features/ui/form";
import { useAppSelector } from "@/store/hooks";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";

import { addNewSIOData } from "@/features/sis/services/sis.services";

import ILogViolationForm from "@/features/ptw/types/ptw/ILogViolationForm";
import useViolationMasterDataQuery from "@/features/ptw/hooks/useViolationMasterDataQuery";
import IViolationMasterData from "@/features/ptw/types/ptw/IViolationMasterData";
import { addNewViolationData } from "@/features/ptw/services/ptw.services";
import { IOptionList } from "@/features/ui/types";
import { SelectSearchable } from "@/features/ui/elements";
import ISelectList from "@/features/common/types/ISelectList";

interface ILogViolationTeamData {
  historyLogViolationData: IViolationMasterData[];
}
const initialFormValues: ILogViolationForm = {
  permit_no: "",
  contractor_name: "",
  job_description: "",
  violation_dtls: "",
};

const formSchema = Yup.object().shape({
  permit_no: Yup.string().required("Permit no is required"),
  violation_dtls: Yup.string().required("Violation details is required"),
});

function LogViolations() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const queryClient = useQueryClient();

  const [teamData, setTeamData] = useState<ILogViolationTeamData>({
    historyLogViolationData: [],
  });

  const [permitList, setPermitList] = useState<any>([]);
  const [filterPermitList, setFilterPermitList] = useState<any>([]);

  const {
    handleSubmit,
    reset,
    control,
    formState,
    setValue,
    watch: watchValues,
  } = useForm<ILogViolationForm>({
    defaultValues: initialFormValues,
    resolver: yupResolver(formSchema),
  });

  const {
    data: vioMasterData,
    isLoading: isVIOMasterDataLoading,
    isError: isVIOMasterDataError,
  } = useViolationMasterDataQuery();

  useEffect(() => {
    if (isVIOMasterDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isVIOMasterDataLoading && isVIOMasterDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isVIOMasterDataLoading && !isVIOMasterDataError && vioMasterData) {
      const historyLogViolationData = [
        ...vioMasterData.historyViolationMasterData,
      ];

      setTeamData({
        historyLogViolationData,
      });
      const permitData: ISelectList[] =
        vioMasterData.historyViolationMasterData.map((item: any) => ({
          value: item.id,
          label: item.job_description.substring(0, 100),
        }));

      setPermitList(permitData);
      setFilterPermitList(permitData);
    }
  }, [vioMasterData, isVIOMasterDataLoading, isVIOMasterDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "violationMasterDataQuery",
    });
  }, []);
  useEffect(() => {
    if (
      teamData.historyLogViolationData &&
      teamData.historyLogViolationData.length > 0
    ) {
      const filterValue = teamData.historyLogViolationData.filter(
        (item) => +item.id === +watchValues("permit_no"),
      );
      if (filterValue.length > 0) {
        setValue("contractor_name", filterValue[0].contractor_name, {
          shouldValidate: true,
        });
        setValue("job_description", filterValue[0].job_description, {
          shouldValidate: true,
        });
      }
    }
  }, [watchValues("permit_no")]);

  const { isSubmitting } = formState;

  const handleReset = () => {
    reset({
      ...initialFormValues,
    });
  };

  const handleFormSubmit: SubmitHandler<ILogViolationForm> = (values) => {
    loader.show();

    addNewViolationData(values)
      .then(() => {
        alertToast.show(
          "success",
          "Violation created successfully",
          true,
          2000,
        );
        handleReset();

        // Invalidate queries
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "violationMasterDataQuery",
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

  const [selectedIssuer, setSelectedIssuer] =
    useState<string>("Select issuers");
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchTextChange = (newSearchText: string) => {
    setSearchText(newSearchText);
    if (newSearchText !== "") {
      const filtered = permitList.filter((option: any) =>
        option.name.toLowerCase().includes(newSearchText.toLowerCase()),
      );
      setFilterPermitList(filtered);
    } else {
      setFilterPermitList(permitList);
    }
  };

  const handleOptionChange = (selectedItem: IOptionList) => {
    setSelectedIssuer(selectedItem.name);
    setValue("permit_no", selectedItem.id.toString(), { shouldValidate: true });
  };

  return (
    <div className="flex flex-col w-full h-full p-2 overflow-auto ">
      <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
        <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
          <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Violations Details
            </h2>
          </div>

          <form className="w-[100%]   gap-4  justify-evenly">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-1">
                <span className="text-gray-900">Permit</span>
                <Select
                  options={filterPermitList}
                  onChange={(selectedItem: any) => {
                    if (selectedItem) {
                      setSelectedIssuer(selectedItem.label);
                      setValue("permit_no", selectedItem.value.toString(), {
                        shouldValidate: true,
                      });
                    }
                  }}
                  className="mt-[4px] bg-gray-600 text-black rounded-lg "
                />
                {/* <SelectSearchable
                  selectedValue={selectedIssuer}
                  optionList={[...permitList]}
                  searchText={searchText}
                  searchTextChangeHandler={handleSearchTextChange}
                  onChange={handleOptionChange}
                  className="mt-[9px]"
                /> */}
                {/* <DropdownList
                  name="permit_no"
                  label="Permit No"
                  control={control}
                  optionList={[{ id: "", name: "Select" }, ...permitList]}
                /> */}
                {/* <TextField
                  name="permit_no"
                  label="Permit No"
                  control={control}
                /> */}
              </div>
              <div className="p-1">
                <TextField
                  name="contractor_name"
                  label="Contractor"
                  control={control}
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-1">
                <TextArea
                  name="job_description"
                  label="Job Description"
                  control={control}
                  disabled
                />
              </div>
              <div className="p-1">
                <TextArea
                  name="violation_dtls"
                  label="Violation Details"
                  control={control}
                />
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

export default LogViolations;
