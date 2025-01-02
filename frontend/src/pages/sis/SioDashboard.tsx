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
import useSIOMasterDataQuery from "@/features/sis/hooks/useSIOMasterDataQuery";
import useSIODashboardQuery from "@/features/sis/hooks/useSIODashboardQuery";
import ISIODashboardData from "@/features/sis/types/sis/ISIODashboardData";

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

function SioDashboard() {
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

  const [departments, setDepartments] = useState<IOptionList[]>([]);

  const [department, setDepartment] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  const [teamData, setTeamData] = useState<ISIODashboardData>({
    currMonth: "Current Month",
    currFYear: 0,
    monthNameList: [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ],
    monthWiseCPA: [],
    monthWiseTotalCPAList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthWisePendingCPAList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthWiseCloseCPAList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ficNameList: [],
    ficWiseCPA: [],
    ficWiseAssignedCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ficWisePendingCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ficWiseCloseCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    teamNameList: [],
    teamWiseCPA: [],
    teamWiseAssignedCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    teamWisePendingCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    teamWiseCloseCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ownTeamNameList: [],
    ownTeamCPA: [],
    ownTeamAssignedCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ownTeamPendingCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ownTeamCloseCPA: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dayList: [],
    dayWiseIssue: [],
    dayWiseAssignedIssue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dayWisePendingIssue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dayWiseCloseIssue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  const adjustGridClass = "grid-rows-[auto_auto_1fr]";

  const appModePaddingClass =
    globalState.appMode === "FullScreen" ? "p-0 px-2.5 " : " p-2.5  pb-0 ";

  const {
    data: sioMasterData,
    isLoading: isSIOMasterDataLoading,
    isError: isSIOMasterDataError,
  } = useSIOMasterDataQuery();

  useEffect(() => {
    if (isSIOMasterDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isSIOMasterDataLoading && isSIOMasterDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isSIOMasterDataLoading && !isSIOMasterDataError && sioMasterData) {
      const historySIOMasterData = [sioMasterData.historySIOMasterData];

      setDepartments(historySIOMasterData[0].DEPARTMENT);
    }
  }, [sioMasterData, isSIOMasterDataLoading, isSIOMasterDataError]);

  const {
    data: dashboardData,
    isLoading: dashboardeDataLoading,
    isError: dashboardeDataError,
  } = useSIODashboardQuery(+department, fromDate, toDate);

  useEffect(() => {
    if (dashboardeDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!dashboardeDataLoading && dashboardeDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!dashboardeDataLoading && !dashboardeDataError && dashboardData) {
      // on team change, calculate the team data and set tema data state

      // if (globalState && globalState.teamId >= 0) {
      const currTeamData: ISIODashboardData = {
        ...dashboardData,
        monthNameList: [],
        monthWiseTotalCPAList: [],
        monthWisePendingCPAList: [],
        monthWiseCloseCPAList: [],
        ficNameList: [],
        ficWiseAssignedCPA: [],
        ficWisePendingCPA: [],
        ficWiseCloseCPA: [],
        teamNameList: [],
        teamWiseAssignedCPA: [],
        teamWisePendingCPA: [],
        teamWiseCloseCPA: [],
        ownTeamNameList: [],
        ownTeamAssignedCPA: [],
        ownTeamPendingCPA: [],
        ownTeamCloseCPA: [],
        dayList: [],
        dayWiseAssignedIssue: [],
        dayWisePendingIssue: [],
        dayWiseCloseIssue: [],
      };

      // if (cpaDashboardData.monthWiseCPA.length > 0) {
      //   cpaDashboardData.monthWiseCPA.forEach((item) => {
      //     currTeamData.monthNameList.push(item.NAME);
      //     currTeamData.monthWiseTotalCPAList.push(item.DATA1);
      //   });
      // }
      // if (cpaDashboardData.monthWiseCPA.length > 0) {
      //   cpaDashboardData.monthWiseCPA.forEach((item) => {
      //     currTeamData.monthWisePendingCPAList.push(item.DATA2);
      //   });
      // }
      // if (cpaDashboardData.monthWiseCPA.length > 0) {
      //   cpaDashboardData.monthWiseCPA.forEach((item) => {
      //     currTeamData.monthWiseCloseCPAList.push(item.DATA3);
      //   });
      // }
      // // fic wise cpa
      // if (cpaDashboardData.ficWiseCPA.length > 0) {
      //   cpaDashboardData.ficWiseCPA.forEach((item) => {
      //     currTeamData.ficNameList.push(item.NAME);
      //     currTeamData.ficWiseAssignedCPA.push(item.DATA1);
      //   });
      // }
      // if (cpaDashboardData.ficWiseCPA.length > 0) {
      //   cpaDashboardData.ficWiseCPA.forEach((item) => {
      //     currTeamData.ficWisePendingCPA.push(item.DATA2);
      //   });
      // }
      // if (cpaDashboardData.ficWiseCPA.length > 0) {
      //   cpaDashboardData.ficWiseCPA.forEach((item) => {
      //     currTeamData.ficWiseCloseCPA.push(item.DATA3);
      //   });
      // }
      // // team wise cpa
      // if (cpaDashboardData.teamWiseCPA.length > 0) {
      //   cpaDashboardData.teamWiseCPA.forEach((item) => {
      //     currTeamData.teamNameList.push(item.NAME);
      //     currTeamData.teamWiseAssignedCPA.push(item.DATA1);
      //   });
      // }
      // if (cpaDashboardData.teamWiseCPA.length > 0) {
      //   cpaDashboardData.teamWiseCPA.forEach((item) => {
      //     currTeamData.teamWisePendingCPA.push(item.DATA2);
      //   });
      // }
      // if (cpaDashboardData.teamWiseCPA.length > 0) {
      //   cpaDashboardData.teamWiseCPA.forEach((item) => {
      //     currTeamData.teamWiseCloseCPA.push(item.DATA3);
      //   });
      // }

      // // own team wise cpa
      // if (cpaDashboardData.ownTeamCPA.length > 0) {
      //   cpaDashboardData.ownTeamCPA.forEach((item) => {
      //     currTeamData.ownTeamNameList.push(item.NAME);
      //     currTeamData.ownTeamAssignedCPA.push(item.DATA1);
      //   });
      // }
      // if (cpaDashboardData.ownTeamCPA.length > 0) {
      //   cpaDashboardData.ownTeamCPA.forEach((item) => {
      //     currTeamData.ownTeamPendingCPA.push(item.DATA2);
      //   });
      // }
      // if (cpaDashboardData.ownTeamCPA.length > 0) {
      //   cpaDashboardData.ownTeamCPA.forEach((item) => {
      //     currTeamData.ownTeamCloseCPA.push(item.DATA3);
      //   });
      // }
      // // day wise issue
      // if (cpaDashboardData.dayWiseIssue.length > 0) {
      //   cpaDashboardData.dayWiseIssue.forEach((item) => {
      //     currTeamData.dayList.push(item.NAME);
      //     currTeamData.dayWiseAssignedIssue.push(item.DATA1);
      //   });
      // }
      // if (cpaDashboardData.dayWiseIssue.length > 0) {
      //   cpaDashboardData.dayWiseIssue.forEach((item) => {
      //     currTeamData.dayWisePendingIssue.push(item.DATA2);
      //   });
      // }
      // if (cpaDashboardData.dayWiseIssue.length > 0) {
      //   cpaDashboardData.dayWiseIssue.forEach((item) => {
      //     currTeamData.dayWiseCloseIssue.push(item.DATA3);
      //   });
      // }
      setTeamData({
        ...currTeamData,
      });
    }
  }, [dashboardData, dashboardeDataLoading, dashboardeDataError]);

  const optionsTrendCPAMonth = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "SIOs (YTD)",
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
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "",
        data: [120, 130, 150, 170, 190, 200, 210, 220, 240, 250, 260, 300],
        backgroundColor: "#528dbd",
      },
    ],
  };

  const optionsTrendCPAFic = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Department-wise (Open/Closed/Overdue)",
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
    labels: ["EHS", "Maintenance"],
    datasets: [
      {
        label: "Open",
        data: [50, 60, 45],
        backgroundColor: "#528dbd",
      },
      {
        label: "Closed",
        data: [40, 50, 35],
        backgroundColor: "#b8db6f",
      },

      {
        label: "Overdue",
        data: [10, 10, 10],
        backgroundColor: "#f37d08",
      },
    ],
  };

  const optionsTrendCPATeam = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Department-wise Closure (YTD)",
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
    labels: ["EHS", "Maintenance"],
    datasets: [
      {
        label: "Closed",
        data: [50, 60],
        backgroundColor: "#b8db6f",
      },

      {
        label: "Overdue",
        data: [40, 50],
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
        text: "Department SIOs: Target vs. Actual (MTD)",
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
    labels: ["EHS", "Maintenance"],
    datasets: [
      {
        label: "Target",
        data: [50, 60],
        backgroundColor: "#528dbd",
      },
      {
        label: "Actual",
        data: [40, 50],
        backgroundColor: "#b8db6f",
      },
    ],
  };

  return (
    <div
      className={`relative w-full h-full grid ${adjustGridClass} ${appModePaddingClass} gap-2.5  overflow-auto `}
    >
      <div className="flex items-center gap-4 p-2 bg-gray-200 rounded-md shadow-md dark:bg-gray-700">
        <div>
          <select
            className="p-1 border rounded-md"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All</option>
            {departments &&
              departments.length > 0 &&
              departments.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <input
            type="date"
            className="p-1 border rounded-md"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            className="p-1 border rounded-md"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>
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

export default SioDashboard;
