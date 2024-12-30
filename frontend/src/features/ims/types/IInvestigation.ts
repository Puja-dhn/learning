interface IInvestigation {
    id: string;
    incident_id: string;
    list_facts: string;
    physical_factors: string;
    human_factors: string;
    system_factors: string;
    status: string;
    risk_identified: string;
    identified_control: string;
    control_type: string;
    control_description: string;
    control_adequate_desc: string;
  }
  export default IInvestigation;
  