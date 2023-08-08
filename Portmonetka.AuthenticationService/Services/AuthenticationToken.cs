namespace Portmonetka.Authentication.Services
{
    public record AuthenticationToken(int UserId, string UserName, string Token, DateTimeOffset ExpireTime);
}
