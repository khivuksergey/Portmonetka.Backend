using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portmonetka.Models;

public partial class Wallet
{
    [NotMapped]
    public decimal Balance
    {
        get
        {
            return Transactions.Sum(item => item.Amount);
        }
    }
}
