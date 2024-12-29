interface ILogImsData {
    disp_logno: number;
    incident_no: number;
    inc_date_time: string;
    department_id: string;
    department: string;
    area_id: string;
    area: number;
    injury_type: string;
    factors: string;
    reported_by: number;
    exact_location: string;
    potential_outcome: string;
    action_taken: string;
    incident_details: string;
    ims_photos: string;
    immediate_action: string;
    status: string;
    pending_on: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    log_by: string;
    close_remarks: string;
  }
  
  export default ILogImsData;
  