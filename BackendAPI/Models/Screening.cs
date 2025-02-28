using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("screenings")]
    public class Screening : BaseModel
    {
        [PrimaryKey("seat_type", false)]
        public int ScreeningId { get; set; }

        [Column("movie_id")]
        public int MovieId { get; set; }

        [Column("auditorium_id")]
        public int AuditoriumId { get; set; }

        [Column("screening_time")]
        public DateTime ScreeningTime { get; set; }
    }
}