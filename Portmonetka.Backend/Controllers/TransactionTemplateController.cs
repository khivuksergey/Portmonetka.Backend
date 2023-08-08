using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Services;

namespace Portmonetka.Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionTemplateController : AuthorizableController
    {
        private readonly ITransactionTemplateService _templateService;

        public TransactionTemplateController(ITransactionTemplateService templateService)
        {
            _templateService = templateService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionTemplate>>> GetTransactionTemplates()
        {
            if (!CheckIdentity(out int userId))
                return Forbid();

            var existingTemplates = await _templateService.GetUserTransactionTemplates(userId);

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
                var (addedTransactionTemplates, duplicateTransactionTemplates) = await _templateService.Add(userId, templates);

                if (!duplicateTransactionTemplates.Any())
                    return CreatedAtAction(nameof(GetTransactionTemplates), templates.Select(t => new { id = t.Id }), templates);

                if (addedTransactionTemplates.Any())
                {
                    return Ok(new { AddedTemplates = addedTransactionTemplates, DuplicateTemplatesNotAdded = duplicateTransactionTemplates });
                }
                else
                {
                    return BadRequest("Template descriptions must be unique");
                }
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

            bool templatesExist = (await _templateService.GetUserTransactionTemplates(userId)).Any();

            if (!templatesExist)
                return NotFound("No templates were found for the user");

            try
            {
                var (updatedTransactionTemplates, notFoundTransactionTemplates) = await _templateService.Update(userId, templates);

                if (updatedTransactionTemplates.Any())
                {
                    return Ok(new { UpdatedTransactionTemplates = updatedTransactionTemplates, NotFoundTransactionTemplates = notFoundTransactionTemplates });
                }
                else
                {
                    return NotFound("No templates were found for update");
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

            var templatesToDelete = await _templateService.GetExistingTransactionTemplatesById(userId, ids);

            if (templatesToDelete == null)
                return BadRequest("No templates were found for the provided ids");

            try
            {
                await _templateService.Delete(templatesToDelete);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occured while deleting transaction templates");
            }
        }
    }
}
