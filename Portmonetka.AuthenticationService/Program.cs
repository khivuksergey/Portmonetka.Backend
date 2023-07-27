using JwtTokenAuthentication;
using Portmonetka.AuthenticationService.AuthenticationManager;
using Portmonetka.AuthenticationService.Models;
using Portmonetka.AuthenticationService.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<UserDbContext>();

builder.Services.AddScoped<UserRepository>();

builder.Services.AddControllers();

builder.Services.AddJwtAuthentication();

builder.Services.AddScoped<IJwtAuthenticationManager, JwtAuthenticationManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
   name: "default",
   pattern: "{controller}/{action=Index}/{id?}");

app.Run();