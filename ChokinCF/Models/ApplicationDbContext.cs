using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ChokinCF.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<ApplicationDbContext>());
            Configuration.ProxyCreationEnabled = false;
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public string CurrentUserId
        {
            get;
            internal set;
        }

        public override int SaveChanges()
        {
            var modifiedEntries = ChangeTracker.Entries().Where(x => x.Entity is IAuditable && 
                (x.State == System.Data.Entity.EntityState.Added || x.State == System.Data.Entity.EntityState.Modified));

            var date = DateTime.Now;
            ApplicationUser user = null;
            if (!string.IsNullOrWhiteSpace(CurrentUserId))
            {
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(this));
                user = manager.FindByName(CurrentUserId);
            }
            foreach (var entry in modifiedEntries)
            {
                var entity = entry.Entity as IAuditable;
                if (entry.State == EntityState.Added)
                {
                    entity.CreatedOn = date;
                    entity.CreatedUser = user;
                }
                entity.LastModifiedOn = date;
                entity.LastModifiedUser = user;
            }

            return base.SaveChanges();
        }

        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountType> AccountTypes { get; set; }
    }
}