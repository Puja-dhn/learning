import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { twMerge } from "tailwind-merge";

import {
  DEFUALT_VALUE_ALLLOCATION,
  DEFAULT_VALUE_ALLDIVISION,
  DEFAULT_VALUE_ALLAREA,
  DEFAULT_VALUE_ALLTEAM,
  DEFAULT_VALUE_LOCATION,
  DEFAULT_VALUE_DIVISION,
  DEFAULT_VALUE_AREA,
  DEFAULT_VALUE_TEAM,
} from "./constants";
import { useAppSelector } from "@/store/hooks";
import { useAlertConfig, useLoaderConfig } from "../ui/hooks";
import { useGlobalConfig, useOrgDataQuery } from "./hooks";
import { IOrgData, ILocationItem, IOrgItem, ISDTTeam } from "./types";
import Select from "../ui/elements/Select";

interface IProps {
  hidden?: boolean;
  className?: string;
}
const defaultProps = {
  hidden: false,
  className: "",
};
function HirarchyFilterAll(props: IProps) {
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
    sdtTeams: [
      {
        ...DEFAULT_VALUE_TEAM,
      },
    ],
    roleTypes: [],
  });
  const [locationList, setLocationList] = useState<ILocationItem[]>([]);
  const [locationId, setlocationId] = useState<number>(-2);
  const [divisionList, setDivisionList] = useState<IOrgItem[]>([]);
  const [divisionId, setDivisionId] = useState<number>(-2);
  const [areaList, setAreaList] = useState<IOrgItem[]>([]);
  const [areaId, setAreaId] = useState<number>(-2);
  const [teamList, setTeamList] = useState<ISDTTeam[]>([]);
  const [teamId, setTeamId] = useState<number>(-2);

  const {
    data: orgData,
    isLoading: isOrgDataLoading,
    isError: isOrgDataError,
  } = useOrgDataQuery();

  const setHirarchyData = () => {
    let currTeam = { ...DEFAULT_VALUE_ALLTEAM };
    let currArea = { ...DEFAULT_VALUE_ALLAREA };
    let currDivision = { ...DEFAULT_VALUE_ALLDIVISION };
    let currLocation = { ...DEFUALT_VALUE_ALLLOCATION };
    if (!isOrgDataLoading && compiledOrgData) {
      if (areaId > 0) {
        const filteredCurrTeam = compiledOrgData.sdtTeams.filter(
          (item) => item.ID === teamId,
        );
        if (filteredCurrTeam.length > 0) {
          currTeam = { ...filteredCurrTeam[0] };
          const filteredCurrArea = compiledOrgData.areas.filter(
            (item) => item.ID === currTeam.AREA_ID,
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
        }
      }

      currTeam.AREA_ID = currArea.ID;
      currTeam.AREA_NAME = currArea.NAME;
      currTeam.DIV_ID = currDivision.ID;
      currTeam.DIV_NAME = currDivision.NAME;
      currTeam.LOCN_ID = currLocation.ID;

      // if division, area and team anyone of these is not selected then reset current selected member list
    }

    setHirarchy({
      loginType: "Domain",
      appMode: "",
      locationId,
      divisionId,
      areaId,
      teamId,
      currArea,
      currDivision,
      currLocation,
      roleTypes: [],
      lastSelection: {
        mode: "auto",
        locationId: -1,
        divisionId: -1,
        areaId: -1,
      },
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
      let currTeamList = [...orgData.sdtTeams];
      let currAreaList = [...orgData.areas];
      let currDivisionList = [...orgData.divisions];
      let currLocationList = [...orgData.locations];

      currAreaList = [...currAreaList];

      currDivisionList = [
        ...currDivisionList.filter((division) =>
          currAreaList.some((area) => area.MAS_ID === division.ID),
        ),
      ];

      currTeamList = [
        ...currTeamList.filter((team) =>
          currAreaList.some((area) => area.ID === team.AREA_ID),
        ),
      ];

      if (orgData.sdtTeams.length > 0) {
        currAreaList = [
          ...orgData.areas.filter((area) =>
            currTeamList.some((team) => team.AREA_ID === area.ID),
          ),
        ];

        currDivisionList = [
          ...orgData.divisions.filter((division) =>
            currAreaList.some((area) => area.MAS_ID === division.ID),
          ),
        ];

        currLocationList = [
          ...orgData.locations.filter((location) =>
            currDivisionList.some(
              (division) => division.LOCN_ID === location.ID,
            ),
          ),
        ];
      }
      // currLocationList = [
      //   ...currLocationList.filter((location) =>
      //     currDivisionList.some((division) => division.LOCN_ID === location.ID),
      //   ),
      // ];

      // currAreaList = [{ ...DEFAULT_VALUE_AREA }];
      // currDivisionList = [{ ...DEFAULT_VALUE_DIVISION }];
      // currLocationList = [{ ...DEFAULT_VALUE_LOCATION }];

      // if (currAreaList.length <= 0) {
      //   currAreaList = [{ ...DEFAULT_VALUE_AREA }];
      // }
      // if (currDivisionList.length <= 0) {
      //   currDivisionList = [{ ...DEFAULT_VALUE_DIVISION }];
      // }
      // if (currLocationList.length <= 0) {
      //   currLocationList = [{ ...DEFAULT_VALUE_LOCATION }];
      // }

      setCompiledOrgData({
        locations: [...currLocationList],
        divisions: [...currDivisionList],
        areas: [...currAreaList],
        sdtTeams: [...currTeamList],
        roleTypes: [...orgData.roleTypes],
      });
    }
  }, [orgData, isOrgDataLoading, isOrgDataError]);

  useEffect(() => {
    if (
      !isOrgDataLoading &&
      compiledOrgData.locations &&
      compiledOrgData.locations.length > 0
    ) {
      const currLocnList = [...compiledOrgData.locations];

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
        if (authState.ROLES.includes(2)) {
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
        if (authState.ROLES.includes(2)) {
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
      let currTeamList = [...compiledOrgData.sdtTeams];
      if (areaId > 0) {
        currTeamList = compiledOrgData.sdtTeams.filter(
          (item) => item.AREA_ID === areaId,
        );
      }

      if (areaId === 0 && divisionId > 0) {
        const currAreaList = compiledOrgData.areas.filter(
          (item) => item.MAS_ID === divisionId,
        );
        currTeamList = [
          ...currTeamList.filter((team) =>
            currAreaList.some((area) => area.ID === team.AREA_ID),
          ),
        ];
      }

      if (areaId === 0 && divisionId === 0 && locationId > 0) {
        const currDivisionList = compiledOrgData.divisions.filter(
          (division) => division.LOCN_ID === locationId,
        );

        const currAreaList = [
          ...compiledOrgData.areas.filter((area) =>
            currDivisionList.some((division) => division.ID === area.MAS_ID),
          ),
        ];

        currTeamList = [
          ...currTeamList.filter((team) =>
            currAreaList.some((area) => area.ID === team.AREA_ID),
          ),
        ];
      }
      if (currTeamList && currTeamList.length > 0) {
        currTeamList = [{ ...DEFAULT_VALUE_ALLTEAM }, ...currTeamList];
      }

      if (currTeamList && currTeamList.length <= 0) {
        currTeamList = [{ ...DEFAULT_VALUE_TEAM }];
      }

      if (currTeamList && currTeamList.length > 0) {
        if (authState.ROLES.includes(2)) {
          currTeamList = [{ ...DEFAULT_VALUE_ALLTEAM }, ...currTeamList];
        }
      }

      setTeamList([...currTeamList]);
      setTeamId(currTeamList[0].ID);
      setHirarchyData();
    }
  }, [areaId, compiledOrgData]);

  useEffect(() => {
    let currTeam: ISDTTeam = { ...DEFAULT_VALUE_TEAM };
    let currArea = { ...DEFAULT_VALUE_AREA };
    let currDivision = { ...DEFAULT_VALUE_DIVISION };
    let currLocation = { ...DEFAULT_VALUE_LOCATION };
    if (!isOrgDataLoading && teamId >= 0 && compiledOrgData) {
      if (teamId > 0) {
        const filteredCurrTeam = compiledOrgData.sdtTeams.filter(
          (item) => item.ID === teamId,
        );
        if (filteredCurrTeam.length > 0) {
          currTeam = { ...filteredCurrTeam[0] };
          const filteredCurrArea = compiledOrgData.areas.filter(
            (item) => item.ID === currTeam.AREA_ID,
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
        }
      }
    }

    setHirarchy({
      loginType: "",
      appMode: "",
      locationId,
      divisionId,
      areaId,
      teamId,
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
    });
  }, [teamId, compiledOrgData]);

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
  const handleChangeTeam = (newValue: number) => {
    setTeamId(newValue);
  };
  return (
    <div
      className={twMerge(
        `flex flex-wrap  md:h-auto  justify-evenly items-center p-2.5 bg-white dark:bg-gray-800 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500 ${hiddenClass}   ${className}`,
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
      <div className="basis-full sm:basis-1/2 lg:basis-2/6 flex flex-col gap-2 py-2 px-2.5 md:px-4">
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
      <div className="basis-full sm:basis-1/2 lg:basis-1/6 flex flex-col gap-2 py-2 px-2.5 md:px-4">
        <p className="block text-sm font-normal text-gray-900 dark:text-gray-300">
          SDT Team
        </p>
        <Select
          value={teamId}
          onChange={(e) => {
            handleChangeTeam(+e.target.value);
          }}
        >
          {teamList.map((team) => (
            <option key={team.ID} value={team.ID}>
              {team.NAME}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

HirarchyFilterAll.defaultProps = defaultProps;
export default HirarchyFilterAll;
