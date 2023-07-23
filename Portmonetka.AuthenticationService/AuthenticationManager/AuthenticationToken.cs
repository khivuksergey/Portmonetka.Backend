namespace Portmonetka.AuthenticationService.AuthenticationManager
{
    public record AuthenticationToken(int UserId, string Token, DateTimeOffset ExpireTime);
}
