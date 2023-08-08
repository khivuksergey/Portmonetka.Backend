using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Services;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : AuthorizableController
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories([FromQuery] bool? sorted)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var categories = await _categoryService.GetUserCategoriesSorted(userId, sorted ?? false);

            if (!categories.Any())
                return NotFound("No categories were found for the user");

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var category = await _categoryService.GetCategory(id, userId);

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
                await _categoryService.Add(category);
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
                var updatedCategory = await _categoryService.Update(category);

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

            var category = await _categoryService.GetCategory(id, userId);

            if (category == null)
                return NotFound("Category was not found");

            if (!force)
            {
                var isEmpty = await _categoryService.IsEmpty(id, userId);

                if (!isEmpty)
                    return Ok(new { ConfirmationRequired = true });
            }

            try
            {
                await _categoryService.Delete(category);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while deleting the category");
            }
        }
    }
}

