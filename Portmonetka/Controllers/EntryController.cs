using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Portmonetka.Models;

namespace Portmonetka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntryController : ControllerBase
    {
        private readonly InMemoryDbContext _dbContext;

        public EntryController(InMemoryDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpGet]
        [Route("GetEntryList")]
        public async Task<ActionResult<IEnumerable<Entry>>> GetEntryList()
        {
            if (_dbContext.Entries == null)
                return NotFound();

            return await _dbContext.Entries.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Entry>> GetEntry(int id)
        {
            if (_dbContext.Entries == null)
                return NotFound();

            var entry = await _dbContext.Entries.FindAsync(id);
            if (entry == null)
                return NotFound();

            return entry;
        }

        [HttpPost]
        public async Task<ActionResult<Entry>> PostEntry([FromBody] JObject formData)
        {
            var entry = new Entry
            {
                Data = formData.ToString(Newtonsoft.Json.Formatting.None)
            };

            _dbContext.Entries.Add(entry);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, entry);
        }
    }
}
