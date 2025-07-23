import { ScreeningDetails } from '@/types/ScreeningDetails';
import { checkAndBookSeatIfEmpty } from '@/actions/APIBookSeat';
import { getScreeningDetails } from '@/actions/APIGetScreeningDetails';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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
  const divRef = useRef<HTMLDivElement | null>(null);

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

  const startShakingAnimation = (
    button: HTMLButtonElement,
    box: { id: number; color: string; value: string },
    bookAfterwards: boolean
  ) => {
    button.style.zIndex = '100';

    gsap.to(button, {
      x: `random(-100,100)`,
      y: `random(-100,100)`,
      rotate: `random(-50,50)`,
      duration: '0.005',
      repeat: -1,
      repeatRefresh: true,
      ease: 'sine.inOut',
      yoyo: true,
    });
    gsap.to(button, {
      scale: '2',
      duration: 2,
      repeatRefresh: true,
      ease: 'sine.out',
      yoyo: true,
      onComplete: () => {
        if (bookAfterwards) handleSeatBooking(box.id, box.color, button);
      },
    });
    gsap.to(button, {
      background: `linear-gradient(0deg, #ff7b00 0%, ${button.dataset.originalColor} 100%)`,
      duration: 1.5,
      ease: 'power1.in',
    });
  };
  const stopShakingAnimation = (button: HTMLButtonElement) => {
    button.style.zIndex = '1';
    button.style.cursor = 'auto';
    gsap.killTweensOf(button);
    gsap.to(button, {
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.01,
    });
    gsap.to(button, {
      scale: '1',
      duration: '0.1',
      background: button.dataset.originalColor,
      repeatRefresh: true,
      ease: 'sine.inOut',
    });
  };

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

  const handleSeatBooking = async (
    boxId: number,
    boxColor: string,
    button: HTMLButtonElement
  ) => {
    if (!screeningDetails.seats.length) return;

    try {
      const seatId = screeningDetails.seats[0].seatId + boxId;
      setSeatThatsBookingNow(boxId);
      const isSeatEmpty = await checkAndBookSeatIfEmpty(screeningId, seatId);
      setSeatThatsBookingNow(-1);
      if (isSeatEmpty) {
        button.style.background = `linear-gradient(0deg, #ff7b00 0%, ${boxColor} 100%)`;
        gsap
          .timeline({ delay: 0.2 })
          .to(divRef.current, {
            x: `random(-50,50)`,
            y: `random(-50,50)`,
            rotate: `random(-5,5)`,
            duration: '0.02',
            repeat: 10,
            repeatRefresh: true,
            ease: 'sine.inOut',
            yoyo: true,
          })
          .to(divRef.current, {
            x: 0,
            y: 0,
            rotate: 0,
            duration: 0.1,
            ease: 'sine.out',
          });
      }
    } catch (error) {
      console.error('Failed to book seat:', error);
      alert('Failed to book seat. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading screening details...</div>;
  }

  return (
    <div className="flex box-container flex-col items-center" ref={divRef}>
      <div className="w-full flex flex-col items-center mb-8 mt-16">
        <div className="w-3/4 h-3 bg-gray-300 rounded-t-full shadow-lg shadow-white mb-4" />
        <div className="text-sm text-gray-600 font-semibold">SCREEN</div>
      </div>
      {rows.map(row => (
        <div key={row.rowId} className="flex justify-center w-full mb-2.5">
          <div
            style={{
              gridTemplateColumns: `repeat(${row.cols}, ${boxSize}px)`,
            }}
            className="grid gap-2.5"
          >
            {row.boxes.map(box => {
              const isBooked = isSeatBooked(box.id);
              const seatByBoxId = getSeatByBoxId(box.id);

              return (
                <button
                  onMouseDown={e => {
                    if (isBooked) return;
                    e.currentTarget.dataset.originalColor =
                      e.currentTarget.style.backgroundColor;
                    startShakingAnimation(e.currentTarget, box, true);
                  }}
                  onMouseUp={e => {
                    if (isBooked) return;
                    stopShakingAnimation(e.currentTarget);
                  }}
                  onMouseLeave={e => {
                    stopShakingAnimation(e.currentTarget);
                  }}
                  className={`flex justify-center items-center text-white font-bold rounded-md ${
                    isBooked ? 'booked' : 'notbooked'
                  }`}
                  key={box.id}
                  style={{
                    width: `${boxSize}px`,
                    height: `${boxSize}px`,
                    backgroundColor: box.color,
                    transition: 'all 0.2s',
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
                >
                  <div className="relative w-1/2 h-1/2">
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
                          transition: 'all 0.1s',
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
