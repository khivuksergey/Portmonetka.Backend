using System.ComponentModel.DataAnnotations;
using System.Security.AccessControl;
using System.Transactions;

namespace Portmonetka.AuthenticationService.Models
{
    public class User: Auditable
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [MinLength(1, ErrorMessage = "Name length should at least be 1 symbol")]
        [MaxLength(32, ErrorMessage = "Name length should be less than 32 symbols")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
