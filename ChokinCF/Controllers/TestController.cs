using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChokinCF.Controllers
{
    public class TestController : Controller
    {
        [AllowAnonymous]
        public ActionResult Angular()
        {
            return View();
        }
    }
}