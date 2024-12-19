import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { twMerge } from "tailwind-merge";

import {
  DEFUALT_VALUE_ALLLOCATION,
  DEFAULT_VALUE_ALLDIVISION,
  DEFAULT_VALUE_ALLAREA,
  DEFAULT_VALUE_LOCATION,
  DEFAULT_VALUE_DIVISION,
  DEFAULT_VALUE_AREA,
} from "./constants";
import { useAppSelector } from "@/store/hooks";
import { useAlertConfig, useLoaderConfig } from "../ui/hooks";
import { useGlobalConfig, useOrgDataQuery } from "./hooks";
import { IOrgData, ILocationItem, IOrgItem } from "./types";
import Select from "../ui/elements/Select";

interface IProps {
  hidden?: boolean;
  className?: string;
}
const defaultProps = {
  hidden: false,
  className: "",
};
function HirarchyFilterAllNoTeam(props: IProps) {
  const { hidden, className } = props;
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const { setHirarchy } = useGlobalConfig();
  const hiddenClass = hidden ? "hidden" : "";

  const [compiledOrgData, setCompiledOrgData] = useState<IOrgData>({
    locations: [
      {
        ...DEFAULT_VALUE_LOCATION,
      },
    ],
    divisions: [
      {
        ...DEFAULT_VALUE_DIVISION,
      },
    ],
    areas: [
      {
        ...DEFAULT_VALUE_AREA,
      },
    ],

    roleTypes: [],
    sdtTeams: [],
  });
  const [locationList, setLocationList] = useState<ILocationItem[]>([]);
  const [locationId, setlocationId] = useState<number>(-2);
  const [divisionList, setDivisionList] = useState<IOrgItem[]>([]);
  const [divisionId, setDivisionId] = useState<number>(-2);
  const [areaList, setAreaList] = useState<IOrgItem[]>([]);
  const [areaId, setAreaId] = useState<number>(-2);

  const {
    data: orgData,
    isLoading: isOrgDataLoading,
    isError: isOrgDataError,
  } = useOrgDataQuery();

  const setHirarchyData = () => {
    let currArea = { ...DEFAULT_VALUE_ALLAREA };
    let currDivision = { ...DEFAULT_VALUE_ALLDIVISION };
    let currLocation = { ...DEFUALT_VALUE_ALLLOCATION };

    if (!isOrgDataLoading && compiledOrgData) {
      if (areaId > 0) {
        const filteredCurrArea = compiledOrgData.areas.filter(
          (item) => item.ID === areaId,
        );
        if (filteredCurrArea.length > 0) {
          currArea = { ...filteredCurrArea[0] };
          const filteredCurrDivision = compiledOrgData.divisions.filter(
            (item) => item.ID === currArea.MAS_ID,
          );
          if (filteredCurrDivision.length > 0) {
            currDivision = { ...filteredCurrDivision[0] };
            const filteredCurrLocation = compiledOrgData.locations.filter(
              (item) => item.ID === currDivision.LOCN_ID,
            );

            if (filteredCurrLocation.length > 0) {
              currLocation = { ...filteredCurrLocation[0] };
            }
          }
        }

        if (areaId === 0) {
          if (divisionId > 0) {
            const filteredCurrDivision = compiledOrgData.divisions.filter(
              (item) => item.ID === divisionId,
            );
            if (filteredCurrDivision.length > 0) {
              currDivision = { ...filteredCurrDivision[0] };
              const filteredCurrLocation = compiledOrgData.locations.filter(
                (item) => item.ID === currDivision.LOCN_ID,
              );

              if (filteredCurrLocation.length > 0) {
                currLocation = { ...filteredCurrLocation[0] };
              }
            }
          }
        }
      }
    }

    setHirarchy({
      loginType: "",
      appMode: "",
      locationId,
      divisionId,
      areaId,
      currArea,
      currDivision,
      currLocation,
      lastSelection: {
        mode: "auto",
        locationId: -1,
        divisionId: -1,
        areaId: -1,
      },
      roleTypes: [...compiledOrgData.roleTypes],
      teamId: -2,
    });
  };
  useEffect(() => {
    if (isOrgDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isOrgDataLoading && isOrgDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isOrgDataLoading && !isOrgDataError && orgData) {
      // team wise available locations, divisions and  area

      let currAreaList = [...orgData.areas];
      let currDivisionList = [...orgData.divisions];
      let currLocationList = [...orgData.locations];

      currDivisionList = [
        ...currDivisionList.filter((division) =>
          currAreaList.some((area) => area.MAS_ID === division.ID),
        ),
      ];

      currLocationList = [
        ...currLocationList.filter((location) =>
          currDivisionList.some((division) => division.LOCN_ID === location.ID),
        ),
      ];

      // set orgDat based on roles

      if (authState.ROLES && authState.ROLES.length > 0) {
        // for admin no filter

        if (!authState.ROLES.includes(10)) {
          currDivisionList = [
            ...currDivisionList.filter((division) =>
              currAreaList.some((area) => area.MAS_ID === division.ID),
            ),
          ];

          currLocationList = [
            ...currLocationList.filter((location) =>
              currDivisionList.some(
                (division) => division.LOCN_ID === location.ID,
              ),
            ),
          ];
        }
      } else {
        currAreaList = [{ ...DEFAULT_VALUE_AREA }];
        currDivisionList = [{ ...DEFAULT_VALUE_DIVISION }];
        currLocationList = [{ ...DEFAULT_VALUE_LOCATION }];
      }

      if (currAreaList.length <= 0) {
        currAreaList = [{ ...DEFAULT_VALUE_AREA }];
      }
      if (currDivisionList.length <= 0) {
        currDivisionList = [{ ...DEFAULT_VALUE_DIVISION }];
      }
      if (currLocationList.length <= 0) {
        currLocationList = [{ ...DEFAULT_VALUE_LOCATION }];
      }

      setCompiledOrgData({
        locations: [...currLocationList],
        divisions: [...currDivisionList],
        areas: [...currAreaList],
        roleTypes: [...orgData.roleTypes],
        sdtTeams: [],
      });
    }
  }, [orgData, isOrgDataLoading, isOrgDataError]);

  useEffect(() => {
    if (
      !isOrgDataLoading &&
      compiledOrgData.locations &&
      compiledOrgData.locations.length > 0
    ) {
      let currLocnList = [...compiledOrgData.locations];
      if (authState.ROLES.includes(2)) {
        currLocnList = [{ ...DEFUALT_VALUE_ALLLOCATION }, ...currLocnList];
      }
      setLocationList(currLocnList);

      if (
        compiledOrgData.locations.some(
          (location) => location.ID === authState.LOCATION,
        )
      ) {
        setlocationId(authState.LOCATION);
      } else {
        setlocationId(currLocnList[0].ID);
      }

      setHirarchyData();
    }
  }, [compiledOrgData]);

  useEffect(() => {
    if (!isOrgDataLoading && locationId !== -2 && compiledOrgData) {
      let currDivisionList = [...compiledOrgData.divisions];

      // for all dont filter

      if (locationId > 0) {
        currDivisionList = currDivisionList.filter(
          (item) => item.LOCN_ID === locationId,
        );
      }

      if (currDivisionList && currDivisionList.length <= 0) {
        currDivisionList = [{ ...DEFAULT_VALUE_DIVISION }];
      }

      if (currDivisionList && currDivisionList.length > 0) {
        if (
          authState.ROLES.includes(2) ||
          authState.ROLES.includes(10) ||
          authState.ROLES.includes(9)
        ) {
          currDivisionList = [
            { ...DEFAULT_VALUE_ALLDIVISION },
            ...currDivisionList,
          ];
        }
      }

      setDivisionList([...currDivisionList]);
      setDivisionId(currDivisionList[0].ID);

      setHirarchyData();
    }
  }, [locationId, compiledOrgData]);

  useEffect(() => {
    if (!isOrgDataLoading && divisionId !== -2 && compiledOrgData) {
      let currAreaList = [...compiledOrgData.areas];

      if (divisionId > 0) {
        currAreaList = currAreaList.filter(
          (item) => item.MAS_ID === divisionId,
        );
      }
      if (divisionId === 0 && locationId > 0) {
        currAreaList = currAreaList.filter(
          (item) => item.LOCN_ID === locationId,
        );
      }

      if (currAreaList && currAreaList.length <= 0) {
        currAreaList = [{ ...DEFAULT_VALUE_AREA }];
      }

      if (currAreaList && currAreaList.length > 0) {
        if (
          authState.ROLES.includes(2) ||
          authState.ROLES.includes(10) ||
          authState.ROLES.includes(9) ||
          authState.ROLES.includes(8)
        ) {
          currAreaList = [{ ...DEFAULT_VALUE_ALLAREA }, ...currAreaList];
        }
      }

      setAreaList([...currAreaList]);
      setAreaId(currAreaList[0].ID);

      setHirarchyData();
    }
  }, [divisionId, compiledOrgData]);

  useEffect(() => {
    if (!isOrgDataLoading && areaId !== -2 && compiledOrgData) {
      setHirarchyData();
    }
  }, [areaId, compiledOrgData]);

  const handleChangeLocn = (newValue: number) => {
    setlocationId(newValue);
    setDivisionId(-2);
    setAreaId(-2);
  };
  const handleChangeDivision = (newValue: number) => {
    setDivisionId(newValue);
    setAreaId(-2);
  };
  const handleChangeArea = (newValue: number) => {
    setAreaId(newValue);
  };

  return (
    <div
      className={twMerge(
        `flex flex-wrap w-full justify-evenly items-center p-2.5 bg-white dark:bg-gray-800 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500 ${hiddenClass}  ${className}`,
      )}
    >
      <div className="basis-full sm:basis-1/2 lg:basis-1/6 flex flex-col gap-2 py-2 px-2.5 md:px-4">
        <p className="block text-sm font-normal text-gray-900 dark:text-gray-300">
          Location
        </p>
        <Select
          value={locationId}
          onChange={(e) => {
            handleChangeLocn(+e.target.value);
          }}
        >
          {locationList.map((locn) => (
            <option key={locn.ID} value={locn.ID}>
              {locn.NAME}
            </option>
          ))}
        </Select>
      </div>
      <div className="basis-full sm:basis-1/2 lg:basis-2/6 flex flex-col gap-2 py-2 px-2.5 md:px-4">
        <p className="block text-sm font-normal text-gray-900 dark:text-gray-300">
          Division
        </p>
        <Select
          value={divisionId}
          onChange={(e) => {
            handleChangeDivision(+e.target.value);
          }}
        >
          {divisionList.map((division) => (
            <option key={division.ID} value={division.ID}>
              {division.NAME}
            </option>
          ))}
        </Select>
      </div>
      <div className="basis-full sm:basis-1/2 lg:basis-3/6 flex flex-col gap-2 py-2 px-2.5 md:px-4">
        <p className="block text-sm font-normal text-gray-900 dark:text-gray-300">
          Area
        </p>
        <Select
          value={areaId}
          onChange={(e) => {
            handleChangeArea(+e.target.value);
          }}
        >
          {areaList.map((area) => (
            <option key={area.ID} value={area.ID}>
              {area.NAME}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

HirarchyFilterAllNoTeam.defaultProps = defaultProps;
export default HirarchyFilterAllNoTeam;
