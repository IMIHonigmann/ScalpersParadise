'use server';

export async function checkAndBookSeatIfEmpty(
  screeningId: number,
  seatId: number,
  pricePaid: number
) {
  const JWT = ``;
  const res = await fetch(`http://localhost:5118/Reservation/bookSeat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
    body: JSON.stringify({
      ScreeningId: screeningId,
      SeatId: seatId,
      PricePaid: pricePaid,
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
