import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef,GridFilterModel } from "@mui/x-data-grid";
import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import ModalPopupMobile from "@/features/ui/popup/ModalPopupMobile";
import { DropdownList, TextArea, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import * as XLSX from "xlsx";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import IContextForm from "@/features/master/types/IContextForm";
import IContextList from "@/features/master/types/IContextList";
import { addContextData, updateContextData } from "@/features/master/services/master.services";
import { Button } from "@/features/ui/buttons";
import * as Yup from "yup";
import useContextDataQuery from "@/features/master/hooks/useContextDataQuery";
import { values } from "lodash";


// Form validation schema
const formSchema = Yup.object().shape({
  context_name: Yup.string().required("Department is required"),
  definitions_type: Yup.string().required("Area is required"),
});

const initialAddValues: IContextForm = {
  context_id: "",
  context_name: "",
  definitions_type: "",
};

const initialfilterValues: IContextList = {
  context_id: "",
  context_name: "",
  definitions_type: "",
};
interface IContextTeamData {
  historyContextData: IContextList[];
}


function ContextDefinations() {
  const [ContextForm, setContextForm] = useState<IContextForm[]>([]);
  const [selectedContextForm, setSelectedContextForm] = useState<IContextForm | null>(null);
  const [showContextFormDialog, setShowContextFormDialog] = useState(false);
  const [showContextFormViewDialog, setShowContextFormViewDialog] = useState(false);
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const queryClient = useQueryClient();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);

  const [filterList, setFilterList] = useState<IContextList>(initialfilterValues);
  const [teamData, setTeamData] = useState<IContextTeamData>({ historyContextData: [] });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const {
    data: contextListData,
    isLoading: isContextDataLoading,
    isError: isContextDataError,
  } = useContextDataQuery(filterList);

  useEffect(() => {
    if (isContextDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }
    if (!isContextDataLoading && !isContextDataError && contextListData) {
      setTeamData({ historyContextData: [...contextListData.historyContextData] });
    }
  }, [contextListData, isContextDataLoading, isContextDataError]);

  // Handle exporting to Excel
  const handleExport = () => {
    if (ContextForm.length === 0) {
      alertToast.show("warning", "No data available to export", true);
      return;
    }
    const rows = ContextForm.map((contextForms) => ({
      ContextID: contextForms.context_id,
      ContextName: contextForms.context_name,
      DefinitionsType: contextForms.definitions_type,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ContextDefinitions");
    XLSX.writeFile(wb, "contextdefinitions.xlsx");
  };

  // Open edit dialog and set selected context form
  const handleContextFormDialogOpen = (row: IContextForm) => {
    setSelectedContextForm(row);   
    setShowContextFormDialog(true);
  };

  const handleContextFormViewDialogOpen = (row: IContextForm) => {
    setSelectedContextForm(row);
    setShowContextFormViewDialog(true);
  };

  const handleContextFormDialogClose = () => {
    setSelectedContextForm(null);
    resetEdit(initialAddValues);
    setShowContextFormDialog(false);
  };

  const handleContextFormViewDialogClose = () => {
    setSelectedContextForm(null);
    resetEdit(initialAddValues);
    setShowContextFormViewDialog(false);
  };
  

  const columns: GridColDef[] = [
    {
      field: "view",
      headerName: "View",
      width: 50,
      renderCell: (params) => (
        <IconButton onClick={() => handleContextFormViewDialogOpen(params.row)}>
          <EyeIcon className="w-4 h-4" />
        </IconButton>
      )
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 50,
      renderCell: (params) => (
        <IconButton onClick={() => handleContextFormDialogOpen(params.row)}>
          <PencilIcon className="w-4 h-4" />
        </IconButton>
      )
    },
    { field: "context_id", headerName: "Context ID", width: 150 },
    { field: "context_name", headerName: "Context Name", width: 200 },
    { field: "definitions_type", headerName: "Definitions Type", width: 200 },
  ];

  // Initialize the form hook for editing context data
  const {
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    control: controlEdit,
    formState: formStateEdit,
  } = useForm<IContextForm>({
    defaultValues: selectedContextForm || initialAddValues,
  });
  useEffect(() => {
    if (selectedContextForm) {
      resetEdit(selectedContextForm); 
    } else {
      resetEdit(initialAddValues);
    }
  }, [selectedContextForm, resetEdit]); 

  const definitionTypes = [
    { id: "LOG_SEVERITY", name: "LOG SEVERITY" },
    { id: "LOG_CATEGORY", name: "LOG CATEGORY" },
    { id: "LOG_STATUS", name: "LOG STATUS" },
    { id: "GENDER", name: "GENDER" },
    { id: "EMPLOYEE_TYPE", name: "EMPLOYEE TYPE" }
  ];

  const handleAdd = () => {
    resetEdit({ ...initialAddValues });
    setShowContextFormDialog(true);
  };

  const handleAddFormSubmit: SubmitHandler<IContextForm> = (values) => {
    loader.show();
    if(selectedContextForm){
      updateContextData(values)
      .then(() => {
        alertToast.show("success", "Data updated successfully", true, 2000);
        resetEdit(initialAddValues);
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "contexDataQuery" });
      })
      .catch((err) => {
        if (err.response && err.response.status) {
          alertToast.show("warning", err.response.data.errorMessage, true);
        }
      })
      .finally(() => {
        loader.hide();
      });
    }else{
    addContextData(values)
      .then(() => {
        alertToast.show("success", "Data added successfully", true, 2000);
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "contexDataQuery" });
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
          {/* <IconButton>
            <FunnelIcon className="w-4 h-4" />
          </IconButton> */}
          <IconButton>
            <ArrowPathIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
      <div className="h-full overflow-auto border-[1px] dark:border-gray-700">
        <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
        rows={teamData.historyContextData}
        columns={columns}
        getRowId={(row) =>
          row.context_id || Math.random().toString(36).substring(2)
        }
        checkboxSelection
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
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
      {/* Edit Modal */}
      <ModalPopup
        heading="Context Definition Details"
        onClose={handleContextFormViewDialogClose}
        openStatus={showContextFormViewDialog}
        hasSubmit={false}
        size="large"
      >
        {selectedContextForm && (
         <div className="relative flex flex-col w-full h-full p-2 overflow-auto">
         <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
           <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
             <form className="w-[100%] gap-4 justify-evenly">
               <div className="grid grid-cols-1 md:grid-cols-3">
                 <div className="p-1" style={{ color: "#252323" }}>
                 <strong>Context ID:</strong> {selectedContextForm.context_id}                 
                 </div>
                 <div className="p-1" style={{ color: "#252323" }}>
                 <strong>Context Name:</strong> {selectedContextForm.context_name}
                 </div>
                 <div className="p-1" style={{ color: "#252323" }}>
                 <strong>Definitions Type:</strong> {selectedContextForm.definitions_type}
                 </div>
               </div>
             </form>
           </div>
         </div>
       </div>
        
        )}
      </ModalPopup>
     
     {/* Add/Edit Form Modal */}
     <ModalPopup
        heading="Context Definitions Details"
        onClose={handleContextFormDialogClose}
        openStatus={showContextFormDialog}
        hasSubmit
        onSubmit={() => {
          handleSubmitEdit(handleAddFormSubmit)();
        }}
        size="large"
        showError
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto">
          <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
            <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
              <form className="w-[100%] gap-4 justify-evenly">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-1">
                    <TextField
                      name="context_name"
                      label="Context Name"
                      control={controlEdit}
                    />
                  </div>
                  <div className="p-1">
                    <TextField
                      name="definitions_type"
                      label="Definitions Type"
                      control={controlEdit}
                      //optionList={[{ id: "", name: "Select Definitions Type" }, ...definitionTypes]}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
}

export default ContextDefinations;
