export interface UserDetails {
  userId: string;
  balance: number;
  reservations: Reservation[];
}

export interface Reservation {
  reservationId: number;
  seatId: number;
  screeningId: number;
  boughtAt: Date;
  auditoriumId: number;
  auditoriumType: string;
  pricePaid: number;
  ticketValue: number;
  rowNumber: number;
  seatNumber: number;
  seatType: string;
  movieId: number;
  movieName: string;
}
