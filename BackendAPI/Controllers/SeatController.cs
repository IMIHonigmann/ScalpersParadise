using BackendAPI.Models;
using BackendAPI.Models.DataTransferObjects;
using Microsoft.AspNetCore.Mvc;
using Supabase;
using static Supabase.Postgrest.Constants;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class SeatController(Client supabase) : ControllerBase
{
    private readonly Client _supabase = supabase;

    [HttpGet("getSeat")]
    public async Task<IActionResult> GetSeat(
        [FromQuery] int auditoriumId,
        [FromQuery] string rowNumber,
        [FromQuery] int seatNumber)
    {
        var result = await _supabase
            .From<Seat>()
            .Filter("auditorium_id", Operator.Equals, auditoriumId.ToString())
            .Filter("row_number", Operator.Equals, rowNumber)
            .Filter("seat_number", Operator.Equals, seatNumber.ToString())
            .Get();

        Seat? seat = result.Models.FirstOrDefault();

        if (seat is null)
        {
            return NotFound();
        }

        SeatDTO seatsResponse = new()
        {
            SeatId = seat.SeatId,
            AuditoriumId = seat.AuditoriumId,
            RowNumber = seat.RowNumber,
            SeatNumber = seat.SeatNumber,
            SeatType = seat.SeatType,
        };

        return Ok(seatsResponse);
    }
}