using Portmonetka.Backend.Repositories.Interfaces;

namespace Portmonetka.Backend.Repositories
{
    public static class ServiceCollectionExtensions
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IWalletRepository, WalletRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();
            services.AddScoped<ITransactionTemplateRepository, TransactionTemplateRepository>();
        }
    }
}
