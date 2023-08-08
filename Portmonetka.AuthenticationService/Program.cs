using JwtTokenAuthentication;
using Portmonetka.Authentication.Models;
using Portmonetka.Authentication.Repositories;
using Portmonetka.Authentication.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<UserDbContext>();

builder.Services.AddScoped<UserRepository>();

builder.Services.AddServices();

builder.Services.AddControllers();

builder.Services.AddJwtAuthentication();

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