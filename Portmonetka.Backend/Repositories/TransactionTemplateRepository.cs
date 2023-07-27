using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Repositories
{
    public class TransactionTemplateRepository : IRepository<TransactionTemplate>
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

        public async Task<TransactionTemplate> FindById(int id, int userId)
        {
            return await _context.TransactionTemplates
                .Where(w =>
                    w.UserId == userId &&
                    w.Id == id &&
                    w.DateDeleted == null)
                .FirstAsync();
        }

        public async Task<IEnumerable<TransactionTemplate>> FindExistingById(int userId, IEnumerable<int> ids)
        {
            return await _context.TransactionTemplates
                    .Where(t => t.UserId == userId && ids.Contains(t.Id))
                    .ToListAsync();
        }

        public async Task<IEnumerable<TransactionTemplate>> FindByUserId(int userId)
        {
            return await _context.TransactionTemplates
                .Where(w =>
                    w.UserId == userId &&
                    w.DateDeleted == null)
                .ToListAsync();
        }

        public async Task Add(TransactionTemplate template)
        {
            _context.TransactionTemplates.Add(template);
            await _context.SaveChangesAsync();
        }

        public async Task AddRange(IEnumerable<TransactionTemplate> templates)
        {
            _context.TransactionTemplates.AddRange(templates);
            await _context.SaveChangesAsync();
        }

        public async Task<TransactionTemplate?> Update(TransactionTemplate template)
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

        public async Task Delete(TransactionTemplate template)
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

        public async Task DeleteRange(IEnumerable<TransactionTemplate> templates)
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
