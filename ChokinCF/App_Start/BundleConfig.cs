using System.Web;
using System.Web.Optimization;

namespace ChokinCF
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery-validation-unobtrusive/jquery.validate.unobtrusive.js"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr/modernizr.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
            "~/Scripts/angular/angular.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap/js/bootstrap.min.js",
                      "~/Scripts/respond/respond.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Scripts/bootstrap/css/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
