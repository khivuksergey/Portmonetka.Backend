namespace Portmonetka.AuthenticationService.Repositories
{
    public interface IRepository<T> where T : class
    {
        public bool Exist();

        public Task<T> FindById(int id);

        public Task Add(T entity);

        public Task<T?> Update(T entity);

        public Task Delete(T entity);
    }
}