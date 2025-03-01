using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ScreeningController(Client supabase) : ControllerBase
{
    private readonly Client _supabase = supabase;

    [HttpGet("getScreeningsByMovieId")]
    public async Task<IActionResult> GetScreeningsByMovieId(
    [FromQuery] int movieId
)
    {
        var result = await _supabase
            .From<Screening>()
            .Select("*, Auditorium:Auditoriums!inner(*)")
            .Where(x => x.MovieId == movieId)
            .Get();

        Screening[] screenings = result.Models.ToArray();

        if (screenings is null || screenings.Length == 0)
        {
            return NotFound($"No screenings found for movie ID {movieId}");
        }

        var screeningDTO = screenings.Select(s => new
        {
            s.ScreeningId,
            s.MovieId,
            s.AuditoriumId,
            s.ScreeningTime,
            s.Auditorium.AuditoriumType,
        }).ToArray();

        return Ok(screeningDTO);
    }
}