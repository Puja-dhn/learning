import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import ModalPopupMobile from "@/features/ui/popup/ModalPopupMobile";
import { DropdownList, TextArea, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import * as XLSX from "xlsx";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import IContextAddForm from "@/features/master/types/IContextAddForm";
import { addNewContextData } from "@/features/master/services/master.services";

interface IContextDefinition {
  CONTEXT_ID: string;
  CONTEXT_NAME: string;
  DEFINITIONS_TYPE: string;
}
const initialAddValues: IContextAddForm = {
  context_name: "",
  definitions_type: "",
};

function ContextDefinations() {
  const [contextDefinitions, setContextDefinitions] = useState<
    IContextDefinition[]
  >([]);
  const [selectedContextDefinition, setSelectedContextDefinition] =
    useState<IContextDefinition | null>(null);
  const [
    showContextDefinitionDetailsDialog,
    setShowContextDefinitionDetailsDialog,
  ] = useState(false);
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const queryClient = useQueryClient();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);

  useEffect(() => {
    // Fetch context definitions data from API
    const fetchContextDefinitions = async () => {
      loader.show();
      try {
        const response = await fetch("/api/contextdefinitions");
        const data = await response.json();
        setContextDefinitions(data);
      } catch (error) {
        alertToast.show(
          "error",
          "Error fetching context definitions data",
          true,
        );
      } finally {
        loader.hide();
      }
    };

    fetchContextDefinitions();
  }, []);

  const handleExport = () => {
    const rows = contextDefinitions.map((contextDefinition) => ({
      ContextID: contextDefinition.CONTEXT_ID,
      ContextName: contextDefinition.CONTEXT_NAME,
      DefinitionsType: contextDefinition.DEFINITIONS_TYPE,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ContextDefinitions");
    XLSX.writeFile(wb, "contextdefinitions.xlsx");
  };

  const handleContextDefinitionDetailsDialogOpen = (
    contextDefinition: IContextDefinition,
  ) => {
    setSelectedContextDefinition(contextDefinition);
    setShowContextDefinitionDetailsDialog(true);
  };

  const handleContextDefinitionDetailsDialogClose = () => {
    setSelectedContextDefinition(null);
    setShowContextDefinitionDetailsDialog(false);
  };

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleContextDefinitionDetailsDialogOpen(params.row)}
        >
          <EyeIcon className="w-4 h-4" />
        </IconButton>
      ),
    },
    { field: "CONTEXT_ID", headerName: "Context ID", width: 150 },
    { field: "CONTEXT_NAME", headerName: "Context Name", width: 200 },
    { field: "DEFINITIONS_TYPE", headerName: "Definitions Type", width: 200 },
  ];
  const [showAddDialog, setShowAddDialog] = useState({
    status: false,
    formInitialValues: initialAddValues,
  });
  const {
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    control: controlAdd,
    formState: formStateAdd,
  } = useForm<IContextAddForm>({
    defaultValues: initialAddValues,
  });
  const handleAdd = () => {
    resetAdd({
      ...initialAddValues,
    });
    setShowAddDialog({
      status: true,
      formInitialValues: {
        ...initialAddValues,
      },
    });
  };
  const handleAddDialogClose = () => {
    setShowAddDialog((oldState) => ({ ...oldState, status: false }));
  };
  const handleAddFormSubmit: SubmitHandler<IContextAddForm> = (values) => {
    loader.show();
    addNewContextData(values)
      .then(() => {
        alertToast.show("success", "Data added successfully", true, 2000);

        // Invalidate queries
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "sioMasterDataQuery",
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

  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-hidden text-sm md:p-6">
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">
          Context Definitions View
        </div>
        <div className="flex items-center justify-end gap-4 ml-20">
          <IconButton onClick={handleAdd}>
            <PlusCircleIcon className="w-4 h-4" />
          </IconButton>
          <IconButton onClick={handleExport}>
            <ArrowDownTrayIcon className="w-4 h-4" />
          </IconButton>
          <IconButton>
            <FunnelIcon className="w-4 h-4" />
          </IconButton>
          <IconButton>
            <ArrowPathIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
      <div className="h-full overflow-auto border-[1px] dark:border-gray-700">
        <Paper sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={contextDefinitions}
            columns={columns}
            checkboxSelection
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
          />
        </Paper>
      </div>
      <ModalPopup
        heading="Context Definition Details"
        onClose={handleContextDefinitionDetailsDialogClose}
        openStatus={showContextDefinitionDetailsDialog}
        hasSubmit={false}
        size="large"
      >
        {selectedContextDefinition && (
          <div className="p-4">
            <p>
              <strong>Context ID:</strong>{" "}
              {selectedContextDefinition.CONTEXT_ID}
            </p>
            <p>
              <strong>Context Name:</strong>{" "}
              {selectedContextDefinition.CONTEXT_NAME}
            </p>
            <p>
              <strong>Definitions Type:</strong>{" "}
              {selectedContextDefinition.DEFINITIONS_TYPE}
            </p>
          </div>
        )}
      </ModalPopup>
      <ModalPopupMobile
        heading="Context Definition Details"
        onClose={handleContextDefinitionDetailsDialogClose}
        openStatus={showContextDefinitionDetailsDialog}
        hasSubmit={false}
        size="fullscreen"
      >
        {selectedContextDefinition && (
          <div className="p-4">
            <p>
              <strong>Context ID:</strong>{" "}
              {selectedContextDefinition.CONTEXT_ID}
            </p>
            <p>
              <strong>Context Name:</strong>{" "}
              {selectedContextDefinition.CONTEXT_NAME}
            </p>
            <p>
              <strong>Definitions Type:</strong>{" "}
              {selectedContextDefinition.DEFINITIONS_TYPE}
            </p>
          </div>
        )}
      </ModalPopupMobile>
      <ModalPopup
        heading="Search Observation Data"
        onClose={handleAddDialogClose}
        openStatus={showAddDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitAdd(handleAddFormSubmit)();
        }}
        size="large"
        showError
      >
        <form className="bg-[#ecf3f9] dark:bg-gray-600 grid gap-2.5 p-2.5">
          ok
        </form>
      </ModalPopup>
    </div>
  );
}

export default ContextDefinations;
