using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.Models;

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

            return await _dbContext.Transactions.ToListAsync();
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

            return await _dbContext.Transactions.Where(x => x.WalletId == walletId).ToListAsync();
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

            var transaction = await (_dbContext.Transactions.FindAsync(id));
            if (transaction == null)
                return NotFound();

            _dbContext.Transactions.Remove(transaction);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Route("delete/wallet/{walletId}")]
        [HttpDelete("{walletId}")]
        public async Task<ActionResult> DeleteTransactionsByWallet(int walletId)
        {
            if (_dbContext.Transactions == null)
                return NotFound();

            var transactions = _dbContext.Transactions.Where(t => t.WalletId == walletId);

            if (transactions != null)
                _dbContext.Transactions.RemoveRange(transactions);

            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
