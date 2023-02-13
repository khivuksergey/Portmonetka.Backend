using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.Models;

namespace Portmonetka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly PortmonetkaDbContext _dbContext;

        public WalletController(PortmonetkaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Wallet>>> GetWallets()
        {
            if (_dbContext.Wallets == null)
                return NotFound();

            return await _dbContext.Wallets.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Wallet>> GetWallet(int id)
        {
            if (_dbContext.Wallets == null)
                return NotFound();

            var wallet = await _dbContext.Wallets.FindAsync(id);
            if (wallet == null)
                return NotFound();

            return wallet;
        }

        [HttpPost]
        public async Task<ActionResult<Wallet>> PostWallet(Wallet wallet)
        {
            //Validate
            _dbContext.Wallets.Add(wallet);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWallet), new { id = wallet.Id }, wallet);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutWallet(int id, Wallet wallet)
        {
            //Validate
            if (id != wallet.Id)
                return BadRequest();

            _dbContext.Entry(wallet).State = EntityState.Modified;
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch(DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWallet(int id)
        {
            if (_dbContext.Wallets == null)
                return NotFound();

            var wallet = await (_dbContext.Wallets.FindAsync(id));
            if (wallet == null)
                return NotFound();

            _dbContext.Wallets.Remove(wallet);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
