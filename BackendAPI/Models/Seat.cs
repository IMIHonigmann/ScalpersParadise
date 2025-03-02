using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("Seats")]
    public class Seat : BaseModel
    {
        [PrimaryKey("seat_id", true)]
        public int SeatId { get; set; }

        [Column("auditorium_id")]
        public int AuditoriumId { get; set; }

        [Column("row_number")]
        public string RowNumber { get; set; } = string.Empty;

        [Column("seat_number")]
        public int SeatNumber { get; set; }

        [Column("seat_type")]
        public string SeatType { get; set; } = string.Empty;
        public Screening Screening { get; set; } = new();
    }
}