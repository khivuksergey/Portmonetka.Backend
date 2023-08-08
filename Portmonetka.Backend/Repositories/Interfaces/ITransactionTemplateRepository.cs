using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Repositories.Interfaces
{
    public interface ITransactionTemplateRepository : IRepository<TransactionTemplate>
    {
        public IEnumerable<TransactionTemplate> CheckDuplicateDescriptions(IEnumerable<TransactionTemplate> templatesToCheck, int userId);

        public Task<IEnumerable<TransactionTemplate>> FindExistingByIdAsync(int userId, IEnumerable<int> ids);

        public Task AddAsync(IEnumerable<TransactionTemplate> templates);

        public Task DeleteAsync(IEnumerable<TransactionTemplate> templates);
    }
}
