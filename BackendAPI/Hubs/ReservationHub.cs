using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BackendAPI.Hubs;

public class ReservationHub : Hub
{
    public async Task JoinReservationUpdates()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "ReservationUpdates");
    }

    public async Task LeaveReservationUpdates()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ReservationUpdates");
    }
}