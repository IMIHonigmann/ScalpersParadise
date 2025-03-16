using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("UserBalances")]
    public class UserBalance : BaseModel
    {
        [PrimaryKey("user_id", false)]
        public string UserId { get; set; } = string.Empty;

        [Column("balance")]
        public float Balance { get; set; }
    }
}