using BackendAPI.Models;
using BackendAPI.Models.DataTransferObjects;
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

            if (existingReservation.Model != null)
            {
                return Conflict(new { message = "This seat is already booked" });
            }

            var seatWithPriceProperties = await _supabase.
            From<Seat>()
            .Select(@"*, Auditorium:Auditoriums!inner(*, 
                            AuditoriumPrice:AuditoriumPrices!inner(*)),
                         SeatPrice:SeatPrices!inner(*)")
            .Where(x => x.SeatId == request.SeatId)
            .Limit(1)
            .Get();

            if (seatWithPriceProperties.Model == null)
            {
                return NotFound(new { message = "Seat cannot be found" });
            }

            var userBalance = await _supabase
            .From<UserBalance>()
            .Select("*")
            .Where(ub => ub.UserId == _testUserId)
            .Limit(1)
            .Get();

            float calculatedSeatPrice = seatWithPriceProperties.Model.Auditorium.AuditoriumPrice.Price *
                                        seatWithPriceProperties.Model.SeatPrice.PriceModifier;

            if (userBalance.Model!.Balance < calculatedSeatPrice)
            {
                return StatusCode(422, new { message = "Insufficient balance to complete this reservation" });
            }

            UserReservationInsertionDTO model = new()
            {
                SeatId = request.SeatId,
                UserId = _testUserId,
                ScreeningId = request.ScreeningId,
                PricePaid = calculatedSeatPrice,
                BoughtAt = DateTime.Now
            };

            float newBalance = userBalance.Model!.Balance - calculatedSeatPrice;
            var update = await _supabase
                .From<UserBalance>()
                .Where(x => x.UserId == _testUserId)
                .Set(x => x.Balance, newBalance)
                .Update();

            await _supabase.From<UserReservationInsertionDTO>().Insert(model);

            return Ok(new { message = "Seat booked successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to book seat: {ex.Message}" });
        }
    }
}