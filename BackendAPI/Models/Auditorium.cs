using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class Auditorium
{
    public int AuditoriumId { get; set; }

    public string? AuditoriumType { get; set; }

    public virtual Auditoriumprice? AuditoriumTypeNavigation { get; set; }

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
