import { TCustomFieldFiltered } from 'types/custom-fields.filtered.type';
import { TBody } from 'types/body.type';
//Сборщик тела для разных запросов
export function BodyBuilderCreateContact(
  custom_fields: any[],
  name: string,
  email: string,
  phone: string,
): TBody[] | null {
  try {
    const filtered_custom_fields: TCustomFieldFiltered = custom_fields?.[
      '_embedded'
    ].custom_fields
      .map(({ code, id }) => {
        if (code === 'PHONE') {
          return {
            phone_field_id: id,
            code,
          };
        }
        if (code === 'EMAIL') {
          return {
            email_field_id: id,
            code,
          };
        }
      })
      .filter((notNull: any) => notNull);
    const body: TBody[] = [
      {
        first_name: name,
        last_name: '',
        custom_fields_values: [
          {
            field_id: filtered_custom_fields.filter(
              ({ code }) => code === 'EMAIL',
            )[0].email_field_id,
            values: [
              {
                value: email,
              },
            ],
          },
          {
            field_id: filtered_custom_fields.filter(
              ({ code }) => code === 'PHONE',
            )[0].phone_field_id,
            values: [
              {
                value: phone,
              },
            ],
          },
        ],
      },
    ];
    return body;
  } catch {
    return null;
  }
}
export function BodyBuilderUpdateContact(
  custom_fields: any[],
  id: number,
  name: string,
  email: string,
  phone: string,
): TBody[] | null {
  try {
    const filtered_custom_fields: TCustomFieldFiltered = custom_fields?.[
      '_embedded'
    ].custom_fields
      .map(({ code, id }) => {
        if (code === 'PHONE') {
          return {
            phone_field_id: id,
            code,
          };
        }
        if (code === 'EMAIL') {
          return {
            email_field_id: id,
            code,
          };
        }
      })
      .filter((notNull: any) => notNull);
    const body: TBody[] = [
      {
        id,
        first_name: name,
        last_name: '',
        custom_fields_values: [
          {
            field_id: filtered_custom_fields.filter(
              ({ code }) => code === 'EMAIL',
            )[0].email_field_id,
            field_name: 'Email',
            values: [
              {
                value: email,
                enum_code: 'WORK',
              },
            ],
          },
          {
            field_id: filtered_custom_fields.filter(
              ({ code }) => code === 'PHONE',
            )[0].phone_field_id,
            field_name: 'Телефон',
            values: [
              {
                value: phone,
                enum_code: 'WORK',
              },
            ],
          },
        ],
      },
    ];
    return body;
  } catch {
    return null;
  }
}
export function BodyBuilderCreateLead(id: number): TBody[] | null {
  try {
    const body: TBody[] = [
      {
        name: `Сделка_${new Date().getTime()}`,
        price: 10000,
        _embedded: {
          contacts: [
            {
              id,
            },
          ],
        },
      },
    ];
    return body;
  } catch {
    return null;
  }
}
