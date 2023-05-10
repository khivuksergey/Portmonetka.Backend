using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.Models;
using System.Linq;

namespace Portmonetka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly PortmonetkaDbContext _dbContext;

        public TransactionController(PortmonetkaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [Route("all")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            return await _dbContext.Transactions
                .Where(t => t.DateDeleted == null)
                .ToListAsync();
        }

        [Route("id/{id}")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            var transaction = await _dbContext.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            return transaction;
        }

        [Route("wallet/{walletId}")]
        [HttpGet("{walletId}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByWallet(int walletId)
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            return await _dbContext.Transactions
                .Where(t => t.WalletId == walletId && t.DateDeleted == null)
                .ToListAsync();
        }

        [Route("currency/{currency}")]
        [HttpGet("{currency}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByCurrency(string currency)
        {
            if (currency == null || currency.Length != 3)
                return NotFound();

            if (_dbContext.Transactions == null)
                return NotFound();

            currency = currency.ToUpper();

            var wallets = await _dbContext.Wallets
                .Where(w => w.Currency == currency && w.DateDeleted == null)
                .ToListAsync();

            List<Transaction> transactionsResult = new();

            foreach (var wallet in wallets)
            {
                var transactions = await _dbContext.Transactions
                    .Where(t => t.WalletId == wallet.Id && t.DateDeleted == null)
                    .ToListAsync();
                transactionsResult.AddRange(transactions);
            }

            return transactionsResult;
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Transaction>>> PostTransactions(IEnumerable<Transaction> transactions)
        {
            _dbContext.Transactions.AddRange(transactions);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransactions), transactions.Select(t => new { id = t.Id }), transactions);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutTransaction(int id, Transaction transaction)
        {
            //Validate
            if (id != transaction.Id)
                return BadRequest();

            _dbContext.Entry(transaction).State = EntityState.Modified;
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }

        [Route("delete/id/{id}")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTransaction(int id)
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            var transaction = await _dbContext.Transactions.FindAsync(id);

            if (transaction == null)
                return NotFound();

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

            //_dbContext.Transactions.Remove(transaction);

            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Route("delete")]
        [HttpDelete]
        public async Task<ActionResult> DeleteTransactiosn(IEnumerable<int> ids)
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            var transactionsToDelete = _dbContext.Transactions.Where(t => ids.Any(id => id == t.Id));

            if (transactionsToDelete == null)
                return NotFound();

            foreach ( var transaction in transactionsToDelete)
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

            return Ok();
        }

        [Route("delete/wallet/{walletId}")]
        [HttpDelete("{walletId}")]
        public async Task<ActionResult> DeleteTransactionsByWallet(int walletId)
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            var transactions = _dbContext.Transactions
                .Where(t => t.WalletId == walletId);

            if (transactions != null)
                _dbContext.Transactions.RemoveRange(transactions);

            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
