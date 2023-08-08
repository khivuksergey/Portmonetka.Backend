using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Services
{
    public interface ICategoryService
    {
        public Task<IEnumerable<Category>> GetUserCategories(int userId);

        public Task<IEnumerable<Category>> GetUserCategoriesSorted(int userId, bool sorted);

        public Task<Category> GetCategory(int id, int userId);

        public Task Add(Category category);

        public Task<Category?> Update(Category category);

        public Task Delete(Category category);

        public Task<bool> IsEmpty(int id, int userid);
    }

    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categories;

        public CategoryService(ICategoryRepository categories)
        {
            _categories = categories;
        }

        public async Task<IEnumerable<Category>> GetUserCategories(int userId)
        {
            return await _categories.FindByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Category>> GetUserCategoriesSorted(int userId, bool sorted)
        {
            return await _categories.FindByUserIdSortedAsync(userId, sorted);
        }

        public async Task<Category> GetCategory(int id, int userId)
        {
            return await _categories.FindByIdAsync(id, userId);
        }

        public async Task Add(Category category)
        {
            await _categories.AddAsync(category);
        }

        public async Task<Category?> Update(Category category)
        {
            return await _categories.UpdateAsync(category);
        }

        public async Task Delete(Category category)
        {
            await _categories.DeleteAsync(category);
        }

        public async Task<bool> IsEmpty(int id, int userId)
        {
            bool hasTransactions = await _categories.HasTransactionsAsync(id, userId);
            return !hasTransactions;
        }
    }
}
