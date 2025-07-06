import { type Screening } from '@/types/Screening';

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

  return (
    <div className="flex items-center justify-center min-h-screen text-3xl">
      <div>
        <p className="text-center">Screenings this week:</p>
        <br />
        <br />
        {Object.entries(screeningsByDay).map(([day, dayScreenings]) => (
          <div key={day} className="border rounded-lg p-10 m-5 w-full">
            <strong>{day}</strong>
            <br />
            <div className="mt-5">
              {dayScreenings.map(s => (
                <span
                  key={s.screeningId}
                  className="border rounded-lg mr-5 p-2.5"
                >
                  Auditorium {s.auditoriumId} ({s.auditoriumType}){' - '}
                  {new Date(s.screeningTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
