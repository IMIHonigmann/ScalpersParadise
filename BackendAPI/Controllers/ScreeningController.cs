using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ScreeningController(ScalpersParadiseContext context) : ControllerBase
{
    private readonly ScalpersParadiseContext _context = context;

    [HttpGet("getScreeningsByMovieId")]
    public async Task<IActionResult> GetScreeningsByMovieId([FromQuery] int movieId)
    {
        var screenings = await _context.Screenings
            .Include(s => s.Auditorium)
            .Where(s => s.MovieId == movieId)
            .ToListAsync();

        if (screenings == null || screenings.Count == 0)
        {
            return NotFound($"No screenings found for movie ID {movieId}");
        }

        var screeningDTO = screenings.Select(s => new
        {
            s.ScreeningId,
            s.MovieId,
            s.AuditoriumId,
            s.ScreeningTime,
            s.Auditorium?.AuditoriumType,
        }).ToArray();

        return Ok(screeningDTO);
    }

    [HttpGet("getScreeningSeatingDetails")]
    public async Task<IActionResult> GetScreeningSeatingDetails([FromQuery] int screeningId)
    {
        var selectedScreening = await _context.Screenings
           .Include(s => s.Auditorium)
           .FirstOrDefaultAsync(s => s.ScreeningId == screeningId);

        if (selectedScreening == null)
        {
            return NotFound($"Screening {screeningId} doesn't exist");
        }

        var seats = await _context.Seats
            .Include(seat => seat.Userreservations)
            .Include(seat => seat.Auditorium)
                .ThenInclude(a => a!.AuditoriumTypeNavigation)
            .Include(seat => seat.SeatTypeNavigation)
            .Where(seat => seat.AuditoriumId == selectedScreening.AuditoriumId)
            .ToListAsync();

        if (seats == null || seats.Count == 0)
        {
            return NotFound($"No seats found for screeningID {selectedScreening.AuditoriumId}");
        }
        if (selectedScreening.Auditorium?.AuditoriumTypeNavigation == null)
        {
            return StatusCode(422, new { message = "Unable to calculate auditorium price due to missing data" });
        }

        var auditoriumPrice = selectedScreening.Auditorium.AuditoriumTypeNavigation.Price ?? 30;

        var screeningSeatsDTO = new
        {
            selectedScreening.ScreeningId,
            selectedScreening.MovieId,
            selectedScreening.AuditoriumId,
            selectedScreening.ScreeningTime,
            selectedScreening.Auditorium.AuditoriumType,

            seats = seats.Select(xSeat => new
            {
                xSeat.SeatId,
                xSeat.AuditoriumId,
                xSeat.RowNumber,
                xSeat.SeatNumber,
                xSeat.SeatType,
                SeatPrice = auditoriumPrice * (xSeat.SeatTypeNavigation?.PriceModifier ?? 1),
                xSeat.Userreservations?.FirstOrDefault()?.ReservationId,
            })
        };

        return Ok(screeningSeatsDTO);
    }
}
