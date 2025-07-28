using System.Text;
using BackendAPI.Hubs;
using BackendAPI.Models;
using BackendAPI.Services;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

Env.Load();


string CONNECTION_STRING = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION")!;
string jwtToken = Environment.GetEnvironmentVariable("JWT_TOKEN")!;
string validIssuer = Environment.GetEnvironmentVariable("VALID_ISSUER")!;
string validAudience = Environment.GetEnvironmentVariable("VALID_AUDIENCE")!;

builder.Services.AddControllers();
builder.Services.AddDbContext<ScalpersParadiseContext>(options =>
options.UseNpgsql(CONNECTION_STRING));

builder.Services.AddControllers();
builder.Services.AddScoped<IReservationNotificationService, ReservationNotificationService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSignalR", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddSignalR();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = validIssuer,
            ValidateAudience = true,
            ValidAudience = validAudience,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtToken)
            ),
            ValidateIssuerSigningKey = true
        };
    });
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();
app.UseAuthorization();
app.UseCors("AllowSignalR");
app.MapHub<ReservationHub>("/hubs/reservations");
app.MapControllers();

app.Run();