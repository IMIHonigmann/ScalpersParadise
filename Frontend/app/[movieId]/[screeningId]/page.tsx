'use client';

import { ReservationProvider } from '@/context/ReservationContext';
import BoxGrid from './BoxGrid';
import ScreeningContent from './ScreeningContent';

export default function ScreeningPage() {
  return (
    <ReservationProvider>
      <BoxGrid />
      <ScreeningContent />
    </ReservationProvider>
  );
}
