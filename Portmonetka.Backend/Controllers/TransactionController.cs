using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;
using System.Security.Claims;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : BaseAuthorizableController
    {
        private readonly PortmonetkaDbContext _dbContext;
        public TransactionController(PortmonetkaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        #region GET

        [HttpGet("all")] //TO-DO: only for testing, remove in production
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            return await _dbContext.Transactions
                .Where(t => t.DateDeleted == null)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        [HttpGet("{id}")] //TO-DO: not used, remove later
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            var transaction = await _dbContext.Transactions.FindAsync(id);

            if (transaction == null)
                return NotFound();

            return transaction;
        }

        [HttpGet("wallet/{walletId}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByWallet(int walletId, [FromQuery(Name = "latest")] int? count)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_dbContext.Transactions == null)
                return NotFound();

            if (count.HasValue)
            {
                return await _dbContext.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == walletId &&
                        t.DateDeleted == null)
                    .OrderByDescending(t => t.Date)
                    .ThenByDescending(t => t.DateCreated)
                    .Take(count.Value)
                    .ToListAsync();
            }
            else
            {
                return await _dbContext.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == walletId &&
                        t.DateDeleted == null)
                    .OrderByDescending(t => t.Date)
                    .ThenByDescending(t => t.DateCreated)
                    .ToListAsync();
            }
        }

        [HttpGet("currency/{currency}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByCurrency(string currency)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (currency == null || currency.Length != 3)
                return BadRequest("Invalid currency");

            if (_dbContext.Transactions == null)
                return NotFound();

            currency = currency.ToUpper();

            var wallets = await _dbContext.Wallets
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null &&
                    w.Currency == currency)
                .ToListAsync();

            List<Transaction> transactionsResult = new();

            foreach (var wallet in wallets)
            {
                var transactions = await _dbContext.Transactions
                    .Where(t =>
                        t.UserId == userId &&
                        t.WalletId == wallet.Id &&
                        t.DateDeleted == null)
                    .ToListAsync();
                transactionsResult.AddRange(transactions);
            }

            return transactionsResult;
        }

        #endregion

        #region POST

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Transaction>>> PostTransactions(IEnumerable<Transaction> transactions)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            var existingTransactionIds = transactions.Where(t => t.Id != 0).Select(t => t.Id);

            if (existingTransactionIds.Any())
            {
                var existingTransactions = await _dbContext.Transactions
                    .Where(t => t.UserId == userId && existingTransactionIds.Contains(t.Id))
                    .ToListAsync();

                foreach (var existingTransaction in existingTransactions)
                {
                    var updatedTransaction = transactions.First(t => t.Id == existingTransaction.Id);
                    _dbContext.Entry(existingTransaction).CurrentValues.SetValues(updatedTransaction);
                }
            }

            var newTransactions = transactions.Where(t => t.Id == 0);

            await _dbContext.Transactions.AddRangeAsync(newTransactions);

            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransactions), transactions.Select(t => new { id = t.Id }), transactions);
        }

        #endregion

        #region DELETE

        [HttpDelete]
        public async Task<ActionResult> DeleteTransactions(IEnumerable<int> ids)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_dbContext.Transactions == null)
                return NotFound();

            var transactionsToDelete = _dbContext.Transactions.Where(t => t.UserId == userId && ids.Any(id => id == t.Id));

            if (transactionsToDelete == null)
                return NotFound();

            foreach (var transaction in transactionsToDelete)
            {
                if (typeof(Auditable).IsAssignableFrom(typeof(Transaction)))
                {
                    transaction.DateDeleted = DateTimeOffset.UtcNow;
                    _dbContext.Transactions.Attach(transaction);
                    _dbContext.Entry(transaction).State = EntityState.Modified;
                }
                else
                {
                    _dbContext.Transactions.Remove(transaction);
                }
            }

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("wallet/{walletId}")]
        public async Task<ActionResult> DeleteTransactionsByWallet(int walletId)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_dbContext.Transactions == null)
                return NotFound();

            var transactionsToDelete = _dbContext.Transactions
                .Where(t =>
                    t.UserId == userId &&
                    t.WalletId == walletId &&
                    t.DateDeleted == null);


            foreach (var transaction in transactionsToDelete)
            {
                if (typeof(Auditable).IsAssignableFrom(typeof(Transaction)))
                {
                    transaction.DateDeleted = DateTimeOffset.UtcNow;
                    _dbContext.Transactions.Attach(transaction);
                    _dbContext.Entry(transaction).State = EntityState.Modified;
                }
                else
                {
                    _dbContext.Transactions.Remove(transaction);
                }
            }

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        #endregion
    }
}
