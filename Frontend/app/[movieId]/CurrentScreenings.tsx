import { type Screening } from '@/types/Screening';

export default function CurrentScreeningsComponent({
  screenings,
}: {
  screenings: Screening[];
}) {
  return (
    <>
      <p>Screenings this week:</p>
      <br />
      <br />
      {screenings.map(s => {
        return (
          <span key={s.screeningId}>
            Auditorium {s.auditoriumId} ({s.auditoriumType}) <br />
            {new Date(s.screeningTime).toLocaleString([], {
              minute: '2-digit',
              hour: '2-digit',
              day: 'numeric',
              weekday: 'long',
              month: 'long',
              year: 'numeric',
            })}
            <br />
            <br />
          </span>
        );
      })}
    </>
  );
}
