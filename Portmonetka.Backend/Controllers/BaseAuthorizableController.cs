using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Portmonetka.Backend.Controllers
{
    public class BaseAuthorizableController: ControllerBase
    {
        public bool CheckIdentity(out int userId)
        {
            var user = HttpContext.User;

            userId = Convert.ToInt32(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return userId != 0;
        }
    }
}
