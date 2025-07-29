'use server';

export async function checkAndBookSeatIfEmpty(
  screeningId: number,
  seatId: number
) {
  const JWT = ``;
  let URL = process.env.DEV_SERVER_ADDRESS;
  if (process.env.NODE_ENV === 'production')
    URL = process.env.DEPLOYED_SERVER_ADDRESS;
  const res = await fetch(`${URL}/Reservation/bookSeat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
    body: JSON.stringify({
      ScreeningId: screeningId,
      SeatId: seatId,
    }),
  });

  if (res.status === 409) {
    return false;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  return true;
}
