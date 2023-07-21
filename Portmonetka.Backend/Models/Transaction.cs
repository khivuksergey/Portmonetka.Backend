using System.ComponentModel.DataAnnotations;

namespace Portmonetka.Models;

public partial class Transaction : Auditable
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MinLength(1, ErrorMessage = "Description should at least be 1 symbol")]
    [MaxLength(256, ErrorMessage = "Description should be less than 256 symbols")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Amount is required")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Date is required")]
    public DateTimeOffset Date { get; set; }

    [Required(ErrorMessage = "Category is required")]
    public int? CategoryId { get; set; }

    public int? WalletId { get; set; }

    public virtual Category? Category { get; set; }

    public virtual Wallet? Wallet { get; set; }
}
