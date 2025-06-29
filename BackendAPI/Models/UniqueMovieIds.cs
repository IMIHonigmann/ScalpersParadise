
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BackendAPI.Models
{
    [Table("unique_movie_ids")]
    public class UniqueMovieIds : BaseModel
    {
        [PrimaryKey("movie_id", false)]
        public int MovieId { get; set; }
    }
}