namespace Portmonetka.AuthenticationService.AuthenticationManager
{
    public interface IJwtAuthenticationManager
    {
        AuthenticationToken? Authenticate(string userName, string password);
    }
}
