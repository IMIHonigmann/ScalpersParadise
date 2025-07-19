using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class Userreservation
{
    public Guid? UserId { get; set; }

    public int? SeatId { get; set; }

    public long? ScreeningId { get; set; }

    public double? PricePaid { get; set; }

    public DateTime? BoughtAt { get; set; }

    public int ReservationId { get; set; }

    public virtual Screening? Screening { get; set; }

    public virtual Seat? Seat { get; set; }

    public virtual User? User { get; set; }
}
