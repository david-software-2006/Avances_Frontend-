using ExtraHours.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.Infrastructure.Data {
    public class AppDbContext: DbContext {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) {}

        public DbSet<User> Users {get; set;}
        public DbSet<Role> Roles {get; set;}
        public DbSet<Permission> Permissions {get; set;}

    }
}   