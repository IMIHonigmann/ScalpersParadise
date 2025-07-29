'use client';

import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { SeatWSResponse } from '@/types/SeatWSResponse';

export function useReservationSignalR(
  onNewReservation?: (data: SeatWSResponse) => void
) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SeatWSResponse | null>(null);
  const [messageHistory, setMessageHistory] = useState<SeatWSResponse[]>([]);

  useEffect(() => {
    let URL = process.env.NEXT_PUBLIC_DEV_SERVER_ADDRESS;
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production')
      URL = process.env.NEXT_PUBLIC_DEPLOYED_SERVER_ADDRESS;
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${URL}/hubs/reservations`)
      .withAutomaticReconnect()
      .build();

    newConnection.on('NewReservation', data => {
      setLastMessage(data);
      setMessageHistory(prev => [...prev, data]);

      if (onNewReservation) onNewReservation(data);
    });

    newConnection.onclose(() => setIsConnected(false));

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('SignalR connected');
        setIsConnected(true);

        try {
          await newConnection.invoke('JoinReservationUpdates');
          console.log('Joined reservation updates group');
        } catch (error) {
          console.error('Error joining reservation updates group:', error);
        }
      } catch (err) {
        console.error('SignalR connection failed:', err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();
    setConnection(newConnection);

    return () => {
      const cleanup = async () => {
        if (
          newConnection &&
          newConnection.state === signalR.HubConnectionState.Connected
        ) {
          try {
            await newConnection.invoke('LeaveReservationUpdates');
          } catch (error) {
            console.error('Error leaving group:', error);
          }
          await newConnection.stop();
        }
      };

      cleanup();
    };
  }, [onNewReservation]);

  useEffect(() => {
    if (connection) {
      connection.off('NewReservation');
      connection.on('NewReservation', data => {
        setLastMessage(data);
        setMessageHistory(prev => [...prev, data]);
        if (onNewReservation) onNewReservation(data);
      });
    }
  }, [connection, onNewReservation]);

  return { connection, isConnected, lastMessage, messageHistory };
}
