using JwtTokenAuthentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Portmonetka.AuthenticationService.AuthenticationManager;
using Portmonetka.AuthenticationService.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<UserDbContext>();

builder.Services.AddControllers();

builder.Services.AddJwtAuthentication();
//    .AddJwtBearer(/*"authentication-service-api",*/ x =>
//    {
//        x.RequireHttpsMetadata = false;
//        x.SaveToken = true;
//        x.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuerSigningKey = true,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!)),
//            ValidateIssuer = false,
//            ValidateAudience = false
//        };
//    });

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