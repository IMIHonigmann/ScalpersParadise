using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("Auditoriums")]
    public class Auditorium : BaseModel
    {
        [PrimaryKey("id", false)]
        public int AuditoriumId { get; set; }

        [Column("auditorium_type")]
        public string AuditoriumType { get; set; } = string.Empty;
        public AuditoriumPrice AuditoriumPrice { get; set; } = new();
    }
}
