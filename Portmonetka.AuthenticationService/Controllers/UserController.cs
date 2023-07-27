using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.AuthenticationService.AuthenticationManager;
using Portmonetka.AuthenticationService.Models;
using Portmonetka.AuthenticationService.Repositories;
using System.Security.Claims;

namespace Portmonetka.AuthenticationService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _users;
        private readonly IJwtAuthenticationManager _jwtAuthenticationManager;

        public UserController(UserRepository users, IJwtAuthenticationManager jwtAuthenticationManager)
        {
            _users = users;
            _jwtAuthenticationManager = jwtAuthenticationManager;
        }

        #region Test Methods

        [HttpGet] //TO-DO: for testing only, remove in production
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (!CheckIdentity(out int _))
                return Forbid();

            if (!_users.Exist())
                return NotFound();

            var users = await _users.GetUsers();

            return Ok(users);
        }

        #endregion

        #region Authentication and Login

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Authenticate([FromBody] UserCredentials userCredentials)
        {
            var token = _jwtAuthenticationManager.Authenticate(userCredentials.Name, userCredentials.Password, userCredentials.KeepLoggedIn);

            if (token is null)
                return Unauthorized("Invalid user name or password");

            return Ok(token);
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult<User>> SignUp(User user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (user.Id != 0)
                return BadRequest("User Id must be 0");

            if (_users.UserNameExists(user.Name!))
                return BadRequest("User with this name already exists");

            try
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                await _users.Add(user);
                return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while signing up a new user");
            }

        }

        [AllowAnonymous]
        [HttpGet("checkusername/{userName}")]
        public ActionResult CheckUserNameExists(string userName)
        {
            if (userName is null)
                return BadRequest("User name is empty");

            bool userNameExists = _users.UserNameExists(userName);

            return userNameExists ? Ok() : NotFound("User doesn't exist");
        }

        #endregion

        #region User Actions

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (!CheckIdentity(out int _))
                return Forbid();

            var user = await _users.FindById(id);

            if (user == null)
                return NotFound($"User with id = {id} was not found");

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> UpdateUser(User user)
        {
            if (!CheckIdentity(out int userId) || user.Id != userId)
                return Forbid();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedUser = await _users.Update(user);

                if (updatedUser == null)
                    return NotFound("User was not found");

                return Ok(updatedUser);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while updating the user");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!CheckIdentity(out int userId) || id != userId)
                return Forbid();

            var user = await _users.FindById(id);

            if (user == null)
                return NotFound($"User with id {id} was not found");

            try
            {
                await _users.Delete(user);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while deleting user");
            }
        }

        #endregion

        private bool CheckIdentity(out int userId)
        {
            userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return userId != 0;
        }
    }
}
