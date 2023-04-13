using Microsoft.EntityFrameworkCore;

namespace Portmonetka.Models;

public partial class PortmonetkaDbContext : DbContext
{
    public PortmonetkaDbContext()
    {
    }

    public PortmonetkaDbContext(DbContextOptions<PortmonetkaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<Wallet> Wallets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

        optionsBuilder.UseSqlServer(configuration.GetConnectionString("PortmonetkaDbCS"));
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var insertedEntries = ChangeTracker.Entries()
                               .Where(x => x.State == EntityState.Added)
                               .Select(x => x.Entity);

        foreach (var insertedEntry in insertedEntries)
        {
            var auditableEntity = insertedEntry as Auditable;
            //If the inserted object is an Auditable. 
            if (auditableEntity != null)
            {
                auditableEntity.DateCreated = DateTimeOffset.UtcNow;
            }
        }

        var modifiedEntries = ChangeTracker.Entries()
                   .Where(x => x.State == EntityState.Modified)
                   .Select(x => x.Entity);

        foreach (var modifiedEntry in modifiedEntries)
        {
            //If the inserted object is an Auditable. 
            var auditableEntity = modifiedEntry as Auditable;
            if (auditableEntity != null)
            {
                auditableEntity.DateUpdated = DateTimeOffset.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07F1BAEAE7");

            entity.Property(e => e.IconFileName).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(128);
            entity.Property(e => e.DateCreated).HasColumnType("date");
            entity.Property(e => e.DateUpdated).HasColumnType("date");
            entity.Property(e => e.DateDeleted).HasColumnType("date");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC07F242DC8C");

            entity.Property(e => e.Amount).HasColumnType("money");
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.Description).HasMaxLength(256);
            entity.Property(e => e.DateCreated).HasColumnType("date");
            entity.Property(e => e.DateUpdated).HasColumnType("date");
            entity.Property(e => e.DateDeleted).HasColumnType("date");

            entity.HasOne(d => d.Category).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Transacti__Categ__4D94879B");

            entity.HasOne(d => d.Wallet).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.WalletId)
                .HasConstraintName("FK__Transacti__Walle__4E88ABD4");
        });

        modelBuilder.Entity<Wallet>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Wallets__3214EC0702761D8A");

            entity.Property(e => e.Currency).HasMaxLength(3);
            entity.Property(e => e.IconFileName).HasMaxLength(255);
            entity.Property(e => e.InitialAmount).HasColumnType("money");
            entity.Property(e => e.Name).HasMaxLength(128);
            entity.Property(e => e.DateCreated).HasColumnType("date");
            entity.Property(e => e.DateUpdated).HasColumnType("date");
            entity.Property(e => e.DateDeleted).HasColumnType("date");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
