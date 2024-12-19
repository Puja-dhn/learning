import React from "react";
import { twMerge } from "tailwind-merge";
import { ITableColumn } from "../types";

interface IProps {
  tableColumns: ITableColumn[];
  tableData: any[];
  hasHeaderFixed?: boolean;
  hasColFixed?: boolean;
}

const defaultProps = {
  hasHeaderFixed: true,
  hasColFixed: false,
};

function SimpleTable(props: IProps) {
  const { tableColumns, tableData, hasHeaderFixed, hasColFixed } = props;
  const fixedHeaderClass = hasHeaderFixed ? " sticky top-0 " : "";
  const fixedHeaderColClass =
    hasColFixed && hasHeaderFixed
      ? " sticky left-0 top-0 z-[1] bg-gray-50 dark:bg-gray-700 dark:border-gray-700 "
      : "";
  const fixedColClass = hasColFixed
    ? " sticky left-0  bg-white dark:bg-gray-800 "
    : "";
  let rowIndex = 0;
  tableData.forEach((item) => {
    item.ROWINDEX = rowIndex;
    rowIndex += 1;
  });
  return (
    <table className="text-sm text-left text-gray-500 dark:text-gray-400 min-w-full">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {tableColumns.map((col, index) => (
            <th
              key={col.dbCol}
              className={twMerge(
                `${
                  col.minWidth
                } py-3 px-6  bg-gray-50 dark:bg-gray-700 ${fixedHeaderClass} ${
                  index <= 0 && fixedHeaderColClass
                }`,
              )}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr
            key={`${row.ROWINDEX}`}
            className="border-y-[1px] bg-white dark:bg-gray-800 dark:border-gray-700  "
          >
            {tableColumns.map((col, index) => (
              <td
                key={`${row.ROWINDEX}_${col.dbCol}`}
                className={`py-4 px-6 font-normal text-cyan-700 whitespace-nowrap dark:text-white ${
                  index <= 0 && fixedColClass
                } `}
              >
                {row[col.dbCol as keyof typeof tableData]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

SimpleTable.defaultProps = defaultProps;

export default SimpleTable;
