using System.ComponentModel.DataAnnotations;

namespace Portmonetka.Backend.Models;

public class TransactionTemplate : Auditable
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MinLength(1, ErrorMessage = "Description should at least be 1 symbol")]
    [MaxLength(256, ErrorMessage = "Description should be less than 256 symbols")]
    public string? Description { get; set; }

    public decimal? Amount { get; set; }

    public int? CategoryId { get; set; }
}
