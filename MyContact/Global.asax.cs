using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebMatrix.WebData;
using MyContact.App_Start;
using System.Web.Security;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using MyContact.Entities;

namespace MyContact
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            //WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            //AuthConfig.RegisterAuth();
            GlobalConfiguration.Configuration.Filters.Add(new System.Web.Http.AuthorizeAttribute());


        
           // WebApiConfig.Register(GlobalConfiguration.Configuration);
        
           // FilterConfig.RegisterWebApiFilters(GlobalConfiguration.Configuration.Filters);
            

            //Bootstrapper.Initialize();
            //CaptchaMvc.Infrastructure.CaptchaUtils.ImageGenerator.Height = 40;
            //CaptchaMvc.Infrastructure.CaptchaUtils.ImageGenerator.Width = 100;

            // Ensure ASP.NET Simple Membership is initialized only once per app start
            //LazyInitializer.EnsureInitialized(ref _initializer, ref _isInitialized, ref _initializerLock);
            
            //if (!WebSecurity.Initialized)
            //    WebSecurity.InitializeDatabaseConnection("MyContactDB", "User", "Id", "UserName", autoCreateTables: true);

        }
        protected void Session_Start(object sender, EventArgs e)
        {
            FormsAuthentication.SignOut();
            //if (Request.Cookies[FormsAuthentication.FormsCookieName] != null)
            //{
            //    HttpCookie myCookie = new HttpCookie(FormsAuthentication.FormsCookieName);
            //    myCookie.Expires = DateTime.Now.AddDays(-1d);
            //    Response.Cookies.Add(myCookie);
            //}
            
        }
        protected void Application_PostAuthorizeRequest()
        {
            HttpCookie authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];

            if (authCookie != null)
            {
                FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);

                JavaScriptSerializer serializer = new JavaScriptSerializer();

                CustomPrincipalSerializeModel serializeModel = serializer.Deserialize<CustomPrincipalSerializeModel>(authTicket.UserData);

                if (serializeModel != null)
                {
                    CustomPrincipal newUser = new CustomPrincipal(authTicket.Name);
                    newUser.UserId = serializeModel.UserId;
                    newUser.Username = serializeModel.Username;
                    newUser.DomainId = serializeModel.DomainId;
                    newUser.Id = serializeModel.Id;
                    HttpContext.Current.User = newUser;
                }
            }

            if (this.IsWebApiRequest())
            {
                // Make session read only for composite, QMM, saved query and recently executed queries
                //if (HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixComposite) ||
                //    HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixQMM) ||
                //    HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixViewSavedQueries) ||
                //    HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixGetDashboardCompositModel) ||
                //    HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixSaveQuery) ||
                //    HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixSaveReport) ||
                //    HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixDeleteSavedQueryOrReport))
                //{
                //    HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.ReadOnly);
                //}
                //else
                //{
                    HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
                //}
            }
        }

        /// <summary>
        /// Determines whether [is web API request].
        /// </summary>
        /// <returns>boolean value</returns>
        private bool IsWebApiRequest()
        {
            return true; // HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath != null && HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.Contains(BreezeWebApiConfig.UrlPrefixRelative);
        }

        //private static SimpleMembershipInitializer _initializer;
        //private static object _initializerLock = new object();
        //private static bool _isInitialized;

        //private class SimpleMembershipInitializer
        //{
        //    public SimpleMembershipInitializer()
        //    {
        //        Database.SetInitializer<MyContact.Entities.AccessorEntities>(null);

        //        try
        //        {
        //            using (var context = new MyContact.Entities.AccessorEntities())
        //            {
        //                if (!context.Database.Exists())
        //                {
        //                    // Create the SimpleMembership database without Entity Framework migration schema
        //                    ((IObjectContextAdapter)context).ObjectContext.CreateDatabase();
        //                }
        //            }

        //            WebSecurity.InitializeDatabaseConnection("MyContactDB", "User", "Id", "UserName", autoCreateTables: true);
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new InvalidOperationException("The ASP.NET Simple Membership database could not be initialized. For more information, please see http://go.microsoft.com/fwlink/?LinkId=256588", ex);
        //        }
        //    }
        //}
    }
}