using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Repositories.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        public Task<IEnumerable<Category>> FindByUserIdSortedAsync(int userId, bool sorted);

        public Task<bool> HasTransactionsAsync(int id, int userId);
    }
}
