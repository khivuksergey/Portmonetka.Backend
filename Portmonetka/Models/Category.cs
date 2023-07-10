using System.ComponentModel.DataAnnotations;

namespace Portmonetka.Models;

public partial class Category: Auditable
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Name is required")]
    [MinLength(1, ErrorMessage = "Name length should at least be 1 symbol")]
    [MaxLength(128, ErrorMessage = "Name length should be less than 128 symbols")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Category type is required (income/expense)")]
    public bool? IsExpense { get; set; }

    public string? IconFileName { get; set; }

    public virtual ICollection<Transaction> Transactions { get; } = new List<Transaction>();
}
