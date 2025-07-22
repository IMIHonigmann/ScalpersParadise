using BackendAPI.Hubs;
using BackendAPI.Models;
using Microsoft.AspNetCore.SignalR;

namespace BackendAPI.Services
{
    public interface IReservationNotificationService
    {
        Task NotifyNewReservation(Userreservation reservation);
    }

    public class ReservationNotificationService(
        IHubContext<ReservationHub> hubContext,
        ILogger<ReservationNotificationService> logger) : IReservationNotificationService
    {
        private readonly IHubContext<ReservationHub> _hubContext = hubContext;
        private readonly ILogger<ReservationNotificationService> _logger = logger;

        public async Task NotifyNewReservation(Userreservation reservation)
        {
            try
            {
                await _hubContext.Clients.Group("ReservationUpdates")
                    .SendAsync("NewReservation", new
                    {
                        reservation.SeatId,
                    });

                _logger.LogInformation("Notification sent for reservation of seat {SeatId}",
                    reservation.SeatId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send reservation notification");
            }
        }
    }
}