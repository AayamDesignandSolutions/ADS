using System.Web.Mvc;

namespace MyContact.Controllers
{
    [Authorize]
    public class HotTowelController : Controller
    { 
        //
        // GET: /HotTowel/

        public ActionResult Index()
        {
            return View();
        }

    }
}
