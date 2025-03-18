'use server';

export async function getScreeningBookings(screeningId: number) {
  const JWT = ``;
  const res = await fetch(
    `http://localhost:5118/Reservation/checkBookedSeatsOfRoom?screeningId=${screeningId}`,
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
