import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { twMerge } from "tailwind-merge";

import {
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
  rememberSelection?: boolean;
}
const defaultProps = {
  hidden: false,
  className: "",
  rememberSelection: false,
};
function HirarchyFilter(props: IProps) {
  const { hidden, className, rememberSelection } = props;

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

  const [lastSelection, setLastSelection] = useState<{
    mode: string;
    locationId: number;
    divisionId: number;
    areaId: number;
    teamId: number;
  }>({
    mode: "auto",
    locationId: -2,
    divisionId: -2,
    areaId: -2,
    teamId: -2,
  });

  const {
    data: orgData,
    isLoading: isOrgDataLoading,
    isError: isOrgDataError,
  } = useOrgDataQuery();

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
      if (rememberSelection && locationId > 0) {
        setLastSelection({
          mode: "auto",
          locationId,
          divisionId,
          areaId,
          teamId,
        });
      }

      let currTeamList = [...orgData.sdtTeams];
      let currAreaList = [...orgData.areas];
      let currDivisionList = [...orgData.divisions];
      let currLocationList = [...orgData.locations];

      currDivisionList = [
        ...orgData.divisions.filter((division) =>
          currAreaList.some((area) => area.MAS_ID === division.ID),
        ),
      ];

      currLocationList = [
        ...orgData.locations.filter((location) =>
          currDivisionList.some((division) => division.LOCN_ID === location.ID),
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
      setLocationList(compiledOrgData.locations);
      let currLocnId = 0;
      if (
        rememberSelection &&
        lastSelection.mode === "auto" &&
        locationId > 0 &&
        lastSelection.locationId > 0
      ) {
        currLocnId = lastSelection.locationId;
      } else {
        currLocnId = compiledOrgData.locations.some(
          (location) => location.ID === authState.LOCATION,
        )
          ? authState.LOCATION
          : compiledOrgData.locations[0].ID;
      }
      setlocationId(currLocnId);
    }
  }, [compiledOrgData]);

  useEffect(() => {
    if (!isOrgDataLoading && locationId !== -2 && compiledOrgData) {
      let currDivisionList = compiledOrgData.divisions.filter(
        (item) => item.LOCN_ID === locationId,
      );

      if (currDivisionList && currDivisionList.length <= 0) {
        currDivisionList = [{ ...DEFAULT_VALUE_DIVISION }];
      }
      let currDivisionId = 0;
      if (
        rememberSelection &&
        lastSelection.mode === "auto" &&
        locationId > 0 &&
        lastSelection.divisionId > 0
      ) {
        currDivisionId = lastSelection.divisionId;
      } else {
        currDivisionId = currDivisionList[0].ID;
      }
      setDivisionList([...currDivisionList]);
      setDivisionId(currDivisionId);
    }
  }, [locationId, compiledOrgData]);

  useEffect(() => {
    if (!isOrgDataLoading && divisionId !== -2 && compiledOrgData) {
      let currAreaList = compiledOrgData.areas.filter(
        (item) => item.LOCN_ID === locationId && item.MAS_ID === divisionId,
      );

      if (currAreaList && currAreaList.length <= 0) {
        currAreaList = [{ ...DEFAULT_VALUE_AREA }];
      }

      let currAreaId = 0;
      if (
        rememberSelection &&
        lastSelection.mode === "auto" &&
        locationId > 0 &&
        lastSelection.areaId > 0
      ) {
        currAreaId = lastSelection.areaId;
      } else {
        currAreaId = currAreaList[0].ID;
      }

      setAreaList([...currAreaList]);
      setAreaId(currAreaId);
    }
  }, [divisionId, compiledOrgData]);

  useEffect(() => {
    if (!isOrgDataLoading && areaId !== -2 && compiledOrgData) {
      let currArea = { ...DEFAULT_VALUE_AREA };
      let currDivision = { ...DEFAULT_VALUE_DIVISION };
      let currLocation = { ...DEFAULT_VALUE_LOCATION };

      if (areaId > 0) {
        const filteredCurrArea = compiledOrgData.areas.filter(
          (item) => item.ID === areaId,
        );
        if (filteredCurrArea.length > 0) {
          currArea = { ...filteredCurrArea[0] };
        }
      }

      if (areaId === 0) {
        if (divisionId > 0) {
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
      let currTeamList = compiledOrgData.sdtTeams.filter(
        (item) => item.LOCN_ID === locationId && item.AREA_ID === areaId,
      );

      if (currTeamList && currTeamList.length <= 0) {
        currTeamList = [{ ...DEFAULT_VALUE_TEAM }];
      }

      let currTeamId = 0;
      if (
        rememberSelection &&
        lastSelection.mode === "auto" &&
        locationId > 0 &&
        lastSelection.teamId > 0
      ) {
        currTeamId = lastSelection.teamId;
      } else {
        currTeamId = currTeamList[0].ID;
      }
      setTeamList([...currTeamList]);
      setTeamId(currTeamId);
      setHirarchy({
        loginType: "",
        appMode: "",
        locationId,
        divisionId,
        areaId,
        teamId: currTeamId,
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
    setLastSelection((oldState) => ({ ...oldState, mode: "manual" }));
    setlocationId(newValue);
  };
  const handleChangeDivision = (newValue: number) => {
    setLastSelection((oldState) => ({ ...oldState, mode: "manual" }));
    setDivisionId(newValue);
  };
  const handleChangeArea = (newValue: number) => {
    setLastSelection((oldState) => ({ ...oldState, mode: "manual" }));
    setAreaId(newValue);
  };
  const handleChangeTeam = (newValue: number) => {
    setLastSelection((oldState) => ({ ...oldState, mode: "manual" }));
    setTeamId(newValue);
  };

  return (
    <div
      className={twMerge(
        `flex flex-wrap w-full  justify-evenly items-center p-2.5 bg-white dark:bg-gray-800 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500 ${hiddenClass}  ${className}`,
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
      <div className="basis-full sm:basis-1/2 lg:basis-1/3 flex flex-col gap-2 py-2 px-2.5 md:px-4">
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
      <div className="basis-full sm:basis-1/2 lg:basis-1/3 flex flex-col gap-2 py-2 px-2.5 md:px-4">
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

HirarchyFilter.defaultProps = defaultProps;
export default HirarchyFilter;
