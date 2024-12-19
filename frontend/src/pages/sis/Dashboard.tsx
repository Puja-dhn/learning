import React, { useEffect, useState } from "react";
import { FunnelIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { shallowEqual } from "react-redux";
import { useQueryClient } from "react-query";
// eslint-disable-next-line import/no-extraneous-dependencies
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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Doughnut, Bar } from "react-chartjs-2";
// eslint-disable-next-line import/no-extraneous-dependencies
import ChartDataLabels from "chartjs-plugin-datalabels";

import { IconButton } from "@/features/ui/buttons";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import HirarchyFilterAll from "@/features/common/HirarchyFilterAll";
import { IAECTDashboardData } from "@/features/aect/types";
import { useAECTDashboardQuery } from "@/features/aect/hooks";

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

interface ISDTDashboardData extends IAECTDashboardData {
  monthNameList: string[];
  monthWiseTotalAECTList: number[];
  monthWiseTotalNMCMinorList: number[];
  monthWiseTotalNMCSeriousList: number[];
  monthWiseTotalNMCHipoList: number[];
}
interface IGlobalData {
  locnId: number;
  divisionId: number;
  areaId: number;
}

function Dashboard() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const themeState = useAppSelector(({ theme }) => theme, shallowEqual);
  const [collapseFilter, setCollapseFilter] = useState(true);
  const [globalData, setGlobalData] = useState<IGlobalData>({
    locnId: -1,
    divisionId: -1,
    areaId: -1,
  });
  const [teamData, setTeamData] = useState<ISDTDashboardData>({
    currMonth: "Current Month",
    currFYear: 0,
    totalAECT: 0,
    totalUA: 0,
    totalUC: 0,
    totalOpen: 0,
    totalClosed: 0,
    totalNMC: 0,
    totalMinor: 0,
    totalSerious: 0,
    totalHipo: 0,
    totalNMCAShift: 0,
    totalNMCBShift: 0,
    totalNMCCShift: 0,
    totalNMCGShift: 0,
    monthWiseAECT: [],
    monthWiseNMC: [],
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
    monthWiseTotalAECTList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthWiseTotalNMCMinorList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthWiseTotalNMCSeriousList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthWiseTotalNMCHipoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });
  const queryClient = useQueryClient();

  const isHiddenHirarchy = collapseFilter;

  const adjustGridClass = isHiddenHirarchy
    ? "grid-rows-[auto_1fr]"
    : "grid-rows-[auto_auto_1fr]";
  const appModePaddingClass =
    globalState.appMode === "FullScreen"
      ? "p-0 px-2.5 "
      : " p-0 md:p-2.5  pb-0 ";

  const {
    data: aectTDashboardeData,
    isLoading: isAECTDashboardeDataLoading,
    isError: isAECTDashboardeDataError,
  } = useAECTDashboardQuery(
    globalData.areaId,
    globalData.divisionId,
    globalData.locnId,
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "aectDashboardQuery" ||
        query.queryKey[0] === "orgDataQuery",
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    if (
      globalState.locationId >= 0 &&
      globalState.divisionId >= 0 &&
      globalState.areaId >= 0
    ) {
      setGlobalData({
        locnId: globalState.locationId,
        divisionId: globalState.divisionId,
        areaId: globalState.areaId,
      });
    }
  }, [globalState.locationId, globalState.divisionId, globalState.areaId]);

  useEffect(() => {
    if (isAECTDashboardeDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isAECTDashboardeDataLoading && isAECTDashboardeDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isAECTDashboardeDataLoading &&
      !isAECTDashboardeDataError &&
      aectTDashboardeData
    ) {
      // on team change, calculate the team data and set tema data state

      const currTeamData: ISDTDashboardData = {
        ...aectTDashboardeData,
        monthNameList: [],
        monthWiseTotalAECTList: [],
        monthWiseTotalNMCMinorList: [],
        monthWiseTotalNMCSeriousList: [],
        monthWiseTotalNMCHipoList: [],
      };

      if (aectTDashboardeData.monthWiseAECT.length > 0) {
        aectTDashboardeData.monthWiseAECT.forEach((item) => {
          currTeamData.monthNameList.push(item.NAME);
          currTeamData.monthWiseTotalAECTList.push(item.DATA1);
        });
      }
      if (aectTDashboardeData.monthWiseNMC.length > 0) {
        aectTDashboardeData.monthWiseNMC.forEach((item) => {
          currTeamData.monthWiseTotalNMCMinorList.push(item.DATA1);
          currTeamData.monthWiseTotalNMCSeriousList.push(item.DATA2);
          currTeamData.monthWiseTotalNMCHipoList.push(item.DATA3);
        });
      }

      setTeamData({
        ...currTeamData,
      });
    }
  }, [
    aectTDashboardeData,
    isAECTDashboardeDataError,
    isAECTDashboardeDataLoading,
    globalState,
  ]);

  const handleCollpaseToggle = () => {
    setCollapseFilter(!collapseFilter);
  };

  const optionsAECT = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: themeState.isDarkMode ? "#9ca3af" : "#6e6f6f",
      },
      legend: {
        labels: {
          color: themeState.isDarkMode ? "#9ca3af" : "#6e6f6f",
        },
      },
    },
  };
  const dataAECT = {
    labels: ["Open", "Closed"],
    datasets: [
      {
        label: "# of AECT",
        data: [teamData.totalOpen, teamData.totalClosed],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const optionsTrendAECT = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Month Wise AECT Logged",
        color: themeState.isDarkMode ? "#095e7d" : "#577490",
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

  const dataTrendAECT = {
    labels: [...teamData.monthNameList],
    datasets: [
      {
        label: "No of AECT Logged",
        data: [...teamData.monthWiseTotalAECTList],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.65)",
      },
    ],
  };

  return (
    <div
      className={`relative w-full h-full grid ${adjustGridClass} ${appModePaddingClass} gap-2.5  overflow-auto `}
    >
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center text-sm">
          AECT Status
        </div>
        <div className="flex items-center justify-end gap-4">
          <IconButton onClick={handleCollpaseToggle}>
            <FunnelIcon className="w-4 h-4" />
          </IconButton>

          <IconButton onClick={handleRefresh}>
            <ArrowPathIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      <HirarchyFilterAll hidden={isHiddenHirarchy} />

      <div className="relative w-full h-full overflow-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          <div className="h-[300px] flex justify-between border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2">
            <div className="basis-1/2 grid grid-rows-[auto_2fr_1fr]">
              <div className="p-2">
                <p className="text-lg font-semibold text-cyan-700 dark:text-cyan-200">
                  AECT Status{" "}
                  <span className="text-xs text-gray-400 dark:gray-300">
                    ({teamData.currFYear}-{teamData.currMonth})
                  </span>
                </p>
              </div>
              <div className="text-center grid grid-rows-[1fr_1fr] justify-center items-center  pb-4 ">
                <p className="text-sm font-semibold text-gray-400 underline dark:gray-300">
                  Total AECT Logged{" "}
                </p>
                <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-300">
                  {teamData.totalAECT}
                </p>
              </div>
              <div className="grid grid-cols-[1fr_1fr] gap-2 border-[1px] justify-center items-center  bg-slate-200 dark:bg-gray-700 dark:border-gray-700 px-2 ">
                <div className="text-center grid grid-rows-[1fr_1fr]  ">
                  <p className="text-sm font-semibold text-gray-400 underline dark:gray-300">
                    UA Count{" "}
                  </p>
                  <p className="text-xl font-bold text-cyan-600 dark:text-cyan-200 bg-gray-50 dark:bg-gray-500">
                    {teamData.totalUA > 0 ? teamData.totalUA : 0}
                  </p>
                </div>
                <div className="text-center grid grid-rows-[1fr_1fr]">
                  <p className="text-sm font-semibold text-gray-400 underline dark:gray-300">
                    UC Count{" "}
                  </p>
                  <p className="text-xl font-bold text-cyan-600 dark:text-cyan-200 bg-gray-50 dark:bg-gray-500">
                    {teamData.totalUC > 0 ? teamData.totalUC : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-2 overflow-hidden basis-1/2">
              <Doughnut data={dataAECT} options={optionsAECT} />
            </div>
          </div>
          {/* <div className="h-[300px] flex justify-between border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2">
            <div className="basis-1/2 grid grid-rows-[auto_2fr_1fr]">
              <div className="p-2">
                <p className="text-lg font-semibold text-cyan-700 dark:text-cyan-200">
                  NMC Status{" "}
                  <span className="text-xs text-gray-400 dark:gray-300">
                    ({teamData.currMonth})
                  </span>
                </p>
              </div>
              <div className="text-center grid grid-rows-[1fr_1fr] justify-center items-center pb-4">
                <p className="text-sm font-semibold text-gray-400 underline dark:gray-300">
                  Total NMC Logged{" "}
                </p>
                <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-300">
                  {teamData.totalNMC}
                </p>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 border-[1px] justify-center items-center  bg-slate-200 dark:bg-gray-700 dark:border-gray-700 px-2 ">
                <div className="text-center grid grid-rows-[1fr_1fr]  ">
                  <p className="text-sm font-semibold text-gray-400 underline dark:gray-300">
                    Minor{" "}
                  </p>
                  <p className="text-xl font-bold text-cyan-600 dark:text-cyan-200 bg-gray-50 dark:bg-gray-500">
                    {teamData.totalMinor}
                  </p>
                </div>
                <div className="text-center grid grid-rows-[1fr_1fr]">
                  <p className="text-sm font-semibold text-gray-400 underline dark:gray-300">
                    Serious{" "}
                  </p>
                  <p className="text-xl font-bold text-cyan-600 dark:text-cyan-200 bg-gray-50 dark:bg-gray-500">
                    {teamData.totalSerious}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-2 overflow-hidden basis-1/2">
              <Doughnut data={dataNMC} options={optionsNMC} />
            </div>
          </div> */}
          <div className="h-[300px] flex justify-between border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2 bg-[#f3fbf3] dark:bg-[#c8dec8] overflow-hidden">
            <Bar options={optionsTrendAECT} data={dataTrendAECT} />
          </div>
          {/* <div className="h-[300px] flex justify-between border-[1px] rounded-lg shadow-md dark:border-gray-500 p-2 bg-[#f9f2f2]  dark:bg-gray-600 overflow-hidden">
            <Bar options={optionsTrendNMC} data={dataTrendNMC} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
