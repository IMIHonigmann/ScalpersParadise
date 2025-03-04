'use server';

export async function bookSeat(screeningId: number, seatId: number) {
  const JWT = ``;
  const res = await fetch(`http://localhost:5118/Reservation/bookSeat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Add this header
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
    body: JSON.stringify({
      ScreeningId: screeningId,
      SeatId: seatId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  return res.json();
}
