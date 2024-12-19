interface ILogSIOData {
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
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export default ILogSIOData;
