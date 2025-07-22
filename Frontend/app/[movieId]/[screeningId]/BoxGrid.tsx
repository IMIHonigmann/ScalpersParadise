import { ScreeningDetails } from '@/types/ScreeningDetails';
import { checkAndBookSeatIfEmpty } from '@/actions/APIBookSeat';
import { getScreeningDetails } from '@/actions/APIGetScreeningDetails';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { generateRowsWithBoxes } from './helpers';
import { useReservation } from '@/context/ReservationContext';

export default function BoxGrid() {
  const { lastReservation } = useReservation();

  const params = useParams();
  const screeningId = Number(params.screeningId);
  const [screeningDetails, setScreeningDetails] =
    useState<ScreeningDetails | null>(null);
  const [seatThatsBookingNow, setSeatThatsBookingNow] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSeatPrice, setHoveredSeatPrice] = useState('0.00');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await getScreeningDetails(screeningId);
        setScreeningDetails(details);
      } catch (error) {
        console.error('Failed to fetch screening details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [screeningId]);

  useEffect(() => {
    const updateDetails = async () => {
      const updatedDetails = await getScreeningDetails(screeningId);
      setScreeningDetails(updatedDetails);
    };

    updateDetails();
  }, [lastReservation, screeningId]);

  function getSeatByBoxId(boxId: number) {
    return screeningDetails?.seats.find(
      seat => seat.seatId === screeningDetails.seats[0].seatId + boxId
    );
  }

  if (!screeningDetails) return;
  const rows = generateRowsWithBoxes(screeningDetails.auditoriumType);
  const boxSize = 80;

  const isSeatBooked = (boxId: number) => {
    if (!screeningDetails.seats.length) return;
    return screeningDetails.seats[boxId].reservationId !== null;
  };

  const handleSeatBooking = async (boxId: number) => {
    if (!screeningDetails.seats.length) return;

    try {
      const seatId = screeningDetails.seats[0].seatId + boxId;
      setSeatThatsBookingNow(boxId);
      const isSeatBookedResult = await checkAndBookSeatIfEmpty(
        screeningId,
        seatId
      );
      const message = isSeatBookedResult
        ? `Seat ${boxId} booked successfully!`
        : `Seat ${boxId} is already reserved by someone else!`;
      alert(message);
      setSeatThatsBookingNow(-1);
    } catch (error) {
      console.error('Failed to book seat:', error);
      alert('Failed to book seat. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading screening details...</div>;
  }

  return (
    <div className="flex box-container flex-col items-center">
      <div className="w-full flex flex-col items-center mb-8 mt-16">
        <div className="w-3/4 h-3 bg-gray-300 rounded-t-full shadow-lg shadow-white mb-4" />
        <div className="text-sm text-gray-600 font-semibold">SCREEN</div>
      </div>
      {rows.map(row => (
        <div
          key={row.rowId}
          style={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${row.cols}, ${boxSize}px)`,
              gap: '10px',
            }}
          >
            {row.boxes.map(box => {
              const isBooked = isSeatBooked(box.id);
              const seatByBoxId = getSeatByBoxId(box.id);

              return (
                <button
                  className={isBooked ? 'booked' : 'notbooked'}
                  onClick={() => {
                    if (isBooked) return;
                    handleSeatBooking(box.id);
                  }}
                  key={box.id}
                  style={{
                    width: `${boxSize}px`,
                    height: `${boxSize}px`,
                    backgroundColor: box.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'auto',
                  }}
                  onMouseEnter={e => {
                    if (isBooked) return;
                    e.currentTarget.style.cursor = 'pointer';
                    e.currentTarget.style.transform =
                      'scale(1.05) translateY(-0.25rem)';
                    e.currentTarget.style.boxShadow =
                      '0 5px 10px rgba(0,0,0,0.3)';
                    setHoveredSeatPrice(
                      seatByBoxId?.seatPrice.toFixed(2) || '0.00'
                    );
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.cursor = 'auto';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 3px 5px rgba(0,0,0,0.2)';
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '50%',
                      height: '50%',
                    }}
                  >
                    {seatThatsBookingNow == box.id && !isBooked ? (
                      'Booking...'
                    ) : (
                      <Image
                        src="/userreserved.svg"
                        alt="Seat"
                        fill
                        style={{
                          objectFit: 'contain',
                          transform: isBooked ? 'scale(1)' : 'scale(0)',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                    {seatByBoxId?.seatType}
                    {box.id}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p> {hoveredSeatPrice} </p>
    </div>
  );
}
