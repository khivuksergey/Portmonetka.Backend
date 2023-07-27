using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : AuthorizableController
    {
        private readonly CategoryRepository _categories;
        public CategoryController(CategoryRepository categories)
        {
            _categories = categories;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories([FromQuery] bool? sorted)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (!_categories.Exist())
                return NotFound();

            //TO-DO: Find a way to optimize order by transactions count
            var categories = await _categories.FindByUserIdSorted(userId, sorted ?? false);

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var category = await _categories.FindById(id, userId);

            if (category == null)
                return NotFound($"Category with id = {id} was not found");

            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (category.Id != 0)
                return BadRequest("New category's id should be 0");

            try
            {
                await _categories.Add(category);
                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while adding the category");
            }
        }

        [HttpPost("update")]
        public async Task<ActionResult<Category>> UpdateCategory(Category category)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedCategory = await _categories.Update(category);

                if (updatedCategory == null)
                    return NotFound("Category was not found");

                return Ok(updatedCategory);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while updating the category");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id, [FromQuery] bool force = false)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var category = await _categories.FindById(id, userId);

            if (category == null)
                return NotFound("Category was not found");

            if (!force)
            {
                var hasTransactions = await _categories.HasTransactions(id, userId);

                if (hasTransactions)
                    return Ok(new { ConfirmationRequired = true });
            }

            try
            {
                await _categories.Delete(category);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while deleting the category");
            }
        }
    }
}

