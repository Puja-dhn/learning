interface ISIOPDCAssignData {
  id: number;
  obs_datetime: string;
  department: string;
  area: number;
  category: string;
  severity: number;
  obs_desc: string;
  obs_sugg: string;
  obs_photos: string;
  closure_desc: string;
  closure_photos: string;
  pending_on: string;

  responsibilities: string;
  status: string;
  target_date: string;
  action_plan: string;
}

export default ISIOPDCAssignData;
