using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class User
{
    public Guid UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public virtual Userbalance? Userbalance { get; set; }

    public virtual ICollection<Userreservation> Userreservations { get; set; } = new List<Userreservation>();
}
