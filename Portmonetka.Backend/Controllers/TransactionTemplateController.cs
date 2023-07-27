using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionTemplateController : AuthorizableController
    {
        private readonly TransactionTemplateRepository _templates;

        public TransactionTemplateController(TransactionTemplateRepository templates)
        {
            _templates = templates;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionTemplate>>> GetTransactionTemplates()
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var existingTemplates = await _templates.FindByUserId(userId);

            if (existingTemplates == null)
                return NotFound("No templates were found for the user");

            return Ok(existingTemplates);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<TransactionTemplate>>> PostTransactionTemplates(IEnumerable<TransactionTemplate> templates)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            try
            {
                await _templates.AddRange(templates);
                return CreatedAtAction(nameof(GetTransactionTemplates), templates.Select(t => new { id = t.Id }), templates);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while adding transaction templates");
            }
        }

        [HttpPost("update")]
        public async Task<ActionResult<IEnumerable<TransactionTemplate>>> UpdateTransactionTemplates(IEnumerable<TransactionTemplate> templates)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            bool templatesExist = (await _templates.FindByUserId(userId)).Any();

            if (!templatesExist)
                return NotFound();

            try
            {
                var updatedTemplates = new List<TransactionTemplate>();
                var notFoundTemplates = new List<int>();

                foreach (var template in templates)
                {
                    var updatedTemplate = await _templates.Update(template);
                    if (updatedTemplate != null)
                    {
                        updatedTemplates.Add(updatedTemplate);
                    }
                    else
                    {
                        notFoundTemplates.Add(template.Id);
                    }
                }

                if (updatedTemplates.Count > 0)
                {
                    return Ok(new { UpdatedTemplates = updatedTemplates, NotFoundTemplateIds = notFoundTemplates });
                }
                else
                {
                    return NotFound("No transaction templates were found for update.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while updating transaction templates");
            }
            
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteTransactionTemplates(IEnumerable<int> ids)
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            bool templatesExist = (await _templates.FindByUserId(userId)).Any();

            if (!templatesExist)
                return NotFound("No transaction templates exist for the user.");

            var templatesToDelete = await _templates.FindExistingById(userId, ids);

            if (templatesToDelete == null)
                return BadRequest("No transaction templates were found for the provided ids.");

            try
            {
                await _templates.DeleteRange(templatesToDelete);
                return NoContent();
            }
            catch
            {
                return StatusCode(500, "An error occured while deleting transaction templates");
            }
        }
    }
}
