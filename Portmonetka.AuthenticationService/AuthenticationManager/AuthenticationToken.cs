namespace Portmonetka.AuthenticationService.AuthenticationManager
{
    public record AuthenticationToken(int UserId, string UserName, string Token, DateTimeOffset ExpireTime);
}
