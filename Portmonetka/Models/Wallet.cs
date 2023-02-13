using System;
using System.Collections.Generic;

namespace Portmonetka.Models;

public partial class Wallet
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Currency { get; set; } = null!;

    public decimal InitialAmount { get; set; }

    public string? IconFileName { get; set; }

    public virtual ICollection<Transaction> Transactions { get; } = new List<Transaction>();
}
