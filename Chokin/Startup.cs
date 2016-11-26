using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Chokin.Startup))]
namespace Chokin
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
