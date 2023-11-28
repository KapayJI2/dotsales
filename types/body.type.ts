type TValue = {
  value: string;
  enum_code?: string;
};
type TCustomField = {
  field_id: number;
  values: TValue[];
  field_name?: string;
};
type TContacts = {
  contacts: any[];
};
export type TBody = {
  id?: number;
  first_name?: string;
  last_name?: string;
  custom_fields_values?: TCustomField[];
  name?: string;
  price?: number;
  _embedded?: TContacts;
};
