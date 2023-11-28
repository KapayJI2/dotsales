export type TCustomFieldFiltered = [
  {
    phone_field_id: number;
    code: string;
  } & { email_field_id: number; code: string },
];
