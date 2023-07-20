using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portmonetka.Models;
using Microsoft.AspNetCore.Authorization;

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
            if (_dbContext.Categories == null)
                return NotFound();

            return await _dbContext.Categories
                .Where(c => c.DateDeleted == null)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            if (_dbContext.Categories == null)
                return NotFound();

            var category = await _dbContext.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            return category;
        }

        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            //Validate
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutCategory(int id, Category category)
        {
            //Validate
            if (id != category.Id)
                return BadRequest();

            _dbContext.Entry(category).State = EntityState.Modified;
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id, [FromQuery] bool force = false)
        {
            if (_dbContext.Categories == null)
                return NotFound();

            var category = await (_dbContext.Categories.FindAsync(id));
            if (category == null)
                return NotFound();

            if (!force)
            {
                var hasTransactions = await (_dbContext.Transactions.AnyAsync(t => t.CategoryId == id));

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
    }
}

