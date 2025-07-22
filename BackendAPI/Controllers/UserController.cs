using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly ScalpersParadiseContext _dbContext;
    private readonly Guid _testUserId = Guid.Parse(Environment.GetEnvironmentVariable("TEST_USERID")!);

    public UserController(ScalpersParadiseContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("profile/reservations")]
    public async Task<IActionResult> GetReservations()
    {
        try
        {
            var userReservations = await _dbContext.Userreservations
                            .Include(r => r.Seat)
                                .ThenInclude(s => s!.SeatTypeNavigation)
                            .Include(r => r.Screening)
                                .ThenInclude(s => s!.Auditorium)
                                    .ThenInclude(a => a!.AuditoriumTypeNavigation)
                            .Where(r => r.UserId == _testUserId)
                            .ToArrayAsync();

            var userBalance = await _dbContext.Userbalances
                .FirstOrDefaultAsync(b => b.UserId == _testUserId);

            if (userReservations == null || userReservations.Length == 0)
            {
                return NotFound(new { message = "No reservations found for the current user" });
            }

            if (userBalance == null)
            {
                return NotFound(new { message = "User balance not found" });
            }


            var invalidReservation = userReservations.FirstOrDefault(r =>
                r.Seat == null ||
                r.Seat.SeatTypeNavigation == null ||
                r.Screening?.Auditorium?.AuditoriumTypeNavigation == null);

            if (invalidReservation != null)
            {
                return StatusCode(422, new { message = "Unable to calculate values due to missing data" });
            }

            var reservationsDTO = new
            {
                userReservations[0].UserId,
                userBalance.Balance,
                Reservations = userReservations.Select(reservation => new
                {
                    reservation.ReservationId,
                    reservation.SeatId,
                    reservation.ScreeningId,
                    reservation.BoughtAt,
                    reservation.PricePaid,

                    reservation.Seat!.RowNumber,
                    reservation.Seat.SeatNumber,
                    reservation.Seat.SeatType,

                    reservation.Screening!.MovieId,
                    reservation.Screening.AuditoriumId,

                    reservation.Screening.Auditorium!.AuditoriumType,

                    TicketValue = reservation.Screening.Auditorium.AuditoriumTypeNavigation!.Price * reservation.Seat.SeatTypeNavigation!.PriceModifier,
                })
            };

            return Ok(reservationsDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to fetch reservations: {ex.Message}" });
        }
    }
}
