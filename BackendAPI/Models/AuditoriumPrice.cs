using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class Auditoriumprice
{
    public string AuditoriumType { get; set; } = null!;

    public int? Price { get; set; }

    public virtual ICollection<Auditorium> Auditoria { get; set; } = new List<Auditorium>();
}
