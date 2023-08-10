using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Repositories
{
    public class TransactionRepository : ITransactionRepository
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

        public async Task<Transaction> FindByIdAsync(int id, int userId)
        {
            return await _context.Transactions
                .Where(w =>
                    w.UserId == userId &&
                    w.Id == id &&
                    w.DateDeleted == null)
                .FirstAsync();
        }

        public async Task<IEnumerable<Transaction>> FindByUserIdAsync(int userId)
        {
            return await _context.Transactions
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> FindByWalletAsync(int walletId, int userId, CancellationToken cancellationToken)
        {
            return await _context.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == walletId &&
                        t.DateDeleted == null)
                    .OrderByDescending(t => t.Date)
                    .ThenByDescending(t => t.DateCreated)
                    .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Transaction>> FindByWalletLastAsync(int walletId, int userId, int count, CancellationToken cancellationToken)
        {
            return await _context.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == walletId &&
                        t.DateDeleted == null)
                    .OrderByDescending(t => t.Date)
                    .ThenByDescending(t => t.DateCreated)
                    .Take(count)
                    .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Transaction>> FindByCurrencyAsync(int userId, string currency, CancellationToken cancellationToken)
        {
            currency = currency.ToUpper();

            var walletsWithCurrency = await _context.Wallets
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null &&
                    w.Currency == currency)
                .ToListAsync(cancellationToken);

            List<Transaction> transactionsResult = new();

            foreach (var wallet in walletsWithCurrency)
            {
                var transactions = await _context.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == wallet.Id &&
                        t.DateDeleted == null)
                    .ToListAsync(cancellationToken);

                transactionsResult.AddRange(transactions);
            }

            return transactionsResult;
        }

        public async Task AddAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task AddAsync(IEnumerable<Transaction> transactions)
        {
            _context.Transactions.AddRange(transactions);
            await _context.SaveChangesAsync();
        }

        public async Task<Transaction?> UpdateAsync(Transaction transaction)
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

        public async Task DeleteAsync(Transaction transaction)
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

        public async Task DeleteAsync(IEnumerable<Transaction> transactions)
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

        public async Task<IEnumerable<Transaction>> FindExistingByIdAsync(int userId, IEnumerable<int> ids)
        {
            return await _context.Transactions
                    .Where(t => t.UserId == userId && ids.Contains(t.Id))
                    .ToListAsync();
        }
    }
}
