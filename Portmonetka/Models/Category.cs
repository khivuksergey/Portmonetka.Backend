using System;
using System.Collections.Generic;

namespace Portmonetka.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool? IsExpense { get; set; }

    public string? IconFileName { get; set; }

    public virtual ICollection<Transaction> Transactions { get; } = new List<Transaction>();
}
