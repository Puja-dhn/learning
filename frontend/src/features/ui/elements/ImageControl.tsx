/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "../buttons";
import { ModalPopup } from "../popup";

interface IProps {
  imageSrc: string;
  className?: string;
}

const defaultProps = {
  className: "",
};
function ImageControl(props: IProps) {
  const { imageSrc, className } = props;
  const [openStatus, setOpenStatus] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <IconButton
          onClick={() => {
            setOpenStatus(true);
          }}
        >
          <img
            className={twMerge(`w-6 h-6 ${className}`)}
            src={imageSrc}
            alt="Quiz"
          />
        </IconButton>
      </div>
      <ModalPopup
        heading="Quiz Image"
        onClose={() => {
          setOpenStatus(false);
        }}
        openStatus={openStatus}
        hasSubmit={false}
        onSubmit={() => {}}
        size="fullscreen"
        showError
        hasError={false}
      >
        <div className="flex justify-center w-full h-full">
          <img className="h-full" src={imageSrc} alt="Quiz" />
        </div>
      </ModalPopup>
    </>
  );
}

ImageControl.defaultProps = defaultProps;
export default ImageControl;
