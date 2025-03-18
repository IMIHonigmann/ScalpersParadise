using BackendAPI.Hubs;
using BackendAPI.Services;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL")!;
var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_KEY")!;

var supabaseOptions = new Supabase.SupabaseOptions { AutoConnectRealtime = true };
var supabase = new Supabase.Client(supabaseUrl, supabaseKey, supabaseOptions);
await supabase.InitializeAsync();

builder.Services.AddSingleton(supabase);
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