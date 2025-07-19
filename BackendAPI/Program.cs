using BackendAPI.Hubs;
using BackendAPI.Models;
using BackendAPI.Services;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

Env.Load();


var CONNECTION_STRING = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION")!;

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

var app = builder.Build();
app.UseCors("AllowSignalR");
app.MapHub<ReservationHub>("/hubs/reservations");
app.MapControllers();

app.Run();