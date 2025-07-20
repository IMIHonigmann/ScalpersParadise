export interface Screening {
  screeningId: number;
  auditoriumId: number;
  movieId: number;
  screeningTime: string;
  auditoriumType: 'IMAX' | 'Classic' | '4DX';
}
