'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import { useReservationSignalR } from '@/hooks/useReservationSignalR';
import { SeatWSResponse } from '@/types/SeatWSResponse';

type ReservationContextType = {
  lastReservation: SeatWSResponse | null;
  reservations: SeatWSResponse[];
  isConnected: boolean;
};

const ReservationContext = createContext<ReservationContextType>({
  lastReservation: null,
  reservations: [],
  isConnected: false,
});

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [lastReservation, setLastReservation] = useState<SeatWSResponse | null>(
    null
  );
  const [reservations, setReservations] = useState<SeatWSResponse[]>([]);

  const handleNewReservation = useCallback((data: SeatWSResponse) => {
    setLastReservation(data);
    setReservations(prev => [...prev, data]);
    console.log(data);
  }, []);

  const { isConnected } = useReservationSignalR(handleNewReservation);

  return (
    <ReservationContext.Provider
      value={{ lastReservation, reservations, isConnected }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export const useReservation = () => useContext(ReservationContext);
