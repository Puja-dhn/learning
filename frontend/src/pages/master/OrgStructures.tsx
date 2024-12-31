import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ModalPopup } from "@/features/ui/popup";
import useOrgStructureDataQuery from "@/features/master/hooks/useOrgStructureDataQuery";
import IOrgStructureList from "@/features/master/types/IOrgStructureList";
import IOrgStructureForm from "@/features/master/types/IOrgStructureList";
import {
  addOrgStructureData,
  updateOrgStructureData,
  getUsersData,
} from "@/features/master/services/orgstructure.services";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useQueryClient } from "react-query";
import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import { IOptionList } from "@/features/ui/types";

const OrgStructures: React.FC = () => {
  const [orgStructureData, setOrgStructureData] = useState<IOrgStructureList[]>(
    [],
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<IOrgStructureForm | null>(
    null,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [users, setUsers] = useState<IOptionList[]>([]);
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const queryClient = useQueryClient();

  const initialFilterValues: IOrgStructureForm = {
    id: "",
    name: "",
    parent_id: "",
    category: "",
    head_user_id: "",
    is_deleted: false,
  };

  useEffect(() => {
    const formData: Record<string, string> = { id: "3" };
    const downloadPermitToWorkPDF = async (
      formData: Record<string, string>,
    ) => {
      try {
        const response: AxiosResponse<string> = await http.post(
          "/ptw/get-permit-to-work",
          formData,
        );
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "permit-to-work.pdf");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        console.log("PDF downloaded successfully");
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
    };
    downloadPermitToWorkPDF(formData);
  }, []);

  const [filterList, setFilterList] =
    useState<IOrgStructureForm>(initialFilterValues);
  const { data: orgStructureListData, isLoading: isOrgStructureDataLoading } =
    useOrgStructureDataQuery(filterList);

  useEffect(() => {
    if (isOrgStructureDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }
    getUsersData().then((response) => {
      if (response.data) {
        console.log(
          "response.data.historyUserData",
          response.data.historyUserData,
        );
        setUsers([...response.data.historyUserData]);
      }
    });

    if (orgStructureListData) {
      setOrgStructureData([...orgStructureListData.historyOrgStructureData]);
    }
  }, [orgStructureListData, isOrgStructureDataLoading]);

  const getChildren = (parentId: string) => {
    return orgStructureData.filter(
      (node) => node.parent_id === parentId && !node.is_deleted,
    );
  };
  const handleEdit = (node: IOrgStructureForm) => {
    setCurrentNode(node);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddNew = (parentId: string) => {
    setCurrentNode({ ...initialFilterValues, parent_id: parentId });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setOrgStructureData((prevData) =>
      prevData.filter((node) => node.id !== id),
    );
  };

  const handleToggleExpand = (id: string) => {
    setExpandedNodes((prevExpandedNodes) => {
      const newExpandedNodes = new Set(prevExpandedNodes);
      if (newExpandedNodes.has(id)) {
        newExpandedNodes.delete(id);
      } else {
        newExpandedNodes.add(id);
      }
      return newExpandedNodes;
    });
  };

  const handleSave = (node: IOrgStructureForm) => {
    setOrgStructureData((prevData) => {
      if (isEditMode) {
        updateOrgStructureData(node)
          .then(() => {
            alertToast.show("success", "Data updated successfully", true, 2000);
            queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey[0] === "orgStructureDataQuery",
            });
          })
          .catch((err: any) => {
            if (err.response && err.response.status) {
              alertToast.show("warning", err.response.data.errorMessage, true);
            }
          })
          .finally(() => {
            loader.hide();
          });
        return prevData.map((item) => (item.id === node.id ? node : item));
      } else {
        loader.show();
        addOrgStructureData(node)
          .then(() => {
            alertToast.show("success", "Data added successfully", true, 2000);
            queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey[0] === "orgStructureDataQuery",
            });
          })
          .catch((err: any) => {
            if (err.response && err.response.status) {
              alertToast.show("warning", err.response.data.errorMessage, true);
            }
          })
          .finally(() => {
            loader.hide();
          });
        return [...prevData, { ...node, id: `${Date.now()}` }];
      }
    });
    setIsModalOpen(false);
  };

  const TreeNode: React.FC<{
    node: IOrgStructureForm;
    children: IOrgStructureForm[];
  }> = ({ node, children }) => {
    const isExpanded = expandedNodes.has(node.id);
    return (
      <div style={{ marginLeft: 20 }}>
        <div className="flex items-center gap-2">
          <span
            onClick={() => handleToggleExpand(node.id)}
            style={{ cursor: "pointer", fontSize: "1.5rem", lineHeight: 1 }}
            className="transition-transform transform hover:scale-110"
          >
            {isExpanded ? "-" : "+"}
          </span>
          <strong
            onClick={() => handleToggleExpand(node.id)}
            style={{ cursor: "pointer", fontWeight: "bold" }}
            className="duration-200 transition-color hover:text-blue-600"
          >
            {node.name}
          </strong>
          <div className="flex items-center gap-4 ml-auto">
            <IconButton onClick={() => handleEdit(node)}>
              <PencilIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
            </IconButton>
            <IconButton onClick={() => handleAddNew(node.id)}>
              <PlusIcon className="w-5 h-5 text-gray-700 hover:text-green-600" />
            </IconButton>
            {/* <IconButton onClick={() => handleDelete(node.id)}>
              <TrashIcon className="w-5 h-5 text-gray-700 hover:text-red-600" />
            </IconButton> */}
          </div>
        </div>
        {isExpanded && children.length > 0 && (
          <div className="pl-6">
            {children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                children={getChildren(child.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const Modal: React.FC<{
    node: IOrgStructureForm;
    onSave: (node: IOrgStructureForm) => void;
    onClose: () => void;
  }> = ({ node, onSave, onClose }) => {
    const [formData, setFormData] = useState(node);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = () => {
      if (!formData.name || !formData.head_user_id) {
        alert("Please fill out all required fields.");
        return;
      }
      onSave(formData);
    };

    return (
      <ModalPopup
        heading={isEditMode ? "Edit Node" : "Add Node"}
        onClose={onClose}
        openStatus={isModalOpen}
        hasSubmit
        onSubmit={handleSubmit}
        size="medium"
        showError
      >
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="w-full p-2 text-black border rounded-md input-box"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <label className="block text-sm font-medium text-gray-700">
            Department Head
          </label>
          <select
            className="w-full p-2 mt-2 text-black border rounded-md input-box"
            name="head_user_id"
            value={formData.head_user_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Dept. Head</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <label className="flex items-center mt-2 space-x-2 d-none">
            <input
              className="d-none"
              type="checkbox"
              name="is_deleted"
              checked={formData.is_deleted}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  is_deleted: e.target.checked,
                }))
              }
              hidden
            />
            <span></span>
          </label>
        </div>
      </ModalPopup>
    );
  };

  const rootNodes = orgStructureData.filter((node) => !node.parent_id);

  return (
    <div className="relative flex flex-col w-full h-full p-2 overflow-auto">
      <h3 className="text-lg font-semibold text-gray-700">
        Org Structure Tree
      </h3>
      {rootNodes.map((rootNode) => (
        <TreeNode
          key={rootNode.id}
          node={rootNode}
          children={getChildren(rootNode.id)}
        />
      ))}
      {isModalOpen && currentNode && (
        <Modal
          node={currentNode}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrgStructures;
