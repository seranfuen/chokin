using ChokinCF.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ChokinCF.Startup))]
namespace ChokinCF
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            InitializeAdmin();
            InitializeTestUsers();
        }

        private void InitializeTestUsers()
        {
            var context = new ApplicationDbContext();
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            var user = new ApplicationUser();
            user.UserName = "Sergio";
            user.Email = "sergio@chokin.com";
            var userPWD = "Sergio99";

            userManager.Create(user, userPWD);
        }

        private void InitializeAdmin()
        {
            var context = new ApplicationDbContext();

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            if (!roleManager.RoleExists("Admin"))
            {
                var role = new IdentityRole();
                role.Name = "Admin";
                roleManager.Create(role);

                var user = new ApplicationUser();
                user.UserName = "Admin";
                user.Email = "admin@chokin.com";

                var userPWD = "MyAdmin90";

                var chkUser = userManager.Create(user, userPWD);

                if (chkUser.Succeeded)
                {
                    userManager.AddToRole(user.Id, "Admin");
                }
            }
        }
    }
}
