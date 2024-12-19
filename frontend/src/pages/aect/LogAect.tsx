import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { FunnelIcon } from "@heroicons/react/24/solid";
import {
  OBS_CATEGORY_LIST,
  OBS_STATUS_LIST,
} from "@/features/common/constants";
import { ILogAectForm } from "@/features/aect/types";
import { Button, IconButton } from "@/features/ui/buttons";
import { TextArea, TextField, DropdownList } from "@/features/ui/form";
import { useAppSelector } from "@/store/hooks";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { addNewAectData } from "@/features/aect/services/aect.services";
import {
  validateWithCurrentDate,
  validateFromCurrentDate,
  validateTwoDates,
} from "@/features/common/utils/yup-custom-validator";
import HirarchyFilterAll from "@/features/common/HirarchyFilterAll";

const initialFormValues: ILogAectForm = {
  ID: 0,
  TEAM_ID: 0,
  AREA_ID: 0,
  OBS_DESC: "",
  CATEGORY: "UA",
  LOCATION: "",
  SEVERITY: "Minor",
  REPORTED_BY: 0,
  REPORTED_DATE: dayjs(new Date()).format("YYYY-MM-DD"),
  STATUS: "Open",
  ACTION_PLANNED: "",
  PDC_DATE: "",
  ACTION_TAKEN: "",
  ACTION_CLOSED_BY: 0,
  ACTION_CLOSED_DATE: "",
};

const formSchema = Yup.object().shape({
  REPORTED_DATE: Yup.string()
    .required("Observation Date is required")
    .test({
      name: "Date Validation",
      message: "Observation Date must be less then/ Equal to current Date",
      test: (val) => {
        return validateWithCurrentDate(val);
      },
    })
    .test({
      name: "Date Validation",
      message: "Observation Date cannot be more than 1 Days back",
      test: (val) => {
        return validateFromCurrentDate(val, 1);
      },
    }),
  OBS_DESC: Yup.string()
    .required("Observation Description is required")
    .max(400, "Maximum 400 characters can be entered"),
  LOCATION: Yup.string()
    .required("Exact Location is required")
    .max(200, "Maximum 200 characters can be entered"),
  ACTION_PLANNED: Yup.string().max(
    400,
    "Maximum 400 characters can be entered",
  ),
  PDC_DATE: Yup.string()
    .when("STATUS", {
      is: (val: string) => val === "Closed",
      then: Yup.string().required("PDC is required if Status is Closed"),
    })
    .test({
      name: "Date Validation",
      message: "PDC Date must be greater than or equal to Observation Date",
      test: (val, context) => {
        return validateTwoDates(context.parent.REPORTED_DATE, val);
      },
    }),
  ACTION_TAKEN: Yup.string()
    .max(400, "Maximum 400 characters can be entered")
    .when("STATUS", {
      is: (val: string) => val === "Closed",
      then: Yup.string().required(
        "Action Taken is required when Status is Closed",
      ),
    }),
});

function LogAect() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const queryClient = useQueryClient();

  const [collapseFilter, setCollapseFilter] = useState(true);

  
  
  let CURR_OBS_SEVERITY_LIST = [{ id: "Minor", name: "Minor" }];
  

  const { handleSubmit, reset, control, formState, getValues, setValue } =
    useForm<ILogAectForm>({
      defaultValues: initialFormValues,
      resolver: yupResolver(formSchema),
    });

  const { isSubmitting, submitCount, errors } = formState;

  const handleReset = () => {
    reset({
      ...initialFormValues,
      TEAM_ID: globalState.teamId,
      AREA_ID: globalState.areaId,
      REPORTED_BY: authState.ID,
      REPORTED_DATE: dayjs(new Date()).format("YYYY-MM-DD"),
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

  const handleFormSubmit: SubmitHandler<ILogAectForm> = (values) => {
    if (globalState.locationId < 1) {
      alertToast.show("warning", "Location data missing", true, 5000);
    } else {
      loader.show();
      addNewAectData(values)
        .then(() => {
          alertToast.show("success", "Data Added Succesfully", true, 2000);
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
    }
  };

  const handleStatusChange = (value: string | number) => {
    if (value === "Closed") {
      setValue("ACTION_CLOSED_BY", authState.ID);
      setValue("ACTION_CLOSED_DATE", dayjs(new Date()).format("YYYY-MM-DD"));
      const pdcDate = getValues("PDC_DATE");
      if (pdcDate.length <= 0) {
        setValue("PDC_DATE", dayjs(new Date()).format("YYYY-MM-DD"));
      }
    } else {
      setValue("ACTION_CLOSED_BY", 0);
      setValue("ACTION_CLOSED_DATE", "");
    }
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

          <form className="w-[100%] md:w-auto grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))]  gap-4  justify-evenly">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              <div className="p-1">
                <TextField
                  type="text"
                  name="OBSERVATION_NO"
                  label="Observation No"
                  control={control}
                />
              </div>
              <div className="p-1">
                <TextField
                  type="date"
                  name="OBSERVATION_DATE"
                  label="Observation Date"
                  control={control}
                />
              </div>
              <div className="p-1">
                <TextField
                  type="time"
                  name="OBSERVATION_TIME"
                  label="Observation Time"
                  control={control}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogAect;
