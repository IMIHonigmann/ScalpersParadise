using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class CurrentMoviesController(ScalpersParadiseContext db) : ControllerBase
{
    private readonly ScalpersParadiseContext _db = db;

    [HttpGet(nameof(GetCurrentMovieIds))]
    public async Task<IActionResult> GetCurrentMovieIds()
    {
        var ids = await _db.Screenings
                    .OrderByDescending(x => x.MovieId)
                    .Select(x => x.MovieId)
                    .Distinct()
                    .ToArrayAsync();

        if (ids.Length == 0)
        {
            return NotFound("No movies are currently displayed.");
        }

        return Ok(ids);
    }
}