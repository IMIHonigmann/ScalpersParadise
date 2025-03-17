using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Sprache;
using Supabase;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController(Client supabase) : ControllerBase
{
    private readonly Client _supabase = supabase;
    private readonly string _testUserId = Environment.GetEnvironmentVariable("TEST_USERID")!;

    [HttpGet("profile/reservations")]
    public async Task<IActionResult> GetReservations()
    {
        try
        {
            var reservationsTask = _supabase
            .From<UserReservation>()
            .Select(@"*,
                Seat:Seats!inner(*,
                    SeatPrice:SeatPrices!inner(*)),
                Screening:screenings!inner(*,
                    Auditorium:Auditoriums!inner(*,
                        AuditoriumPrice:AuditoriumPrices(*)))")
            .Where(x => x.UserId == _testUserId)
            .Get();

            var userBalanceTask = _supabase
            .From<UserBalance>()
            .Select("*")
            .Where(x => x.UserId == _testUserId)
            .Get();

            await Task.WhenAll(reservationsTask, userBalanceTask);

            var resultReservations = await reservationsTask;
            var resultUserBalance = await userBalanceTask;

            UserReservation[] userReservations = resultReservations.Models.ToArray();
            UserBalance userBalance = resultUserBalance.Model!;


            if (userReservations is null || userReservations.Length == 0)
            {
                return NotFound(new { message = "No reservations found for the current user" });
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

                    reservation.Seat.RowNumber,
                    reservation.Seat.SeatNumber,
                    reservation.Seat.SeatType,

                    reservation.Screening.MovieId,
                    reservation.Screening.AuditoriumId,

                    reservation.Screening.Auditorium.AuditoriumType,

                    TicketValue = reservation.Screening.Auditorium.AuditoriumPrice.Price * reservation.Seat.SeatPrice.PriceModifier,
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