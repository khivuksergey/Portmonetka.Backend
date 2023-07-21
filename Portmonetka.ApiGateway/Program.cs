using JwtTokenAuthentication;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Portmonetka.ApiGateway;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddJwtAuthentication();

builder.Services.AddOcelot(builder.Configuration);
    //.AddDelegatingHandler<AuthenticationDelegatingHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

await app.UseOcelot();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
