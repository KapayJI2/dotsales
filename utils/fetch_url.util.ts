import {
  BodyBuilderCreateContact,
  BodyBuilderCreateLead,
  BodyBuilderUpdateContact,
} from './body_builder.util';

export async function StartConveyor(
  token: string,
  name: string,
  phone: string,
  email: string,
) {
  try {
    let data: any;
    //Сначала пробуем найти контакт в разных вариациях query
    let result = await fetch(
      `${process.env.BASE_URL}api/v4/contacts?filter[name]=${name}&query=${phone}&query=${email}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((contact) => (data = contact['_embedded'].contacts[0]))
      .catch(() => (data = []));

    if (result.length == 0) {
      result = await fetch(
        `${process.env.BASE_URL}api/v4/contacts?filter[name]=${name}&query=${phone}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((contact) => (data = contact['_embedded'].contacts[0]))
        .catch(() => (data = []));
      if (result.length == 0) {
        result = await fetch(
          `${process.env.BASE_URL}api/v4/contacts?filter[name]=${name}&query=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then((response) => response.json())
          .then((contact) => (data = contact['_embedded'].contacts[0]))
          .catch(() => (data = []));
      }
    }
    if (data.length != 0) {
      //контакт найден - производим попытку обновления контакта
      await UpdateContact(token, data.id, name, email, phone);
      //после обновления создаём сделку для контакта
      return await CreateLead(token, data.id);
    }
    //контакт не найден - производим попытку создания контакта
    return await CreateContact(token, name, email, phone);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}
async function CreateContact(
  token: string,
  name: string,
  email: string,
  phone: string,
) {
  try {
    let data: any;
    //получаем список кастомных полей для вытягивания id полей телефона и эл.почты
    const custom_fields = await fetch(
      `${process.env.BASE_URL}api/v4/contacts/custom_fields`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => response.json());
    //обрабатываем данные для сборки тела запроса
    const body = BodyBuilderCreateContact(custom_fields, name, email, phone);
    //отправляем данные для создания контакта
    await fetch(`${process.env.BASE_URL}api/v4/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((contact) => (data = contact['_embedded'].contacts[0]))
      .catch(() => (data = []));
    //если всё хорошо - создаём сделку
    return await CreateLead(token, data.id);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}
async function UpdateContact(
  token: string,
  user_id: number,
  name: string,
  email: string,
  phone: string,
) {
  try {
    //получаем список кастомных полей для вытягивания id полей телефона и эл.почты
    const custom_fields = await fetch(
      `${process.env.BASE_URL}api/v4/contacts/custom_fields`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => response.json());
    //обрабатываем данные для сборки тела запроса
    const body = BodyBuilderUpdateContact(
      custom_fields,
      user_id,
      name,
      email,
      phone,
    );
    //отправляем данные для обновления контакта
    const contact = await fetch(`${process.env.BASE_URL}api/v4/contacts`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return contact;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}
async function CreateLead(token: string, id: number) {
  try {
    //обрабатываем данные для сборки тела запроса
    const body = BodyBuilderCreateLead(id);
    //Создаём сделку для контакта
    const lead = await fetch(`${process.env.BASE_URL}api/v4/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return lead.json();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}
