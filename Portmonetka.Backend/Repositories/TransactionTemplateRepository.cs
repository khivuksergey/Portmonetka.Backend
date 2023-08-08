using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Repositories
{
    public class TransactionTemplateRepository : ITransactionTemplateRepository
    {
        private readonly PortmonetkaDbContext _context;

        public TransactionTemplateRepository(PortmonetkaDbContext context)
        {
            _context = context;
        }

        public bool Exist()
        {
            return _context.TransactionTemplates.Any();
        }

        public IEnumerable<TransactionTemplate> CheckDuplicateDescriptions(IEnumerable<TransactionTemplate> templatesToCheck, int userId)
        {
            var userTemplates = _context.TransactionTemplates.Where(w => w.UserId == userId);
            var duplicates = new List<TransactionTemplate>();

            foreach (var template in templatesToCheck)
            {
                if (userTemplates.Any(t => t.Description == template.Description))
                {
                    duplicates.Add(template);
                }
            }

            return duplicates;
        }

        public async Task<TransactionTemplate> FindByIdAsync(int id, int userId)
        {
            return await _context.TransactionTemplates
                .Where(w =>
                    w.UserId == userId &&
                    w.Id == id &&
                    w.DateDeleted == null)
                .FirstAsync();
        }

        public async Task<IEnumerable<TransactionTemplate>> FindExistingByIdAsync(int userId, IEnumerable<int> ids)
        {
            return await _context.TransactionTemplates
                    .Where(t => t.UserId == userId && ids.Contains(t.Id))
                    .ToListAsync();
        }

        public async Task<IEnumerable<TransactionTemplate>> FindByUserIdAsync(int userId)
        {
            return await _context.TransactionTemplates
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null)
                .ToListAsync();
        }

        public async Task AddAsync(TransactionTemplate template)
        {
            _context.TransactionTemplates.Add(template);
            await _context.SaveChangesAsync();
        }

        public async Task AddAsync(IEnumerable<TransactionTemplate> templates)
        {
            _context.TransactionTemplates.AddRange(templates);
            await _context.SaveChangesAsync();
        }

        public async Task<TransactionTemplate?> UpdateAsync(TransactionTemplate template)
        {
            var existingTemplate = await _context.TransactionTemplates.FindAsync(template.Id);

            if (existingTemplate != null)
            {
                _context.Entry(existingTemplate).CurrentValues.SetValues(template);
                await _context.SaveChangesAsync();
                return existingTemplate;
            }

            return null;
        }

        public async Task DeleteAsync(TransactionTemplate template)
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

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(IEnumerable<TransactionTemplate> templates)
        {

            if (typeof(Auditable).IsAssignableFrom(typeof(TransactionTemplate)))
            {
                foreach (var template in templates)
                {
                    template.DateDeleted = DateTimeOffset.UtcNow;
                    _context.TransactionTemplates.Attach(template);
                    _context.Entry(template).State = EntityState.Modified;
                }
            }
            else
            {
                _context.TransactionTemplates.RemoveRange(templates);
            }

            await _context.SaveChangesAsync();
        }
    }
}
