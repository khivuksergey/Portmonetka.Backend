using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Repositories
{
    public class WalletRepository : IWalletRepository
    {
        private readonly PortmonetkaDbContext _context;

        public WalletRepository(PortmonetkaDbContext context)
        {
            _context = context;
        }

        public bool Exist()
        {
            return _context.Wallets.Any();
        }

        public async Task<Wallet> FindByIdAsync(int id, int userId)
        {
            return await _context.Wallets
                .Where(w =>
                    w.UserId == userId &&
                    w.Id == id &&
                    w.DateDeleted == null)
                .FirstAsync();
        }

        public async Task<IEnumerable<Wallet>> FindByUserIdAsync(int userId)
        {
            return await _context.Wallets
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null)
                .ToListAsync();
        }

        public async Task AddAsync(Wallet wallet)
        {
            _context.Add(wallet);
            await _context.SaveChangesAsync();
        }

        public async Task<Wallet?> UpdateAsync(Wallet wallet)
        {
            var existingWallet = await _context.Wallets.FindAsync(wallet.Id);

            if (existingWallet != null)
            {
                _context.Entry(existingWallet).CurrentValues.SetValues(wallet);
                await _context.SaveChangesAsync();
                return existingWallet;
            }

            return null;
        }

        public async Task DeleteAsync(Wallet wallet)
        {
            if (typeof(Auditable).IsAssignableFrom(typeof(Wallet)))
            {
                wallet.DateDeleted = DateTimeOffset.UtcNow;
                _context.Wallets.Attach(wallet);
                _context.Entry(wallet).State = EntityState.Modified;
            }
            else
            {
                _context.Wallets.Remove(wallet);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasTransactionsAsync(int id, int userId)
        {
            return await _context.Transactions
                    .AnyAsync(t => t.UserId == userId && t.WalletId == id);
        }
    }
}
