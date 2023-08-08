using Portmonetka.Authentication.Models;
using Portmonetka.Authentication.Repositories;

namespace Portmonetka.Authentication.Services
{
    public interface IUserService
    {
        public Task<bool> UserExists(string username);

        public Task<IEnumerable<User>> GetUsers();

        public Task<User> GetUserById(int id);

        public Task Add(User user);

        public Task<User?> Update(User user);

        public Task Delete(User user);
    }

    public class UserService : IUserService
    {
        private readonly UserRepository _users;

        public UserService(UserRepository users)
        {
            _users = users;
        }

        public async Task<bool> UserExists(string username)
        {
            return await _users.UserNameExistsAsync(username);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _users.GetUsersAsync();
        }

        public async Task<User> GetUserById(int id)
        {
            return await _users.FindByIdAsync(id);
        }

        public async Task Add(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await _users.AddAsync(user);
        }

        public async Task<User?> Update(User user)
        {
            return await _users.UpdateAsync(user);
        }

        public async Task Delete(User user)
        {
            await _users.DeleteAsync(user);
        }
    }
}
