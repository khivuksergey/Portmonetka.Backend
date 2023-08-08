using Microsoft.EntityFrameworkCore;
using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly PortmonetkaDbContext _context;

        public CategoryRepository(PortmonetkaDbContext context)
        {
            _context = context;
        }

        public bool Exist()
        {
            return _context.Categories.Any();
        }

        public async Task<Category> FindByIdAsync(int id, int userId)
        {
            return await _context.Categories
                .Where(w =>
                    w.UserId == userId &&
                    w.Id == id &&
                    w.DateDeleted == null)
                .FirstAsync();
        }

        public async Task<IEnumerable<Category>> FindByUserIdAsync(int userId)
        {
            return await _context.Categories
                .Where(w => w.UserId == userId && w.DateDeleted == null)
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> FindByUserIdSortedAsync(int userId, bool sorted = false)
        {
            var query = _context.Categories
                .Where(w => w.UserId == userId && w.DateDeleted == null);

            if (sorted)
            {
                //possible ways to optimize in future: use indexed view
                query = query.Include(c => c.Transactions)
                .OrderByDescending(c => c.Transactions.Count);
            }

            return await query.ToListAsync();
        }

        public async Task AddAsync(Category category)
        {
            _context.Add(category);
            await _context.SaveChangesAsync();
        }

        public async Task<Category?> UpdateAsync(Category category)
        {
            var existingCategory = await _context.Categories.FindAsync(category.Id);

            if (existingCategory != null)
            {
                _context.Entry(existingCategory).CurrentValues.SetValues(category);
                await _context.SaveChangesAsync();
                return existingCategory;
            }

            return null;
        }

        public async Task DeleteAsync(Category category)
        {
            if (typeof(Auditable).IsAssignableFrom(typeof(Category)))
            {
                category.DateDeleted = DateTimeOffset.UtcNow;
                _context.Categories.Attach(category);
                _context.Entry(category).State = EntityState.Modified;
            }
            else
            {
                _context.Categories.Remove(category);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasTransactionsAsync(int id, int userId)
        {
            return await _context.Transactions
                    .AnyAsync(t => t.UserId == userId && t.CategoryId == id);
        }
    }
}
