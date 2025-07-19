using BackendAPI.Models;
using BackendAPI.Models.DataTransferObjects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class SeatController(ScalpersParadiseContext context) : ControllerBase
{
    private readonly ScalpersParadiseContext _context = context;

    [HttpGet("getSeat")]
    public async Task<IActionResult> GetSeat(
        [FromQuery] int auditoriumId,
        [FromQuery] int rowNumber,
        [FromQuery] int seatNumber)
    {
        var seat = await _context.Seats
            .FirstOrDefaultAsync(s =>
                s.AuditoriumId == auditoriumId &&
                s.RowNumber == rowNumber &&
                s.SeatNumber == seatNumber);

        if (seat is null)
        {
            return NotFound();
        }

        return Ok(seat);
    }
}