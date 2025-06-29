using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class CurrentMoviesController(Client supabase) : ControllerBase
{
    private readonly Client _supabase = supabase;

    [HttpGet(nameof(GetCurrentMovieIds))]
    public async Task<IActionResult> GetCurrentMovieIds()
    {
        var result = await _supabase
            .From<UniqueMovieIds>()
            .Get();

        var ids = result.Models.ToArray();

        if (ids.Length == 0)
        {
            return NotFound("No movies are currently displayed.");
        }

        var movieIds = ids.Select(s => s.MovieId).ToArray();

        return Ok(movieIds);
    }
}