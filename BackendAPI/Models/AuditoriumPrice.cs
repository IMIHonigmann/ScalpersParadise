using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("AuditoriumPrices")]
    public class AuditoriumPrice : BaseModel
    {
        [PrimaryKey("id", false)]
        public required string AuditoriumType { get; set; }

        [Column("price")]
        public float Price { get; set; }
    }
}