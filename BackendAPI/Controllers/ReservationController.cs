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
        UserReservation model = new()
        {
            SeatId = request.SeatId,
            UserId = Guid.Parse(_testUserId),
            ScreeningId = request.ScreeningId
        };

        try
        {
            await _supabase.From<UserReservation>().Insert(model);
            return Ok(new { message = "Seat booked successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to book seat: {ex.Message}" });
        }
    }
}