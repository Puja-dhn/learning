/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState } from "react";
import { VideoCameraIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";

import { IconButton } from "../buttons";
import { ModalPopup } from "../popup";

interface IProps {
  videoSrc: string;
  className?: string;
}

const defaultProps = {
  className: "",
};
function VideoControl(props: IProps) {
  const { videoSrc, className } = props;
  const [openStatus, setOpenStatus] = useState(false);
  const refVideo = useRef<HTMLVideoElement>(null);

  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <IconButton
          onClick={() => {
            setOpenStatus(true);
            if (refVideo && refVideo.current) {
              refVideo.current.play();
            }
          }}
        >
          <VideoCameraIcon
            className={twMerge(`w-5 h-5 text-cyan-700 ${className}`)}
          />
        </IconButton>
      </div>
      <ModalPopup
        heading="Quiz Video"
        onClose={() => {
          setOpenStatus(false);
          if (refVideo && refVideo.current) {
            refVideo.current.pause();
            refVideo.current.currentTime = 0;
          }
        }}
        openStatus={openStatus}
        hasSubmit={false}
        onSubmit={() => {}}
        size="fullscreen"
        showError
        hasError={false}
      >
        <div className="flex justify-center w-full h-full">
          <video
            ref={refVideo}
            controls
            controlsList="nodownload noremoteplayback noplaybackrate foobar"
            src={videoSrc}
          />
        </div>
      </ModalPopup>
    </>
  );
}

VideoControl.defaultProps = defaultProps;
export default VideoControl;
