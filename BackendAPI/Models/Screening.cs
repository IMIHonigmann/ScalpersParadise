using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class Screening
{
    public long ScreeningId { get; set; }

    public int? MovieId { get; set; }

    public int? AuditoriumId { get; set; }

    public DateTime? ScreeningTime { get; set; }

    public double? DynamicPricingModifier { get; set; }

    public virtual Auditorium? Auditorium { get; set; }

    public virtual ICollection<Userreservation> Userreservations { get; set; } = new List<Userreservation>();
}
