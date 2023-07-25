using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionTemplateController : BaseAuthorizableController
    {
        private readonly PortmonetkaDbContext _context;

        public TransactionTemplateController(PortmonetkaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionTemplate>>> GetTransactionTemplates()
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_context.TransactionTemplates == null)
                return NotFound();

            return await _context.TransactionTemplates
                .Where(t => t.UserId == userId && t.DateDeleted == null)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TransactionTemplate>> PostTransactionTemplates(IEnumerable<TransactionTemplate> templates)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            var existingTemplateIds = templates.Where(t => t.Id != 0).Select(t => t.Id);

            if (existingTemplateIds.Any())
            {
                var existingTemplates = await _context.TransactionTemplates
                    .Where(t => t.UserId == userId && existingTemplateIds.Contains(t.Id))
                    .ToListAsync();

                foreach (var existingTemplate in existingTemplates)
                {
                    var updatedTemplate = templates.First(t => t.Id == existingTemplate.Id);
                    _context.Entry(existingTemplate).CurrentValues.SetValues(updatedTemplate);
                }
            }

            var newTemplates = templates.Where(t => t.Id == 0);

            await _context.TransactionTemplates.AddRangeAsync(newTemplates);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransactionTemplates), templates.Select(t => new { id = t.Id }), templates);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTransactionTemplates(IEnumerable<int> ids)
        {
            if (!CheckIdentity(User, out int userId))
                return Forbid();

            if (_context.TransactionTemplates == null)
                return NotFound();

            var templatesToDelete = _context.TransactionTemplates.Where(t => t.UserId == userId && ids.Any(id => id == t.Id));

            if (templatesToDelete == null)
                return NotFound();

            foreach (var template in templatesToDelete)
            {
                if (typeof(Auditable).IsAssignableFrom(typeof(TransactionTemplate)))
                {
                    template.DateDeleted = DateTimeOffset.UtcNow;
                    _context.TransactionTemplates.Attach(template);
                    _context.Entry(template).State = EntityState.Modified;
                }
                else
                {
                    _context.TransactionTemplates.Remove(template);
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
