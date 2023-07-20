namespace Portmonetka.AuthenticationService.AuthenticationManager
{
    public interface IJwtAuthenticationManager
    {
        string? Authenticate(string userName, string password);
    }
}
