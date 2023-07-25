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
    public class WalletController : BaseAuthorizableController
    {
        private readonly PortmonetkaDbContext _dbContext;
        public WalletController(PortmonetkaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Wallet>>> GetWallets()
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_dbContext.Wallets == null)
                return NotFound();

            return await _dbContext.Wallets
                .Where(w => w.UserId == userId && w.DateDeleted == null)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Wallet>> GetWallet(int id)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_dbContext.Wallets == null)
                return NotFound();

            var wallet = await _dbContext.Wallets
                .Where(w => w.Id == id && w.UserId == userId)
                .FirstOrDefaultAsync();

            if (wallet == null)
                return NotFound();

            return wallet;
        }

        [HttpPost]
        public async Task<ActionResult<Wallet>> PostWallet(Wallet wallet)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //For testing
            if (wallet.Name!.ToLower() == "error")
            {
                return StatusCode(500, "Wallet was not created, try again");
            }

            if (wallet.Id == 0)
            {
                _dbContext.Wallets.Add(wallet);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetWallet), new { id = wallet.Id }, wallet);
            }
            else
            {
                var existingWallet = await _dbContext.Wallets.FindAsync(wallet.Id);

                if (existingWallet == null)
                {
                    return BadRequest($"Wallet with id = {wallet.Id} was not found");
                }

                _dbContext.Entry(existingWallet).CurrentValues.SetValues(wallet);

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
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWallet(int id, [FromQuery] bool force = false)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_dbContext.Wallets == null)
                return NotFound();

            var wallet = await _dbContext.Wallets
                .Where(w => w.UserId == userId && w.Id == id)
                .FirstOrDefaultAsync();

            if (wallet == null)
                return NotFound();

            if (!force)
            {
                var hasTransactions = await _dbContext.Transactions
                    .AnyAsync(t => t.UserId == userId && t.WalletId == id);

                if (hasTransactions)
                {
                    return Ok(new { ConfirmationRequired = true });
                }
            }

            if (typeof(Auditable).IsAssignableFrom(typeof(Wallet)))
            {
                wallet.DateDeleted = DateTimeOffset.UtcNow;
                _dbContext.Wallets.Attach(wallet);
                _dbContext.Entry(wallet).State = EntityState.Modified;
            }
            else
            {
                _dbContext.Wallets.Remove(wallet);
            }

            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
