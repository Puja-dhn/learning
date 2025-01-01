interface ILogInvestigationData {
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
  status: string;
  incident_details: string;
  repeated_incident: string;
  ims_photos: string;
  immediate_action: string;
  risk_identified: string;
  identified_control: string;
  control_type: string;
  control_description: string;
  control_adequate_desc: string;
  list_facts: string;
  risk_management: string;
  physical_factors: string;
  human_factors: string;
  system_factors: string;
  recommendations: string;
  documents: string;

}

export default ILogInvestigationData;
