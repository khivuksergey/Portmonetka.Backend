namespace Portmonetka.Authentication.Models
{
    public class UserCredentials
    {
        public string Name { get; set;} = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool KeepLoggedIn { get; set; }
    }
}
