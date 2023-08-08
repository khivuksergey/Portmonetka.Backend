using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Services
{
    public interface IWalletService
    {
        public Task<IEnumerable<Wallet>> GetUserWallets(int userId);

        public Task<Wallet> GetWallet(int id, int userId);

        public Task Add(Wallet wallet);

        public Task<Wallet?> Update(Wallet wallet);

        public Task Delete(Wallet wallet);

        public Task<bool> IsEmpty(int id, int userid);
    }

    public class WalletService : IWalletService
    {
        private readonly IWalletRepository _wallets;

        public WalletService(IWalletRepository wallets)
        {
            _wallets = wallets;
        }

        public async Task<IEnumerable<Wallet>> GetUserWallets(int userId)
        {
            return await _wallets.FindByUserIdAsync(userId);
        }

        public async Task<Wallet> GetWallet(int id, int userId)
        {
            return await _wallets.FindByIdAsync(id, userId);
        }

        public async Task Add(Wallet wallet)
        {
            await _wallets.AddAsync(wallet);
        }

        public async Task<Wallet?> Update(Wallet wallet)
        {
            return await _wallets.UpdateAsync(wallet);
        }

        public async Task Delete(Wallet wallet)
        {
            await _wallets.DeleteAsync(wallet);
        }

        public async Task<bool> IsEmpty(int id, int userId)
        {
            bool hasTransactions = await _wallets.HasTransactionsAsync(id, userId);
            return !hasTransactions;
        }
    }
}
