export default function SeatPage({ params }: { params: { seatId: string } }) {
  return (
    <div>
      <h1>Seat ID: {params.seatId}</h1>
    </div>
  );
}
