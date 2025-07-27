using System;
using System.Collections.Generic;

namespace BackendAPI.Models;

public partial class TestUser
{
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}
