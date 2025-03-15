namespace BackendAPI.Models.RequestModels
{
    public class BookSeatRequest
    {
        public int SeatId { get; set; }
        public int ScreeningId { get; set; }
        public float PricePaid { get; set; }
    }
}