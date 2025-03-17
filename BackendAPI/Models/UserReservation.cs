using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("userreservations")]
    public class UserReservation : BaseModel
    {
        [PrimaryKey("reservation_id", false)]
        public int ReservationId { get; set; }
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;
        [Column("seat_id")]
        public int SeatId { get; set; }
        [Column("screening_id")]
        public int ScreeningId { get; set; }
        [Column("bought_at")]
        public DateTime BoughtAt { get; set; }
        [Column("price_paid")]
        public float PricePaid { get; set; }
        public Seat Seat { get; set; } = new();
        public Screening Screening { get; set; } = new();
        public AuthenticatedUserSimplified User { get; set; } = new();

    }
}