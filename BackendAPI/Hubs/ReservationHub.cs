using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BackendAPI.Hubs;

public class ReservationHub : Hub
{
    // Methods clients can call to join/leave notification groups
    public async Task JoinReservationUpdates()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "ReservationUpdates");
    }

    public async Task LeaveReservationUpdates()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ReservationUpdates");
    }
}