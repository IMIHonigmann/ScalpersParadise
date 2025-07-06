import { type Screening } from '@/types/Screening';
import Link from 'next/link';

function groupByDay(screenings: Screening[]) {
  return screenings.reduce((acc, screening) => {
    const dateKey = new Date(screening.screeningTime).toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(screening);
    return acc;
  }, {} as Record<string, Screening[]>);
}

export default function CurrentScreeningsComponent({
  screenings,
}: {
  screenings: Screening[];
}) {
  const screeningsByDay = groupByDay(screenings);
  const auditoriumColors = {
    Classic: '#fff101',
    IMAX: '#009edc',
    '4DX': '#e2740b',
  };

  return (
    <div className="flex items-center flex-wrap justify-center min-h-screen text-3xl">
      <div className="w-[95%]">
        {' '}
        <p className="text-center">Screenings this week:</p>
        <br />
        <br />
        {Object.entries(screeningsByDay).map(([day, dayScreenings]) => {
          const dayParts = day.split(', ');
          return (
            <div
              key={day}
              className="grid grid-cols-[0.125fr_1fr] items-center rounded-lg border-b p-10 m-5"
            >
              <strong className="flex flex-col mr-5">
                {<span>{dayParts[0].substring(0, 3)}</span>}
                {<span>{dayParts[1]}</span>}
              </strong>
              <div className="grid grid-cols-4 gap-y-4 mt-5">
                {dayScreenings.map(s => (
                  <Link
                    key={s.screeningId}
                    className="border rounded-lg mr-5 p-2.5 transition-[transition_color] scale-100 translate-y-0 hover:scale-[102.5%] hover:-translate-y-0.5 hover:saturate-[75%] ease-in-out"
                    href={`${s.movieId}/${s.auditoriumId}`}
                    style={{
                      backgroundColor:
                        auditoriumColors[
                          s.auditoriumType as keyof typeof auditoriumColors
                        ],
                      color: s.auditoriumType === 'Classic' ? 'black' : '',
                    }}
                  >
                    {new Date(s.screeningTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    <br />({s.auditoriumType}) TH{s.auditoriumId}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
