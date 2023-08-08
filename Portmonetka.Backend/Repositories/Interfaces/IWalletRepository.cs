using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Repositories.Interfaces
{
    public interface IWalletRepository : IRepository<Wallet>
    {
        public Task<bool> HasTransactionsAsync(int id, int userId);
    }
}
