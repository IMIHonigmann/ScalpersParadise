using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class Userbalance
{
    public Guid UserId { get; set; }

    public double? Balance { get; set; }

    public virtual User User { get; set; } = null!;
}
