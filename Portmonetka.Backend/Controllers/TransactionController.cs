using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Services;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : AuthorizableController
    {
        private readonly ITransactionService _transactionService;
        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        #region GET

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var transactions = await _transactionService.GetUserTransactions(userId);

            if (!transactions.Any())
                return NotFound("No transactions were found for the user");

            return Ok(transactions);
        }

        [HttpGet("wallet/{walletId}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByWallet(int walletId, [FromQuery(Name = "latest")] int? count, CancellationToken cancellationToken)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            try
            {
                var transactions = await _transactionService.GetUserTransactionsByWallet(walletId, userId, count, cancellationToken);

                if (!transactions.Any())
                    return NotFound("No transactions were found int the wallet");

                return Ok(transactions);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499, "Operation was canceled");
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while getting transactions");
            }
        }

        [HttpGet("currency/{currency}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByCurrency(string currency, CancellationToken cancellationToken)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (string.IsNullOrEmpty(currency) || currency.Length != 3)
                return BadRequest("Invalid currency");

            try
            {
                var transactions = await _transactionService.GetUserTransactionsByCurrency(userId, currency, cancellationToken);

                if (transactions == null)
                    return NotFound($"No transactions were found with currency {currency}");

                return Ok(transactions);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499, "Operation was canceled");
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while getting transactions");
            }
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
                await _transactionService.Add(transactions);
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

            bool transactionsExist = (await _transactionService.GetUserTransactions(userId)).Any();

            if (!transactionsExist)
                return NotFound("No transactions were found for the user");

            try
            {
                var (updatedTransactions, notFoundTransactions) = await _transactionService.Update(transactions);

                if (updatedTransactions.Any())
                {
                    return Ok(new { UpdatedTransactions = updatedTransactions, NotFoundTransactions = notFoundTransactions });
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

            var transactionsToDelete = await _transactionService.GetExistingTransactionsById(userId, ids);

            if (transactionsToDelete == null)
                return BadRequest("No transactions were found for the provided ids");

            try
            {
                await _transactionService.Delete(transactionsToDelete);
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
