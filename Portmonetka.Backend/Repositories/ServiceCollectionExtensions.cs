using Portmonetka.Backend.Models;

namespace Portmonetka.Backend.Repositories
{
    public static class ServiceCollectionExtensions
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<WalletRepository>();
            services.AddScoped<CategoryRepository>();
            services.AddScoped<TransactionRepository>();
            services.AddScoped<TransactionTemplateRepository>();
        }
    }
}
