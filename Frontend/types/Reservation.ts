export interface Reservation {
  reservationId: number;
  userId: string;
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
