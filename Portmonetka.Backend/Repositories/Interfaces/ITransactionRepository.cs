using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Repositories.Interfaces
{
    public interface ITransactionRepository : IRepository<Transaction>
    {
        public Task<IEnumerable<Transaction>> FindByWalletAsync(int walletId, int userId, CancellationToken cancellationToken);

        public Task<IEnumerable<Transaction>> FindByWalletLastAsync(int walletId, int userId, int count, CancellationToken cancellationToken);

        public Task<IEnumerable<Transaction>> FindByCurrencyAsync(int userId, string currency, CancellationToken cancellationToken);

        public Task<IEnumerable<Transaction>> FindExistingByIdAsync(int userId, IEnumerable<int> ids);

        public Task AddAsync(IEnumerable<Transaction> transactions);

        public Task DeleteAsync(IEnumerable<Transaction> transactions);
    }
}
