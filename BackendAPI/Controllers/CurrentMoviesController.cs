using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class CurrentMoviesController(Client supabase) : ControllerBase
{
    private readonly Client _supabase = supabase;

    [HttpGet("getCurrentMoviesByName")]
    public async Task<IActionResult> GetScreeningsByMovieId(
    [FromQuery] string? movieName = null
    )
    {
        var result = movieName == null
            ? await _supabase
            .From<Screening>()
            .Get()
            : await _supabase
            .From<Screening>()
            .Filter(x => x.MovieName, Supabase.Postgrest.Constants.Operator.ILike, $"%{movieName}%")
            .Get();

        Screening[] movies = result.Models.ToArray();

        if (movies is null || movies.Length == 0)
        {
            return NotFound($"No current movies found for your query {movieName}");
        }

        var moviesDTO = movies
        .Select(s => new
        {
            s.ScreeningId,
            s.MovieId,
            s.MovieName,
            s.AuditoriumId,
            s.ScreeningTime,
            s.Auditorium.AuditoriumType,
        })
        .DistinctBy(s => s.MovieId)
        .ToArray();

        return Ok(moviesDTO);
    }
}