interface ILogImsFilterForm {
    incident_no: number | null;
    department: string;
    area: string;
    injury_type: string;
    factors: string
    date_from: string;
    date_to: string;
    status: string;
  }
  
  export default ILogImsFilterForm;
  