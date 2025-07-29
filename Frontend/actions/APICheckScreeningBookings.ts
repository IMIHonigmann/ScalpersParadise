'use server';

export async function getScreeningBookings(screeningId: number) {
  const JWT = ``;
  let URL = process.env.DEV_SERVER_ADDRESS;
  if (process.env.NODE_ENV === 'production')
    URL = process.env.DEPLOYED_SERVER_ADDRESS;
  const res = await fetch(
    `${URL}/Reservation/checkBookedSeatsOfRoom?screeningId=${screeningId}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${JWT}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  return res.json();
}
