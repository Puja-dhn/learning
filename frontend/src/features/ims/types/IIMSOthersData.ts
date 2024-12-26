
import IInjuryDtls from "./IInjuryDtls";
import ITeamDtls from "./ITeamDtls";

interface IIMSOthersData {
  INJURY_DETAILS: IInjuryDtls[];
  SUGG_TEAM: ITeamDtls[];
  WITNESS_TEAM: ITeamDtls[];
}
export default IIMSOthersData;
