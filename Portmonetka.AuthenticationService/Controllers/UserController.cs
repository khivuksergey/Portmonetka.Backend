using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.AuthenticationService.AuthenticationManager;
using Portmonetka.AuthenticationService.Models;
using System.Security.Claims;

namespace Portmonetka.AuthenticationService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IJwtAuthenticationManager _jwtAuthenticationManager;

        public UserController(UserDbContext context, IJwtAuthenticationManager jwtAuthenticationManager)
        {
            _context = context;
            _jwtAuthenticationManager = jwtAuthenticationManager;
        }

        [HttpGet] //TO-DO: for testing only, remove in production
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (!CheckIdentity(out int _))
                return Forbid();

            if (_context.Users == null)
                return NotFound();

            return await _context.Users
                .Where(u => u.DateDeleted == null)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (!CheckIdentity(out int _))
                return Forbid();

            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        [AllowAnonymous]
        [HttpPost("new")]
        public async Task<ActionResult<User>> PostNewUser(User user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_context.Users == null)
                return NotFound();

            if (user.Id != 0)
                return BadRequest("User Id must be 0");

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (!CheckIdentity(out int userId) || user.Id != userId)
                return Forbid();

            var existingUser = await _context.Users.FindAsync(user.Id);

            if (existingUser == null)
                return BadRequest($"User with id = {user.Id} was not found");

            _context.Entry(existingUser).CurrentValues.SetValues(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserCredentials userCredentials)
        {
            var token = _jwtAuthenticationManager.Authenticate(userCredentials.Name, userCredentials.Password);

            if (token is null)
                return Unauthorized();

            return Ok(token);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!CheckIdentity(out int userId) || id != userId)
                return Forbid();

            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            if (typeof(Auditable).IsAssignableFrom(typeof(User)))
            {
                user.DateDeleted = DateTimeOffset.UtcNow;
                _context.Users.Attach(user);
                _context.Entry(user).State = EntityState.Modified;
            }
            else
            {
                _context.Users.Remove(user);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CheckIdentity(out int userId)
        {
            userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return userId != 0;
        }
    }
}
