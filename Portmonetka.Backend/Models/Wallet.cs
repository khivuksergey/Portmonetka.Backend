using System.ComponentModel.DataAnnotations;

namespace Portmonetka.Models;

public partial class Wallet: Auditable
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required(ErrorMessage = "Name is required")]
    [MinLength(1, ErrorMessage = "Name length should at least be 1 symbol")]
    [MaxLength(128, ErrorMessage = "Name length should be less than 128 symbols")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Currency is required")]
    [StringLength(3, ErrorMessage = "Currency length should be 3 symbols")]
    public string Currency { get; set; } = null!;

    [Required(ErrorMessage = "Wallet must have initial amount of funds")]
    public decimal InitialAmount { get; set; }

    public string? IconFileName { get; set; }

    public virtual ICollection<Transaction> Transactions { get; } = new List<Transaction>();
}
