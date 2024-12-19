import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import HomeToggler from "../layout/home/HomeToggler";
import { IconButton } from "../ui/buttons";

interface IProps {
  children: React.ReactNode;
  screen: string;
}

interface IState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    const { hasError } = this.state;
    const { children, screen } = this.props;
    if (hasError) {
      return (
        <div className="relative w-full h-full  flex justify-center items-center overflow-auto p-2.5">
          <div className="w-[450px] flex flex-col gap-4 p-5 text-center shadow-md rounded-md bg-[#fcfdff96] dark:bg-gray-600">
            <div className="flex justify-center items-center text-center">
              <InformationCircleIcon className="h-12 w-12 text-red-400 dark:text-red-300" />
            </div>
            <h3 className="text-lg font-semibold text-sky-800 dark:text-teal-100 ">
              {screen} Crashed
            </h3>
            <p className="text-md font-normal text-gray-500 dark:text-slate-300">
              Please Click on the Home button, or Refresh the page. In case
              issue persist, contact Application support for help
            </p>
            <div className="flex justify-evenly mt-4">
              <HomeToggler hasLabel className="bg-cyan-400" />
              <IconButton
                onClick={() => {
                  window.location.reload();
                }}
              >
                Refresh Page
              </IconButton>
            </div>
          </div>
        </div>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
