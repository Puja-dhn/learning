import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";

import { IOptionList } from "@/features/ui/types";

ChartJS.register(
  ArcElement,
  CategoryScale,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend,
);

function PtwDashboard() {
  const { t } = useTranslation(["voc/issuelist", "common"]);
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const themeState = useAppSelector(({ theme }) => theme, shallowEqual);
  const [locationId, setLocationId] = useState<number>(-2);
  const [issueCategory, setIssueCategory] = useState<string>("PDI");

  const [defectType, setDefectType] = useState<IOptionList[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;

  let currentYear = currentDate.getFullYear();
  let nextYear = currentYear + 1;
  if (month < 4) {
    currentYear -= 1;
    nextYear = currentYear + 1;
  }
  const [currYear, setCurrYear] = useState<number>(currentYear);
  const [nexYear, setNexYear] = useState<number>(nextYear);
  const [currMonth, setCurrMonth] = useState<number>(month);

  const adjustGridClass = "grid-rows-[auto_auto_1fr]";

  const appModePaddingClass =
    globalState.appMode === "FullScreen" ? "p-0 px-2.5 " : " p-2.5  pb-0 ";

  const optionsTrendCPAMonth = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Issue List FY ${currYear}-${nexYear.toString().substr(-2)}`,
        color: themeState.isDarkMode ? "#095e7d" : "#577490",
      },
      datalabels: {
        color: themeState.isDarkMode ? "#095e7d" : "black",
        display: false,
      },
    },

    scales: {
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const dataTrendCPAMonth = {
    labels: [],
    datasets: [
      {
        label: "Total",
        data: [],
        backgroundColor: "#528dbd",
      },
      {
        label: "Closed",
        data: [],
        backgroundColor: "#b8db6f",
      },

      {
        label: "Pending",
        data: [],
        backgroundColor: "#f37d08",
      },
    ],
  };

  const optionsTrendCPAFic = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Factory Wise Issue List",
        color: themeState.isDarkMode ? "#095e7d" : "#577490",
      },
      datalabels: {
        color: themeState.isDarkMode ? "#095e7d" : "black",
        display: false,
      },
    },

    scales: {
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const dataTrendCPAFic = {
    labels: [],
    datasets: [
      {
        label: "Assigned",
        data: [],
        backgroundColor: "#528dbd",
      },
      {
        label: "Closed",
        data: [],
        backgroundColor: "#b8db6f",
      },

      {
        label: "Pending",
        data: [],
        backgroundColor: "#f37d08",
      },
    ],
  };

  const optionsTrendCPATeam = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Team Wise Issue List",
        color: themeState.isDarkMode ? "#095e7d" : "#577490",
      },
      datalabels: {
        color: themeState.isDarkMode ? "#095e7d" : "black",
        display: false,
      },
    },

    scales: {
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    // onClick: (e: any, activeEls: any) => {
    //   const { datasetIndex } = activeEls[0];
    //   const dataIndex = activeEls[0].index;
    //   const datasetLabel = e.chart.data.datasets[datasetIndex].label;
    //   const label = e.chart.data.labels[dataIndex];
    //   const chartTitleText = e.chart.titleBlock.options.text;
    //   setCPADataModal({ status: true });
    //   setCPAGraphSectionData({
    //     heading: `${datasetLabel} ${chartTitleText}`,
    //     type: "teamwise",
    //     status: datasetLabel,
    //     month: "",
    //     fromDate,
    //     toDate,
    //     fic: "",
    //     team: label,
    //   });
    //   getCPAGraphData(
    //     "teamwise",
    //     datasetLabel,
    //     "",
    //     "",
    //     label,
    //     fromDate,
    //     toDate,
    //     locationId,
    //     issueCategory,
    //     currYear,
    //     currMonth,
    //   ).then((response) => {
    //     if (response.status === 200) {
    //       const historyLogCPAData = [...response.data.historyLogCPAData];
    //       setCPAList({
    //         historyLogCPAData,
    //       });
    //     }
    //   });
    // },
  };

  const dataTrendCPATeam = {
    labels: [],
    datasets: [
      {
        label: "Assigned",
        data: [],
        backgroundColor: "#528dbd",
      },
      {
        label: "Closed",
        data: [],
        backgroundColor: "#b8db6f",
      },

      {
        label: "Pending",
        data: [],
        backgroundColor: "#f37d08",
      },
    ],
  };

  // const optionsTrendCPAOwnTeam = {
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: "Own Team Issue List",
  //       color: themeState.isDarkMode ? "#095e7d" : "#577490",
  //     },
  //   },
  //   scales: {
  //     y: {
  //       ticks: {
  //         font: {
  //           size: 11,
  //         },
  //       },
  //     },
  //     x: {
  //       ticks: {
  //         font: {
  //           size: 11,
  //         },
  //       },
  //     },
  //   },
  //   onClick: (e: any, activeEls: any) => {
  //     const { datasetIndex } = activeEls[0];
  //     const dataIndex = activeEls[0].index;
  //     const datasetLabel = e.chart.data.datasets[datasetIndex].label;
  //     const label = e.chart.data.labels[dataIndex];
  //     const chartTitleText = e.chart.titleBlock.options.text;
  //     setCPADataModal({ status: true });
  //     setCPAGraphSectionData({
  //       heading: `${datasetLabel} ${chartTitleText}`,
  //       type: "ownteam",
  //       status: datasetLabel,
  //       month: "",
  //       fromDate,
  //       toDate,
  //       fic: "",
  //       team: label,
  //     });
  //     getCPAGraphData(
  //       "ownteams",
  //       datasetLabel,
  //       "",
  //       "",
  //       label,
  //       fromDate,
  //       toDate,
  //       locationId,
  //     ).then((response) => {
  //       if (response.status === 200) {
  //         const historyLogCPAData = [...response.data.historyLogCPAData];
  //         setCPAList({
  //           historyLogCPAData,
  //         });
  //       }
  //     });
  //   },
  // };

  // const dataTrendCPAOwnTeam = {
  //   labels: [
  //     ...teamData.ownTeamNameList.map((row) =>
  //       row.length > 18 ? row.substring(0, 18) : row,
  //     ),
  //   ],
  //   datasets: [
  //     {
  //       label: "Assigned",
  //       data: [...teamData.ownTeamAssignedCPA],
  //       backgroundColor: "#36a2eb",
  //     },
  //     {
  //       label: "Closed",
  //       data: [...teamData.ownTeamCloseCPA],
  //       backgroundColor: "#4bc0c0",
  //     },

  //     {
  //       label: "Pending",
  //       data: [...teamData.ownTeamPendingCPA],
  //       backgroundColor: "#ff6384",
  //     },
  //   ],
  // };

  const optionsTrendDayWiseIssue = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Day Wise Issue List",
        color: themeState.isDarkMode ? "#095e7d" : "#577490",
      },
      datalabels: {
        color: themeState.isDarkMode ? "#095e7d" : "black",
        display: false,
        // align: "center", // Aligning the labels at the top center of the bars
        // anchor: "end", // Anchor at the top of the bars
        font: {
          size: 10, // Font size for the labels
        },
        formatter: (value: any) => {
          return value; // Directly showing the count value
        },
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    // onClick: (e: any, activeEls: any) => {
    //   const { datasetIndex } = activeEls[0];
    //   const dataIndex = activeEls[0].index;
    //   const datasetLabel = e.chart.data.datasets[datasetIndex].label;
    //   const label = e.chart.data.labels[dataIndex];
    //   const chartTitleText = e.chart.titleBlock.options.text;
    //   setCPADataModal({ status: true });
    //   setCPAGraphSectionData({
    //     heading: `${datasetLabel} ${chartTitleText}`,
    //     type: "daywiseissue",
    //     status: datasetLabel,
    //     month: label,
    //     fromDate,
    //     toDate,
    //     fic: "",
    //     team: "",
    //   });
    //   getCPAGraphData(
    //     "daywiseissue",
    //     datasetLabel,
    //     label,
    //     "",
    //     "",
    //     fromDate,
    //     toDate,
    //     locationId,
    //     issueCategory,
    //     currYear,
    //     currMonth,
    //   ).then((response) => {
    //     if (response.status === 200) {
    //       const historyLogCPAData = [...response.data.historyLogCPAData];
    //       setCPAList({
    //         historyLogCPAData,
    //       });
    //     }
    //   });
    // },
  };

  // const optionsTrendDayWiseIssue = {
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: "Day Wise Issue List",
  //       color: themeState.isDarkMode ? "#095e7d" : "#577490",
  //     },
  //     datalabels: {
  //       color: themeState.isDarkMode ? "#095e7d" : "black",
  //       display: true,
  //     },
  //   },
  //   datalabels: {
  //     color: themeState.isDarkMode ? "#095e7d" : "black",
  //     display: true,
  //     align: "end", // This aligns the label at the top of the bar
  //     anchor: "end", // This makes sure the label is at the top of the bar
  //     font: {
  //       size: 12, // You can change this value based on your preference
  //       weight: "bold",
  //     },
  //     formatter: (value: any) => {
  //       return value; // This will show the count (you can modify this if needed)
  //     },
  //   },
  //   scales: {
  //     y: {
  //       ticks: {
  //         font: {
  //           size: 11,
  //         },
  //       },
  //     },
  //     x: {
  //       ticks: {
  //         font: {
  //           size: 11,
  //         },
  //       },
  //     },
  //   },
  //   onClick: (e: any, activeEls: any) => {
  //     const { datasetIndex } = activeEls[0];
  //     const dataIndex = activeEls[0].index;
  //     const datasetLabel = e.chart.data.datasets[datasetIndex].label;
  //     const label = e.chart.data.labels[dataIndex];
  //     const chartTitleText = e.chart.titleBlock.options.text;
  //     setCPADataModal({ status: true });
  //     setCPAGraphSectionData({
  //       heading: `${datasetLabel} ${chartTitleText}`,
  //       type: "daywiseissue",
  //       status: datasetLabel,
  //       month: label,
  //       fromDate,
  //       toDate,
  //       fic: "",
  //       team: "",
  //     });
  //     getCPAGraphData(
  //       "daywiseissue",
  //       datasetLabel,
  //       label,
  //       "",
  //       "",
  //       fromDate,
  //       toDate,
  //       locationId,
  //       issueCategory,
  //       currYear,
  //       currMonth,
  //     ).then((response) => {
  //       if (response.status === 200) {
  //         const historyLogCPAData = [...response.data.historyLogCPAData];
  //         setCPAList({
  //           historyLogCPAData,
  //         });
  //       }
  //     });
  //   },
  // };

  const dataTrendDayWiseIssue = {
    labels: [],
    datasets: [
      {
        label: "Total",
        data: [],
        backgroundColor: "#528dbd",
      },
      {
        label: "Closed",
        data: [],
        backgroundColor: "#b8db6f",
      },

      {
        label: "Pending",
        data: [],
        backgroundColor: "#f37d08",
      },
    ],
  };

  return (
    <div
      className={`relative w-full h-full grid ${adjustGridClass} ${appModePaddingClass} gap-2.5  overflow-auto `}
    >
      <div className="relative w-full h-full overflow-auto ">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2.5 mt-[10px]">
          <div className="h-[300px]  flex justify-between border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2 bg-gradient-to-b from-[#f1f1f1] to-[#ffffff]   dark:bg-gray-600 overflow-hidden">
            <Bar
              options={optionsTrendDayWiseIssue}
              data={dataTrendDayWiseIssue}
            />
          </div>
          <div className="h-[300px] flex justify-between border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2 bg-gradient-to-b from-[#f1f1f1] to-[#ffffff] dark:bg-[#c8dec8] overflow-hidden">
            <Bar options={optionsTrendCPAMonth} data={dataTrendCPAMonth} />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2.5 mt-[10px]">
          <div className="h-[350px]   border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2 bg-gradient-to-b from-[#f1f1f1] to-[#ffffff]   dark:bg-gray-600 overflow-hidden">
            <Bar options={optionsTrendCPAFic} data={dataTrendCPAFic} />
          </div>
          <div className="h-[350px] flex justify-between border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2 bg-gradient-to-b from-[#f1f1f1] to-[#ffffff]  dark:bg-[#c8dec8] overflow-hidden">
            <Bar options={optionsTrendCPATeam} data={dataTrendCPATeam} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PtwDashboard;
