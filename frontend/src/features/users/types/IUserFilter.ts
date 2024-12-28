interface IUserFilter {
  id: number | null;
  name: string;
  email: string;
  mobile: string;
  show_roles: number;
  in_role: number;
  in_role_list: number[];
  in_mapping: number;
  in_mapping_list: string[];
  is_filter_query: number;
}

export default IUserFilter;
