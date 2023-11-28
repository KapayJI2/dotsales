import { IToken } from 'interfaces/token.interface';

export async function refreshToken(refresh_token: string): Promise<IToken> {
  try {
    const body = {
      client_id: process.env.ID_INTEGRATION,
      client_secret: process.env.CLIENT_SERVRET,
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      redirect_uri: process.env.REDIRECT_URI,
    };
    const response = await fetch(`${process.env.BASE_URL}oauth2/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error('Ошибка обновления токена');
    }
    return await response.json();
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message);
  }
}
export async function checkToken(refresh_time: number): Promise<boolean> {
  try {
    const control_date = new Date().getTime() / 1000;
    if (control_date - refresh_time / 1000 > 86400) {
      return true;
    }
    return false;
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message);
  }
}
