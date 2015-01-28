using System;
using System.Web.Optimization;

namespace MyContact
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = false;
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
              new ScriptBundle("~/scripts/vendor")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/knockout-{version}.debug.js")
                .Include("~/scripts/toastr.js")
                .Include("~/scripts/Q.js")
                .Include("~/scripts/breeze.debug.js")
                .Include("~/Scripts/sammy-{version}.js")
                .Include("~/scripts/bootstrap.js")
                .Include("~/scripts/moment.js")
                .Include("~/scripts/moment-datepicker-ko.js")
                .Include("~/scripts/moment-datepicker.js")

              );

            bundles.Add(
              new StyleBundle("~/Content/css")
                .Include("~/Content/ie10mobile.css")
                .Include("~/Content/bootstrap.min.css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/bootstrap-responsive.css")
                .Include("~/Content/bootstrap-responsive.min.css")
                .Include("~/Content/font-awesome.min.css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/toastr.css")
                .Include("~/Content/app.css")
                .Include("~/Content/style.css")
                .Include("~/Content/moment-datepicker/datepicker.css")

              );

           

                bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                    "~/Content/themes/base/jquery.ui.core.css",
                    "~/Content/themes/base/jquery.ui.resizable.css",
                    "~/Content/themes/base/jquery.ui.selectable.css",
                    "~/Content/themes/base/jquery.ui.accordion.css",
                    "~/Content/themes/base/jquery.ui.autocomplete.css",
                    "~/Content/themes/base/jquery.ui.button.css",
                    "~/Content/themes/base/jquery.ui.dialog.css",
                    "~/Content/themes/base/jquery.ui.slider.css",
                    "~/Content/themes/base/jquery.ui.tabs.css",
                    "~/Content/themes/base/jquery.ui.datepicker.css",
                    "~/Content/themes/base/jquery.ui.progressbar.css",
                    "~/Content/themes/base/jquery.ui.theme.css"));
          


            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                   "~/Scripts/jquery.unobtrusive*",
                   "~/Scripts/jquery.validate*"));

             bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                       "~/Scripts/jquery-ui-{version}.js"));

             bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
             "~/Scripts/modernizr-*"));

        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");

            //ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }


        //public static void RegisterBundles(BundleCollection bundles)
        //{

        //    BundleTable.EnableOptimizations = false;

        //    bundles.IgnoreList.Clear();
        //    AddDefaultIgnorePatterns(bundles.IgnoreList);

        //    bundles.Add(new ScriptBundle("~/bundles/vendors")
        //        .Include("~/Scripts/jquery-{version}.js")
        //        .Include("~/Scripts/knockout-{version}.js")
        //        .Include("~/Scripts/sammy-{version}.js")
        //        .Include("~/Scripts/bootstrap.min.js")
        //      );

        //    bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
        //                "~/Scripts/jquery-ui-{version}.js"));

        //    bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
        //                "~/Scripts/jquery.unobtrusive*",
        //                "~/Scripts/jquery.validate*"));

        //    // Use the development version of Modernizr to develop with and learn from. Then, when you're
        //    // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.


        //    bundles.Add(new StyleBundle("~/Content/css")
        //        .Include("~/Content/ie10mobile.css")
        //        .Include("~/Content/bootstrap.min.css")
        //        .Include("~/Content/bootstrap-responsive.min.css")
        //        .Include("~/Content/font-awesome.min.css")
        //        .Include("~/Content/durandal.css")
        //        .Include("~/Content/app.css")
        //      );

        //    bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
        //        "~/Content/themes/base/jquery.ui.core.css",
        //        "~/Content/themes/base/jquery.ui.resizable.css",
        //        "~/Content/themes/base/jquery.ui.selectable.css",
        //        "~/Content/themes/base/jquery.ui.accordion.css",
        //        "~/Content/themes/base/jquery.ui.autocomplete.css",
        //        "~/Content/themes/base/jquery.ui.button.css",
        //        "~/Content/themes/base/jquery.ui.dialog.css",
        //        "~/Content/themes/base/jquery.ui.slider.css",
        //        "~/Content/themes/base/jquery.ui.tabs.css",
        //        "~/Content/themes/base/jquery.ui.datepicker.css",
        //        "~/Content/themes/base/jquery.ui.progressbar.css",
        //        "~/Content/themes/base/jquery.ui.theme.css"));
        //}

        //public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        //{
        //    if (ignoreList == null)
        //    {
        //        throw new ArgumentNullException("ignoreList");
        //    }

        //    ignoreList.Ignore("*.intellisense.js");
        //    ignoreList.Ignore("*-vsdoc.js");
        //    ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
        //    //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
        //    //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        //}
    }
}