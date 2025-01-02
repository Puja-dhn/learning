import { IDataCount } from "@/features/common/types";

interface ISIODashboardData {
  currMonth: string;
  currFYear: number;
  monthWiseCPA: IDataCount[];
  ficWiseCPA: IDataCount[];
  teamWiseCPA: IDataCount[];
  ownTeamCPA: IDataCount[];
  dayWiseIssue: IDataCount[];
}

export default ISIODashboardData;
