interface ILogRecommendationData {
    disp_logno: number;
  id: number;
    incident_no: number;
    inc_date_time: string;
    department_id: string;
    department: string;
    area_id: string;
    area: number;
    recommendation: string;
    responsibility: string;
    factor: number;
    control_type: string;
    target_date: string;
    status: string;
  }
  
  export default ILogRecommendationData;
  