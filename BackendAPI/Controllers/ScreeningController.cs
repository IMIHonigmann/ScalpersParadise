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

    [HttpGet("getScreeningSeatingDetails")]
    public async Task<IActionResult> GetScreeningSeatingDetails(
    [FromQuery] int screeningId
    )
    {
        var result = await _supabase
            .From<Screening>()
            .Select("*, Auditorium:Auditoriums!inner(*)")
            .Where(x => x.ScreeningId == screeningId)
            .Get();

        Screening? selectedScreening = result.Models.FirstOrDefault();

        if (selectedScreening is null)
        {
            return NotFound($"Screening {screeningId} doesn't exist");
        }

        var seatsResult = await _supabase
        .From<Seat>()
        .Select("*, UserReservation:userreservations!left(*)")
        .Where(x => x.AuditoriumId == selectedScreening.AuditoriumId)
        .Get();

        Seat[] seats = seatsResult.Models.ToArray();

        if (seats is null || seats.Length == 0)
        {
            return NotFound($"No seats found for screeningID {selectedScreening.AuditoriumId}");
        }

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
                xSeat.UserReservation?.FirstOrDefault()?.ReservationId
            })
        };


        return Ok(screeningSeatsDTO);
    }
}