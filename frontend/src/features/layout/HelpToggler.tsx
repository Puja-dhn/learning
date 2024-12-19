import React, { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

import IconButton from "../ui/buttons/IconButton";
import { ModalPopup } from "../ui/popup";
import UserManualPDF from "@/assets/test.pdf";

function HelpToggler() {
  const [status, setStatus] = useState(false);

  const handleDialogClose = () => {
    setStatus(false);
  };

  return (
    <>
      <IconButton className="p-0">
        <QuestionMarkCircleIcon
          className="w-5 h-5"
          onClick={() => {
            setStatus(true);
          }}
        />
      </IconButton>
      <ModalPopup
        heading="User Manual"
        onClose={handleDialogClose}
        openStatus={status}
        hasSubmit={false}
        onSubmit={() => {}}
        size="fullscreen"
        showError
        hasError={false}
      >
        <div className="flex justify-center w-full h-full">
          <iframe src={UserManualPDF} title="User Manual" className="w-full" />
        </div>
      </ModalPopup>
    </>
  );
}

export default HelpToggler;
