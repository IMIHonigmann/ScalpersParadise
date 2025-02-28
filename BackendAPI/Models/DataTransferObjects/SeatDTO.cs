namespace BackendAPI.Models.DataTransferObjects
{
    public class SeatDTO
    {
        public long SeatId { get; set; }
        public long AuditoriumId { get; set; }
        public string RowNumber { get; set; } = string.Empty;
        public long SeatNumber { get; set; }
        public string SeatType { get; set; } = string.Empty;
    }
}