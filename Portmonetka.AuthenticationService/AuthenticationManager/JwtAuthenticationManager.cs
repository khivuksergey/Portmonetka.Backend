﻿using Microsoft.IdentityModel.Tokens;
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
        private readonly string _iss = Environment.GetEnvironmentVariable("AUTH_SERVICE")!;

        public JwtAuthenticationManager(UserDbContext context)
        {
            _context = context;
        }

        public AuthenticationToken? Authenticate(string userName, string password)
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
                    new Claim(ClaimTypes.Name, userName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Iss, _iss)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDesctiptor);

            var expirationTimeStamp = DateTime.Now.AddHours(1);

            return new AuthenticationToken(user.Id, tokenHandler.WriteToken(token), (int)expirationTimeStamp.Subtract(DateTime.Now).TotalSeconds);
        }
    }
}