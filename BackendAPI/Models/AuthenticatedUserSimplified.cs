using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("users")]
    public class AuthenticatedUserSimplified : BaseModel
    {
        [PrimaryKey("id", false)]
        public Guid Id { get; set; }

        [Column("email")]
        public string Email { get; set; } = string.Empty;
    }
}