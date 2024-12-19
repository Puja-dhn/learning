import React from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  heading: string;
  summary: string;
  className?: string;
}

const defaultProps = {
  className: "",
};

function DataSummary(props: IProps) {
  const { heading, summary, className } = props;
  return (
    <div
      className={twMerge(
        `min-w-[50px] flex flex-col bg-[#ffffffc9] shadow-md hover:bg-blue-50 dark:bg-gray-600 dark:hover:bg-gray-700 ${className}`,
      )}
    >
      <h3 className="p-2.5 text-sm font-semibold text-center text-gray-500 dark:text-slate-100">
        {heading}
      </h3>
      <p className="p-2.5 h-[65px] overflow-hidden text-3xl font-semibold  text-center text-cyan-800 dark:text-slate-100">
        {summary}
      </p>
    </div>
  );
}

DataSummary.defaultProps = defaultProps;

export default DataSummary;
