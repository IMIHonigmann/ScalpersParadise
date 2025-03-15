using BackendAPI.Models;
using BackendAPI.Models.Enums;
using BackendAPI.Models.RequestModels;
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
            var result = await _supabase
            .From<UserReservation>()
            .Select(@"*,
                Seat:Seats!inner(*,
                    SeatPrice:SeatPrices!inner(*)),
                Screening:screenings!inner(*,
                    Auditorium:Auditoriums!inner(*,
                        AuditoriumPrice:AuditoriumPrices(*)))")
            .Where(x => x.UserId == _testUserId)
            .Get();

            UserReservation[] userReservations = result.Models.ToArray();

            if (userReservations is null || userReservations.Length == 0)
            {
                return NotFound(new { message = "No reservations found for the current user" });
            }

            var reservationsDTO = userReservations.Select(reservation => new
            {
                reservation.ReservationId,
                reservation.UserId,
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
            });

            return Ok(reservationsDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to fetch reservations: {ex.Message}" });
        }
    }
}