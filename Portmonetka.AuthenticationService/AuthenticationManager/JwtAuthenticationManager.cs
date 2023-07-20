using Microsoft.IdentityModel.Tokens;
using Portmonetka.AuthenticationService.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portmonetka.AuthenticationService.AuthenticationManager
{
    public class JwtAuthenticationManager : IJwtAuthenticationManager
    {
        private UserDbContext _context;
        private readonly string _key = Environment.GetEnvironmentVariable("JWT_SECRET")!;

        public JwtAuthenticationManager(UserDbContext context)
        {
            _context = context;
        }

        public string? Authenticate(string userName, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Name == userName);
            if (user == null)
            {
                return null;
            }

            bool isVerified = BCrypt.Net.BCrypt.Verify(password, user.Password);
            if (!isVerified)
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenKey = Encoding.ASCII.GetBytes(_key);

            var tokenDesctiptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userName)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDesctiptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
