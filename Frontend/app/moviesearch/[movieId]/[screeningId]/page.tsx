'use client';

import { ScreeningDetails } from '@/types/ScreeningDetails';
import { bookSeat } from '@/utils/APIBookSeat';
import { getScreeningDetails } from '@/utils/APIGetScreeningDetails';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const rowStructure = [
  { rowId: 1, cols: 7 },
  { rowId: 2, cols: 6 },
  { rowId: 3, cols: 9 },
  { rowId: 4, cols: 6 },
  { rowId: 5, cols: 3 },
];

function generateRowsWithBoxes() {
  let id = 1;
  const rows = rowStructure.map(row => {
    const rowBoxes = [];

    for (let col = 1; col <= row.cols; col++) {
      let normalizedValue;

      if (row.cols % 2 === 0) {
        // Even number of columns - two middle columns
        const middleLeft = row.cols / 2;
        const middleRight = middleLeft + 1;

        const distanceLeft = Math.abs(col - middleLeft);
        const distanceRight = Math.abs(col - middleRight);
        const distanceFromMiddle = Math.min(distanceLeft, distanceRight);

        const maxDistance = row.cols / 2;
        normalizedValue = 1 - distanceFromMiddle / maxDistance;
      } else {
        // Odd number of columns - one middle column
        const middle = Math.ceil(row.cols / 2);
        const distanceFromMiddle = Math.abs(col - middle);
        const maxDistance = Math.floor(row.cols / 2);
        normalizedValue = 1 - distanceFromMiddle / maxDistance;
      }

      const color = normalizedValue >= 0 ? normalizedValue * 5 : 0;

      rowBoxes.push({
        id: id++,
        color: `hsl(${(color * 25) % 360}, 70%, 60%)`,
        value: normalizedValue.toFixed(2),
      });
    }

    return {
      rowId: row.rowId,
      cols: row.cols,
      boxes: rowBoxes,
    };
  });

  return rows;
}
export default function BoxGrid() {
  const params = useParams();
  const screeningId = Number(params.screeningId);
  const [screeningDetails, setScreeningDetails] =
    useState<ScreeningDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const rows = generateRowsWithBoxes();
  const boxSize = 80;

  // Fetch screening details when component mounts
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

  const handleSeatBooking = async (boxId: number) => {
    if (!screeningDetails?.seats?.length) return;

    try {
      const seatId = screeningDetails.seats[0].seatId - 1 + boxId;
      await bookSeat(screeningId, seatId);
      alert(`Seat ${boxId} booked successfully!`);
    } catch (error) {
      console.error('Failed to book seat:', error);
      alert('Failed to book seat. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading screening details...</div>;
  }

  return (
    <div
      className="box-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Image
        src="/moviescreen.svg"
        alt="Cinema Screen"
        width={900}
        height={500}
        style={{
          position: 'relative',
          opacity: 0.7,
          zIndex: 1,
          marginTop: '-20px',
          marginBottom: '20px',
          border: '1px solid #ccc',
        }}
      />

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
            {row.boxes.map(box => (
              <button
                onClick={() => handleSeatBooking(box.id)}
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
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 5px 10px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 5px rgba(0,0,0,0.2)';
                }}
              >
                <div
                  style={{ position: 'relative', width: '50%', height: '50%' }}
                >
                  <Image
                    src="/userreserved.svg"
                    alt="Seat"
                    fill
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                  {box.id}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
