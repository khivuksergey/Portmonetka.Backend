using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Services
{
    public interface ITransactionService
    {
        public Task<IEnumerable<Transaction>> GetUserTransactions(int userId);

        public Task<IEnumerable<Transaction>> GetUserTransactionsByWallet(int walletId, int userId, int? count);

        public Task<IEnumerable<Transaction>> GetUserTransactionsByCurrency(int userId, string currency);

        public Task<IEnumerable<Transaction>> GetExistingTransactionsById(int userId, IEnumerable<int> ids);
        
        public Task<Transaction> GetTransaction(int id, int userId);

        public Task Add(Transaction transaction);

        public Task Add(IEnumerable<Transaction> transactions);

        public Task<Transaction?> Update(Transaction transaction);

        public Task<(IEnumerable<Transaction> UpdatedTransactions, IEnumerable<Transaction> NotFoundTransactions)> Update(IEnumerable<Transaction> transactions);

        public Task Delete(Transaction transaction);

        public Task Delete(IEnumerable<Transaction> transactions);
    }

    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactions;

        public TransactionService(ITransactionRepository transactions)
        {
            _transactions = transactions;
        }

        public async Task<IEnumerable<Transaction>> GetUserTransactions(int userId)
        {
            return await _transactions.FindByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Transaction>> GetUserTransactionsByWallet(int walletId, int userId, int? count)
        {
            return count.HasValue ?
                await _transactions.FindByWalletLastAsync(walletId, userId, count.Value) :
                await _transactions.FindByWalletAsync(walletId, userId);
        }

        public async Task<IEnumerable<Transaction>> GetUserTransactionsByCurrency(int userId, string currency)
        {
            return await _transactions.FindByCurrencyAsync(userId, currency);
        }

        public async Task<IEnumerable<Transaction>> GetExistingTransactionsById(int userId, IEnumerable<int> ids)
        {
            return await _transactions.FindExistingByIdAsync(userId, ids);
        }

        public async Task<Transaction> GetTransaction(int id, int userId)
        {
            return await _transactions.FindByIdAsync(id, userId);
        }

        public async Task Add(Transaction transaction)
        {
            await _transactions.AddAsync(transaction);
        }

        public async Task Add(IEnumerable<Transaction> transactions)
        {
            await _transactions.AddAsync(transactions);
        }

        public async Task<Transaction?> Update(Transaction transaction)
        {
            return await _transactions.UpdateAsync(transaction);
        }

        public async Task<(IEnumerable<Transaction> UpdatedTransactions, IEnumerable<Transaction> NotFoundTransactions)> Update(IEnumerable<Transaction> transactions)
        {
            var updatedTransactions = new List<Transaction>();
            var notFoundTransactions = new List<Transaction>();

            foreach (var transaction in transactions)
            {
                var updatedTransaction = await _transactions.UpdateAsync(transaction);
                if (updatedTransaction != null)
                {
                    updatedTransactions.Add(updatedTransaction);
                }
                else
                {
                    notFoundTransactions.Add(transaction);
                }
            }

            return (updatedTransactions, notFoundTransactions);
        }

        public async Task Delete(Transaction transaction)
        {
            await _transactions.DeleteAsync(transaction);
        }

        public async Task Delete(IEnumerable<Transaction> transactions)
        {
            await _transactions.DeleteAsync(transactions);
        }
    }
}
