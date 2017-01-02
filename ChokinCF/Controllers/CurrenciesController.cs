using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ChokinCF.Models;
using ChokinCF.Repository;

namespace ChokinCF.Controllers
{
    public class CurrenciesController : ControllerBase
    {
        private CurrencyRepository _repository = RepositoryFactory.CreateCurrencyRepository();

        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);
            InitializeRepository(_repository);
        }

        [Authorize]
        public ActionResult Index()
        {
            return View(_repository.Entities);
        }

        [Authorize]        
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Currency currency = _repository.FindById(id.Value);
            if (currency == null)
            {
                return HttpNotFound();
            }
            return View(currency);
        }

        [Authorize(Roles = "Admin")]
        public ActionResult Create()
        {
            return View();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Symbol,Country")] Currency currency)
        {
            if (ModelState.IsValid)
            {
                if (_repository.HasCurrency(currency.Name))
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest); // testing purpose, show custom error page later
                }
                else
                {
                    _repository.AddEntity(currency);
                    _repository.SaveChanges();
                    return RedirectToAction("Index");
                }
            }

            return View(currency);
        }

        [Authorize(Roles = "Admin")]
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Currency currency = _repository.FindById(id.Value);
            if (currency == null)
            {
                return HttpNotFound();
            } 
            return View(currency);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Symbol,Country")] Currency currency)
        {
            if (ModelState.IsValid)
            {
                currency = _repository.FindById(currency.Id);
                UpdateModel<Currency>(currency);
                _repository.Edit(currency);
                if (_repository.HasCurrencyWithName(currency))
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest); // testing purpose, show custom error page later
                }
                _repository.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(currency);
        }

        [Authorize(Roles = "Admin")]
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Currency currency = _repository.FindById(id.Value);
            if (currency == null)
            {
                return HttpNotFound();
            }
            return View(currency);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Currency currency = _repository.FindById(id);
            _repository.DeleteEntity(currency);
            _repository.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repository.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
