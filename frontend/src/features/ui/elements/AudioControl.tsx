/* eslint-disable jsx-a11y/media-has-caption */
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";
import React, { useRef, useState } from "react";

import { IconButton } from "../buttons";

interface IProps {
  audioSrc: string;
  className?: string;
}

const defaultProps = {
  className: "",
};
function AudioControl(props: IProps) {
  const { audioSrc, className } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const refAudio = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (isPlaying && refAudio && refAudio.current) {
      refAudio.current.pause();
    } else {
      refAudio.current?.play();
    }
    setIsPlaying((oldState) => !oldState);
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <IconButton onClick={togglePlayPause}>
        {!isPlaying && (
          <PlayCircleIcon
            className={twMerge(`w-5 h-5 text-cyan-700 ${className}`)}
          />
        )}
        {isPlaying && (
          <PauseCircleIcon
            className={twMerge(`w-5 h-5 text-amber-700 ${className}`)}
          />
        )}
      </IconButton>
      <audio ref={refAudio} src={audioSrc} />
    </div>
  );
}

AudioControl.defaultProps = defaultProps;
export default AudioControl;
