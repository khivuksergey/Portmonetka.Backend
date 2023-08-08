namespace Portmonetka.Backend.Repositories.Interfaces
{
    public interface IRepository<T> where T : class
    {
        public bool Exist();

        public Task<T> FindByIdAsync(int id, int userId);

        public Task<IEnumerable<T>> FindByUserIdAsync(int userId);

        public Task AddAsync(T entity);

        public Task<T?> UpdateAsync(T entity);

        public Task DeleteAsync(T entity);
    }
}
