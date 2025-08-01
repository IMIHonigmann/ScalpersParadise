export interface Seat {
  seatId: number;
  auditoriumid: number;
  rowNumber: string;
  seatNumber: 1;
  seatType: SeatType;
  seatPrice: number;
  reservationId: number | null;
}

export type SeatType = 'Regular' | 'VIP' | 'FirstClass';
