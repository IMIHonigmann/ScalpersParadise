using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("SeatPrices")]
    public class SeatPrice : BaseModel
    {
        [PrimaryKey("seat_type", false)]
        public required string SeatType { get; set; }

        [Column("price_modifier")]
        public float PriceModifier { get; set; }
    }
}