using Microsoft.EntityFrameworkCore;
using Portmonetka.AuthenticationService.Models;
using Portmonetka.AuthenticationService.Repositories;

namespace Portmonetka.AuthenticationService.Repositories
{
    public class UserRepository : IRepository<User>
    {
        private readonly UserDbContext _context;

        public UserRepository(UserDbContext context)
        {
            _context = context;
        }

        public bool Exist()
        {
            return _context.Users.Any();
        }

        public bool UserNameExists(string username)
        {
            return _context.Users.Any(u => u.Name == username);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users
                .Where(w => w.DateDeleted == null)
                .ToListAsync();
        }

        public async Task<User> FindById(int id)
        {
            return await _context.Users
                .Where(w =>
                    w.Id == id &&
                    w.DateDeleted == null)
                .FirstAsync();
        }

        public async Task Add(User user)
        {
            _context.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> Update(User user)
        {
            var existingUser = await _context.Users.FindAsync(user.Id);

            if (existingUser != null)
            {
                _context.Entry(existingUser).CurrentValues.SetValues(user);
                await _context.SaveChangesAsync();
                return existingUser;
            }

            return null;
        }

        public async Task Delete(User user)
        {
            if (typeof(Auditable).IsAssignableFrom(typeof(User)))
            {
                user.DateDeleted = DateTimeOffset.UtcNow;
                _context.Users.Attach(user);
                _context.Entry(user).State = EntityState.Modified;
            }
            else
            {
                _context.Users.Remove(user);
            }

            await _context.SaveChangesAsync();
        }
    }
}