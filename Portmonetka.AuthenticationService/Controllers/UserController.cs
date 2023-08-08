using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Authentication.Models;
using Portmonetka.Authentication.Services;
using System.Security.Claims;

namespace Portmonetka.Authentication.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserService _userService;

        public UserController(IUserService userService, IAuthenticationService authenticationService)
        {
            _userService = userService;
            _authenticationService = authenticationService;
        }

        #region Test Methods

        [HttpGet] //TO-DO: for testing only, remove in production
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (!CheckIdentity(out int _))
                return Forbid();

            var users = await _userService.GetUsers();

            if (!users.Any())
                return NotFound("No users were found");

            return Ok(users);
        }

        #endregion

        #region Authentication and Login

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Authenticate([FromBody] UserCredentials userCredentials)
        {
            var token = _authenticationService.Authenticate(userCredentials);

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
                return BadRequest("User id must be 0");

            bool alreadyExists = await _userService.UserExists(user.Name);

            if (alreadyExists)
                return BadRequest("User with this name already exists");

            try
            {
                await _userService.Add(user);
                return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while signing up a new user");
            }

        }

        [AllowAnonymous]
        [HttpGet("checkusername/{userName}")]
        public async Task<ActionResult> CheckUserNameExists(string userName)
        {
            if (userName is null)
                return BadRequest("User name is empty");

            bool userNameExists = await _userService.UserExists(userName);

            return userNameExists ? Ok() : NotFound("User doesn't exist");
        }

        #endregion

        #region User Actions

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (!CheckIdentity(out int _))
                return Forbid();

            var user = await _userService.GetUserById(id);

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
                var updatedUser = await _userService.Update(user);

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

            var user = await _userService.GetUserById(id);

            if (user == null)
                return NotFound($"User with id {id} was not found");

            try
            {
                await _userService.Delete(user);
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
