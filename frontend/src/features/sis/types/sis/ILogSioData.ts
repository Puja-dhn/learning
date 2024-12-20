interface ILogSIOData {
  id: number;
  obs_datetime: string;
  department_id: string;
  department: string;
  area_id: string;
  area: number;
  category_id: string;
  category: string;
  severity: number;
  obs_desc: string;
  obs_sugg: string;
  obs_photos: string;
  closure_desc: string;
  closure_photos: string;
  pending_on_id: string;
  pending_on: string;
  responsibilities: string;
  status: string;
  target_date: string;
  action_plan: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  log_by: string;
  closure_date: string;
  disp_logno: string;
}

export default ILogSIOData;
