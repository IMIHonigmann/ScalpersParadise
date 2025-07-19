using BackendAPI.Hubs;
using BackendAPI.Models;
using BackendAPI.Models.DataTransferObjects;
using BackendAPI.Models.RequestModels;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ReservationController : ControllerBase
{
    private readonly ScalpersParadiseContext _db;
    private readonly Guid _testUserId = Guid.Parse(Environment.GetEnvironmentVariable("TEST_USERID")!);
    private readonly IHubContext<ReservationHub> _hubContext;
    private readonly IReservationNotificationService _notificationService;

    public ReservationController(
        ScalpersParadiseContext db,
        IHubContext<ReservationHub> hubContext,
        IReservationNotificationService notificationService)
    {
        _db = db;
        _hubContext = hubContext;
        _notificationService = notificationService;
    }

    [HttpPost("bookSeat")]
    public async Task<IActionResult> BookSeat([FromBody] BookSeatRequest request)
    {
        try
        {
            var existingReservation = await _db.Userreservations
                .FirstOrDefaultAsync(x => x.SeatId == request.SeatId);

            if (existingReservation != null)
            {
                return Conflict(new { message = "This seat is already booked" });
            }

            // Get seat with related Auditorium and SeatPrice
            var seat = await _db.Seats
                .Include(s => s.Auditorium)
                    .ThenInclude(a => a.AuditoriumTypeNavigation.Price)
                .Include(s => s.SeatTypeNavigation.PriceModifier)
                .FirstOrDefaultAsync(s => s.SeatId == request.SeatId);

            if (seat == null)
            {
                return NotFound(new { message = "Seat cannot be found" });
            }

            // Get user balance
            var userBalance = await _db.Userbalances
                .FirstOrDefaultAsync(ub => ub.UserId == _testUserId);

            if (userBalance == null)
            {
                return StatusCode(422, new { message = "User balance not found" });
            }

            double? calculatedSeatPrice = seat.Auditorium.AuditoriumTypeNavigation.Price * seat.SeatTypeNavigation.PriceModifier;

            if (userBalance.Balance < calculatedSeatPrice)
            {
                return StatusCode(422, new { message = "Insufficient balance to complete this reservation" });
            }

            // Insert reservation
            Userreservation newReservation = new()
            {
                SeatId = request.SeatId,
                UserId = _testUserId,
                ScreeningId = request.ScreeningId,
                PricePaid = calculatedSeatPrice,
                BoughtAt = DateTime.Now
            };

            _db.Userreservations.Add(newReservation);

            userBalance.Balance -= calculatedSeatPrice;
            _db.Userbalances.Update(userBalance);

            await _db.SaveChangesAsync();

            await _notificationService.NotifyNewReservation(newReservation);

            return Ok(new { message = "Seat booked successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to book seat: {ex.Message}" });
        }
    }
}

