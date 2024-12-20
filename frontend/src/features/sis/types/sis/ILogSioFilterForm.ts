interface ILogSioFilterForm {
  id: number | null;
  department: string;
  category: string;
  area: string;
  severity: string;
  obs_date_from: string;
  obs_date_to: string;
  status: string;
}

export default ILogSioFilterForm;
