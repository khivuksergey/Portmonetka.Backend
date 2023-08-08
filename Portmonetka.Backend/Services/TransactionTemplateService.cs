using Portmonetka.Backend.Models;
using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Services
{
    public interface ITransactionTemplateService
    {
        public Task<IEnumerable<TransactionTemplate>> GetUserTransactionTemplates(int userId);

        public Task<TransactionTemplate> GetTransactionTemplate(int id, int userId);

        public Task<IEnumerable<TransactionTemplate>> GetExistingTransactionTemplatesById(int userId, IEnumerable<int> ids);

        public Task Add(TransactionTemplate transactionTemplate);

        public Task<(IEnumerable<TransactionTemplate> AddedTransactionTemplates, IEnumerable<TransactionTemplate> DuplicateTransactionTemplates)> Add(int userId, IEnumerable<TransactionTemplate> transactionTemplates);

        public Task<TransactionTemplate?> Update(TransactionTemplate transactionTemplate);

        public Task<(IEnumerable<TransactionTemplate> UpdatedTransactionTemplates, IEnumerable<TransactionTemplate> NotFoundTransactionTemplates)> Update(int userId, IEnumerable<TransactionTemplate> transactionTemplates);

        public Task Delete(TransactionTemplate transactionTemplate);

        public Task Delete(IEnumerable<TransactionTemplate> transactionTemplate);

        public IEnumerable<TransactionTemplate> FindDuplicates(int userId, IEnumerable<TransactionTemplate> transactionTemplates);
    }

    public class TransactionTemplateService : ITransactionTemplateService
    {
        private readonly ITransactionTemplateRepository _transactionTemplates;

        public TransactionTemplateService(ITransactionTemplateRepository transactionTemplates)
        {
            _transactionTemplates = transactionTemplates;
        }

        public async Task<IEnumerable<TransactionTemplate>> GetUserTransactionTemplates(int userId)
        {
            return await _transactionTemplates.FindByUserIdAsync(userId);
        }

        public async Task<TransactionTemplate> GetTransactionTemplate(int id, int userId)
        {
            return await _transactionTemplates.FindByIdAsync(id, userId);
        }

        public async Task<IEnumerable<TransactionTemplate>> GetExistingTransactionTemplatesById(int userId, IEnumerable<int> ids)
        {
            return await _transactionTemplates.FindExistingByIdAsync(userId, ids);
        }

        public async Task Add(TransactionTemplate transactionTemplate)
        {
            await _transactionTemplates.AddAsync(transactionTemplate);
        }

        public async Task<(IEnumerable<TransactionTemplate> AddedTransactionTemplates, IEnumerable<TransactionTemplate> DuplicateTransactionTemplates)> Add(int userId, IEnumerable<TransactionTemplate> transactionTemplates)
        {
            await _transactionTemplates.AddAsync(transactionTemplates);

            var duplicateTransactionTemplates = _transactionTemplates.CheckDuplicateDescriptions(transactionTemplates, userId);

            var templatesToAdd = transactionTemplates.Except(duplicateTransactionTemplates);

            if (templatesToAdd.Any())
                await _transactionTemplates.AddAsync(templatesToAdd);

            return (templatesToAdd, duplicateTransactionTemplates);
        }

        public async Task<TransactionTemplate?> Update(TransactionTemplate transactionTemplate)
        {
            return await _transactionTemplates.UpdateAsync(transactionTemplate);
        }

        public async Task<(IEnumerable<TransactionTemplate> UpdatedTransactionTemplates, IEnumerable<TransactionTemplate> NotFoundTransactionTemplates)> Update(int userId, IEnumerable<TransactionTemplate> transactionTemplates)
        {
            var updatedTemplates = new List<TransactionTemplate>();
            var notFoundTemplates = new List<TransactionTemplate>();

            foreach (var template in transactionTemplates)
            {
                var updatedTemplate = await _transactionTemplates.UpdateAsync(template);
                if (updatedTemplate != null)
                {
                    updatedTemplates.Add(updatedTemplate);
                }
                else
                {
                    notFoundTemplates.Add(template);
                }
            }

            return (updatedTemplates, notFoundTemplates);
        }

        public async Task Delete(TransactionTemplate transactionTemplate)
        {
            await _transactionTemplates.DeleteAsync(transactionTemplate);
        }

        public async Task Delete(IEnumerable<TransactionTemplate> transactionTemplates)
        {
            await _transactionTemplates.DeleteAsync(transactionTemplates);
        }

        public IEnumerable<TransactionTemplate> FindDuplicates(int userId, IEnumerable<TransactionTemplate> transactionTemplates)
        {
            return _transactionTemplates.CheckDuplicateDescriptions(transactionTemplates, userId);
        }
    }
}
