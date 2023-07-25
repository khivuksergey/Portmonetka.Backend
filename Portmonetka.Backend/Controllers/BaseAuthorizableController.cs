using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Portmonetka.Backend.Controllers
{
    public class BaseAuthorizableController: ControllerBase
    {
        public bool CheckIdentity(ClaimsPrincipal user, out int userId)
        {
            userId = Convert.ToInt32(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return userId != 0;
        }
    }
}
