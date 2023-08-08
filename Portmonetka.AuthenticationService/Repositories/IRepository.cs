namespace Portmonetka.Authentication.Repositories
{
    public interface IRepository<T> where T : class
    {
        public bool Exist();

        public Task<T> FindByIdAsync(int id);

        public Task AddAsync(T entity);

        public Task<T?> UpdateAsync(T entity);

        public Task DeleteAsync(T entity);
    }
}