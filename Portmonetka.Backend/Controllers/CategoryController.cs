using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Portmonetka.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly PortmonetkaDbContext _dbContext;
        public CategoryController(PortmonetkaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (_dbContext.Categories == null)
                return NotFound();

            return await (_dbContext.Categories
                .Where(c => c.UserId == userId && c.DateDeleted == null)
                .ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (_dbContext.Categories == null)
                return NotFound();

            var category = await (_dbContext.Categories
                .Where(c => c.UserId == userId && c.Id == id)
                .FirstOrDefaultAsync());

            if (category == null)
                return NotFound();

            return category;
        }

        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (category.Id == 0)
            {
                _dbContext.Categories.Add(category);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
            }
            else
            {
                var existingCategory = await (_dbContext.Categories
                    .Where(c => c.UserId == userId && c.Id == category.Id)
                    .FirstOrDefaultAsync());

                if (existingCategory == null)
                {
                    return BadRequest($"Category with id = {category.Id} was not found");
                }

                _dbContext.Entry(existingCategory).CurrentValues.SetValues(category);

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
        public async Task<ActionResult> DeleteCategory(int id, [FromQuery] bool force = false)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (_dbContext.Categories == null)
                return NotFound();

            var category = await (_dbContext.Categories
                .Where(c => c.UserId == userId && c.Id == id)
                .FirstOrDefaultAsync());

            if (category == null)
                return NotFound();

            if (!force)
            {
                var hasTransactions = await (_dbContext.Transactions
                    .AnyAsync(t => t.UserId == userId && t.CategoryId == id));

                if (hasTransactions)
                {
                    return Ok(new { ConfirmationRequired = true });
                }
            }

            if (typeof(Auditable).IsAssignableFrom(typeof(Category)))
            {
                category.DateDeleted = DateTimeOffset.UtcNow;
                _dbContext.Categories.Attach(category);
                _dbContext.Entry(category).State = EntityState.Modified;
            }
            else
            {
                _dbContext.Categories.Remove(category);
            }

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool CheckIdentity(out int userId)
        {
            userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return userId != 0;
        }
    }
}

