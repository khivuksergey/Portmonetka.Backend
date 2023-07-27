using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : AuthorizableController
    {
        private readonly TransactionRepository _transactions;
        public TransactionController(TransactionRepository transactions)
        {
            _transactions = transactions;
        }

        #region GET

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (!_transactions.Exist())
                return NotFound();

            var transactions = await _transactions.FindByUserId(userId);

            return Ok(transactions);
        }

        [HttpGet("wallet/{walletId}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByWallet(int walletId, [FromQuery(Name = "latest")] int? count)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            bool transactionsExist = (await _transactions.FindByUserId(userId)).Any();

            if (!transactionsExist)
                return NotFound("No transactions were found for the user");

            IEnumerable<Transaction> transactions;

            if (count.HasValue)
            {
                transactions = await _transactions.FindByWalletLast(walletId, userId, count.Value);
            }
            else
            {
                transactions = await _transactions.FindByWallet(walletId, userId);
            }

            return Ok(transactions);
        }

        [HttpGet("currency/{currency}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByCurrency(string currency)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (currency == null || currency.Length != 3)
                return BadRequest("Invalid currency");

            if (!_transactions.Exist())
                return NotFound();

            var transactions = await _transactions.FindByCurrency(userId, currency);

            return Ok(transactions);
        }

        #endregion

        #region POST

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Transaction>>> PostTransactions(IEnumerable<Transaction> transactions)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            try
            {
                await _transactions.AddRange(transactions);
                return CreatedAtAction(nameof(GetTransactions), transactions.Select(t => new { id = t.Id }), transactions);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while adding transactions");
            }
        }

        [HttpPost("update")]
        public async Task<ActionResult<IEnumerable<Transaction>>> UpdateTransactions(IEnumerable<Transaction> transactions)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            bool transactionsExist = (await _transactions.FindByUserId(userId)).Any();

            if (!transactionsExist)
                return NotFound("No transactions were found for the user");

            try
            {
                var updatedTransactions = new List<Transaction>();
                var notFoundTransactions = new List<int>();

                foreach (var transaction in transactions)
                {
                    var updatedTransaction = await _transactions.Update(transaction);
                    if (updatedTransaction != null)
                    {
                        updatedTransactions.Add(updatedTransaction);
                    }
                    else
                    {
                        notFoundTransactions.Add(transaction.Id);
                    }
                }

                if (updatedTransactions.Count > 0)
                {
                    return Ok(new { UpdatedTransactions = updatedTransactions, NotFoundTransactionIds = notFoundTransactions });
                }
                else
                {
                    return NotFound("No transactions were found for update");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while updating transactions");
            }
        }

        #endregion

        #region DELETE

        [HttpDelete]
        public async Task<ActionResult> DeleteTransactions(IEnumerable<int> ids)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            bool transactionsExist = (await _transactions.FindByUserId(userId)).Any();

            if (!transactionsExist)
                return NotFound("No transactions exist for the user");

            var transactionsToDelete = await _transactions.FindExistingById(userId, ids);

            if (transactionsToDelete == null)
                return BadRequest("No transactions were found for the provided ids");

            try
            {
                await _transactions.DeleteRange(transactionsToDelete);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while deleting transactions");
            }
        }

        #endregion
    }
}
