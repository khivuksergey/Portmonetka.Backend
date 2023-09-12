using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Portmonetka.Backend.Models;

public partial class PortmonetkaDbContext : DbContext
{
    private readonly IMapper _mapper;

    public PortmonetkaDbContext(IMapper mapper)
    {
        _mapper = mapper;
    }

    public PortmonetkaDbContext(DbContextOptions<PortmonetkaDbContext> options, IMapper mapper)
        : base(options)
    {
        _mapper = mapper;
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<Wallet> Wallets { get; set; }

    public virtual DbSet<TransactionTemplate> TransactionTemplates { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

        optionsBuilder.UseNpgsql(configuration.GetConnectionString("PortmonetkaDb"));
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var insertedEntries = ChangeTracker.Entries()
                               .Where(x => x.State == EntityState.Added)
                               .Select(x => x.Entity);

        foreach (var insertedEntry in insertedEntries)
        {
            var auditableEntity = insertedEntry as Auditable;
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
            var auditableEntity = modifiedEntry as Auditable;
            if (auditableEntity != null)
            {
                auditableEntity.DateUpdated = DateTimeOffset.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    private ValueConverter<DateTimeOffset, DateTime> GetDateTimeOffsetConverter(IMapper mapper)
    {
        return new ValueConverter<DateTimeOffset, DateTime>(
            v => mapper.Map<DateTimeOffset, DateTime>(v),
            v => mapper.Map<DateTime, DateTimeOffset>(v));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("dbo");
        
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07F1BAEAE7");

            entity.Property(e => e.DateCreated);
            entity.Property(e => e.DateDeleted);
            entity.Property(e => e.DateUpdated);
            entity.Property(e => e.IconFileName).HasMaxLength(256);
            entity.Property(e => e.Name).HasMaxLength(128);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC07F242DC8C");

            entity.Property(e => e.Amount).HasColumnType("money");
            entity.Property(e => e.Date);
            entity.Property(e => e.DateCreated);
            entity.Property(e => e.DateDeleted);
            entity.Property(e => e.DateUpdated);
            entity.Property(e => e.Description).HasMaxLength(256);

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
            entity.Property(e => e.DateCreated);
            entity.Property(e => e.DateDeleted);
            entity.Property(e => e.DateUpdated);
            entity.Property(e => e.IconFileName).HasMaxLength(255);
            entity.Property(e => e.InitialAmount).HasColumnType("money");
            entity.Property(e => e.Name).HasMaxLength(128);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
