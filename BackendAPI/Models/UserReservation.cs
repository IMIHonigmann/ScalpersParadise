using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("userreservations")]
    public class UserReservation : BaseModel
    {
        [PrimaryKey("reservation_id", false)]
        public int ReservationId { get; set; }

        [Column("seat_id")]
        public int SeatId { get; set; }

        [Column("user_id")]
        public Guid UserId { get; set; }
        [Column("screening_id")]
        public int ScreeningId { get; set; }
    }
}