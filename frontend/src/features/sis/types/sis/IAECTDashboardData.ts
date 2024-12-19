import { IDataCount } from "@/features/common/types";

interface IAECTDashboardData {
  currMonth: string;
  currFYear: number;
  totalAECT: number;
  totalUA: number;
  totalUC: number;
  totalOpen: number;
  totalClosed: number;
  totalNMC: number;
  totalMinor: number;
  totalSerious: number;
  totalHipo: number;
  totalNMCAShift: number;
  totalNMCBShift: number;
  totalNMCCShift: number;
  totalNMCGShift: number;
  monthWiseAECT: IDataCount[];
  monthWiseNMC: IDataCount[];
}

export default IAECTDashboardData;
