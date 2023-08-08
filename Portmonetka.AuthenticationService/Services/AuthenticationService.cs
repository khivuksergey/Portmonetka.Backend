using Microsoft.IdentityModel.Tokens;
using Portmonetka.Authentication.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portmonetka.Authentication.Services
{
    public interface IAuthenticationService
    {
        AuthenticationToken? Authenticate(UserCredentials userCredentials);
    }

    public class AuthenticationService : IAuthenticationService
    {
        private UserDbContext _context;
        private readonly string _key = Environment.GetEnvironmentVariable("JWT_SECRET")!;
        private readonly string _iss = Environment.GetEnvironmentVariable("AUTH_SERVICE")!;

        public AuthenticationService(UserDbContext context)
        {
            _context = context;
        }

        public AuthenticationToken? Authenticate(UserCredentials userCredentials)
        {
            var user = _context.Users.FirstOrDefault(u => u.Name == userCredentials.Name);

            if (user == null)
                return null;

            bool isVerified = BCrypt.Net.BCrypt.Verify(userCredentials.Password, user.Password);

            if (!isVerified)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenKey = Encoding.ASCII.GetBytes(_key);

            var expires = userCredentials.KeepLoggedIn ? DateTime.UtcNow.AddDays(14) : DateTime.UtcNow.AddHours(2);

            var tokenDesctiptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userCredentials.Name),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Iss, _iss)
                }),
                Expires = expires,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDesctiptor);

            return new AuthenticationToken(user.Id, user.Name, tokenHandler.WriteToken(token), expires);
        }
    }
}
