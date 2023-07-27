using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Repositories
{
    public class TransactionRepository : IRepository<Transaction>
    {
        private readonly PortmonetkaDbContext _context;

        public TransactionRepository(PortmonetkaDbContext context)
        {
            _context = context;
        }

        public bool Exist()
        {
            return _context.Transactions.Any();
        }

        public async Task<Transaction> FindById(int id, int userId)
        {
            return await _context.Transactions
                .Where(w =>
                    w.UserId == userId &&
                    w.Id == id &&
                    w.DateDeleted == null)
                .FirstAsync();
        }

        public async Task<IEnumerable<Transaction>> FindByUserId(int userId)
        {
            return await _context.Transactions
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> FindByWallet(int walletId, int userId)
        {
            return await _context.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == walletId &&
                        t.DateDeleted == null)
                    .OrderByDescending(t => t.Date)
                    .ThenByDescending(t => t.DateCreated)
                    .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> FindByWalletLast(int walletId, int userId, int count)
        {
            return await _context.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == walletId &&
                        t.DateDeleted == null)
                    .OrderByDescending(t => t.Date)
                    .ThenByDescending(t => t.DateCreated)
                    .Take(count)
                    .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> FindByCurrency(int userId, string currency)
        {
            currency = currency.ToUpper();

            var walletsWithCurrency = await _context.Wallets
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null &&
                    w.Currency == currency)
                .ToListAsync();

            List<Transaction> transactionsResult = new();

            foreach (var wallet in walletsWithCurrency)
            {
                var transactions = await _context.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == wallet.Id &&
                        t.DateDeleted == null)
                    .ToListAsync();

                transactionsResult.AddRange(transactions);
            }

            return transactionsResult;
        }

        public async Task Add(Transaction transaction)
        {
            _context.Add(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task AddRange(IEnumerable<Transaction> transactions)
        {
            await _context.Transactions.AddRangeAsync(transactions);
            await _context.SaveChangesAsync();
        }

        public async Task<Transaction?> Update(Transaction transaction)
        {
            var existingTransaction = await _context.Transactions.FindAsync(transaction.Id);

            if (existingTransaction != null)
            {
                _context.Entry(existingTransaction).CurrentValues.SetValues(transaction);
                await _context.SaveChangesAsync();
                return existingTransaction;
            }

            return null;
        }

        public async Task Delete(Transaction transaction)
        {
            if (typeof(Auditable).IsAssignableFrom(typeof(Transaction)))
            {
                transaction.DateDeleted = DateTimeOffset.UtcNow;
                _context.Transactions.Attach(transaction);
                _context.Entry(transaction).State = EntityState.Modified;
            }
            else
            {
                _context.Transactions.Remove(transaction);
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeleteRange(IEnumerable<Transaction> transactions)
        {

            if (typeof(Auditable).IsAssignableFrom(typeof(Transaction)))
            {
                foreach (var transaction in transactions)
                {
                    transaction.DateDeleted = DateTimeOffset.UtcNow;
                    _context.Transactions.Attach(transaction);
                    _context.Entry(transaction).State = EntityState.Modified;
                }
            }
            else
            {
                _context.Transactions.RemoveRange(transactions);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Transaction>> FindExistingById(int userId, IEnumerable<int> ids)
        {
            return await _context.Transactions
                    .Where(t => t.UserId == userId && ids.Contains(t.Id))
                    .ToListAsync();
        }
    }
}
