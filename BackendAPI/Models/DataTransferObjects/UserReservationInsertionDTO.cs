using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models.DataTransferObjects
{
    [Table("userreservations")]
    public class UserReservationInsertionDTO : BaseModel
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
    }
}