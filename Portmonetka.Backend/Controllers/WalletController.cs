using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : AuthorizableController
    {
        private readonly WalletRepository _wallets;

        public WalletController(WalletRepository wallets)
        {
            _wallets = wallets;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Wallet>>> GetWallets()
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var wallets = await _wallets.FindByUserId(userId);

            if (wallets == null)
                return NotFound("No wallets were found for the user");

            return Ok(wallets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Wallet>> GetWallet(int id)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var wallet = await _wallets.FindById(id, userId);

            if (wallet == null)
                return NotFound($"Wallet with id = {id} was not found");

            return wallet;
        }

        [HttpPost]
        public async Task<ActionResult<Wallet>> PostWallet(Wallet wallet)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //For testing
            if (wallet.Name!.ToLower() == "error")
            {
                return StatusCode(500, "Wallet was not created, try again");
            }

            if (wallet.Id != 0)
                return BadRequest("New wallet's id should be 0");

            try
            {
                await _wallets.Add(wallet);
                return CreatedAtAction(nameof(GetWallet), new { id = wallet.Id }, wallet);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while adding the wallet");
            }
        }

        [HttpPost("update")]
        public async Task<ActionResult<Wallet>> UpdateWallet(Wallet wallet)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedWallet = await _wallets.Update(wallet);

                if (updatedWallet == null)
                    return NotFound("Wallet was not found");

                return Ok(updatedWallet);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while updating the wallet");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWallet(int id, [FromQuery] bool force = false)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var wallet = await _wallets.FindById(id, userId);

            if (wallet == null)
                return NotFound($"Wallet with id {id} was not found");

            if (!force)
            {
                var hasTransactions = await _wallets.HasTransactions(id, userId);

                if (hasTransactions)
                    return Ok(new { ConfirmationRequired = true });
            }

            try
            {
                await _wallets.Delete(wallet);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while deleting wallet");
            }
        }
    }
}
