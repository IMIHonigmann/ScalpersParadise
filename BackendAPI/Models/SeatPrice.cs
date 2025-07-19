using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class Seatprice
{
    public string SeatType { get; set; } = null!;

    public double? PriceModifier { get; set; }

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
