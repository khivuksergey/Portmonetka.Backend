using Microsoft.EntityFrameworkCore;

namespace Portmonetka.Models
{
    public class InMemoryDbContext : DbContext
    {
        protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseInMemoryDatabase(databaseName: "EntryDb");
        }

        public DbSet<Entry> Entries { get; set; }
    }
}
