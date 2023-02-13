using System;
using System.Collections.Generic;

namespace Portmonetka.Models;

public partial class Transaction
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public int? CategoryId { get; set; }

    public int? WalletId { get; set; }

    public virtual Category? Category { get; set; }

    public virtual Wallet? Wallet { get; set; }
}
