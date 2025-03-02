'use server';

import { ScreeningDetails } from '@/types/ScreeningDetails';

export async function getScreeningDetails(
  screeningId: number
): Promise<ScreeningDetails> {
  if (!screeningId) return {} as ScreeningDetails;

  const JWT = ``;
  const res = await fetch(
    `http://localhost:5118/Screening/getScreeningSeatingDetails?screeningId=${screeningId}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${JWT}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
}
