using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class Seat
{
    public int SeatId { get; set; }

    public int? AuditoriumId { get; set; }

    public int? RowNumber { get; set; }

    public int? SeatNumber { get; set; }

    public string? SeatType { get; set; }

    public virtual Auditorium? Auditorium { get; set; }

    public virtual Seatprice? SeatTypeNavigation { get; set; }

    public virtual ICollection<Userreservation> Userreservations { get; set; } = new List<Userreservation>();
}
