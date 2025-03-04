using BackendAPI.Models;
using BackendAPI.Models.RequestModels;
using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ReservationController(Client supabase) : ControllerBase
{
    private readonly Client _supabase = supabase;
    private readonly string _testUserId = Environment.GetEnvironmentVariable("TEST_USERID")!;

    [HttpPost("bookSeat")]
    public async Task<IActionResult> BookSeat([FromBody] BookSeatRequest request)
    {
        try
        {
            var existingReservation = await _supabase
            .From<UserReservation>()
            .Select("*")
            .Where(x => x.SeatId == request.SeatId)
            .Get();

            if (existingReservation.Models.Any())
            {
                return Conflict(new { message = "This seat is already booked" });
            }

            UserReservation model = new()
            {
                SeatId = request.SeatId,
                UserId = Guid.Parse(_testUserId),
                ScreeningId = request.ScreeningId
            };

            await _supabase.From<UserReservation>().Insert(model);
            return Ok(new { message = "Seat booked successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to book seat: {ex.Message}" });
        }
    }
}