namespace BackendAPI.Models.DataTransferObjects
{
    public class UserReservationInsertionDTO
    {
        public int ReservationId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int SeatId { get; set; }
        public int ScreeningId { get; set; }
        public DateTime BoughtAt { get; set; }
        public float PricePaid { get; set; }
    }
}