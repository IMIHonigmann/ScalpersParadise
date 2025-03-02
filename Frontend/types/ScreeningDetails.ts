import { Screening } from './Screening';
import { Seat } from './Seat';

export interface ScreeningDetails extends Screening {
  seats: Seat[];
}
