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

var app = builder.Build();

app.MapControllers();

app.Run();