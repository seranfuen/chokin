using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Chokin.Models;
using Chokin.ViewModels;

namespace Chokin.Controllers
{
    public class AccountsController : Controller
    {
        private ChokinEntities db = new ChokinEntities();

        public ActionResult Index()
        {
            var accounts = db.Accounts.Include(a => a.Currency);
            var listAccounts = accounts.ToList();
            return View(listAccounts.Select(account => new AccountViewModel(account)).ToList());
        }

        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Account account = db.Accounts.Find(id);
            if (account == null)
            {
                return HttpNotFound();
            }
            return View(new AccountViewModel(account));
        }

        // GET: Accounts/Create
        public ActionResult Create()
        {
            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name");
            ViewBag.AccountTypeId = new SelectList(AccountType.AccountTypes, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "AccountTypeId,CurrencyId,Name,Description,InitialQuantity")] AccountViewModel accountViewModel)
        {
            if (ModelState.IsValid)
            {
                var accountEntity = new Account();
                accountEntity.UserId = User.Identity.GetUserId();
                accountEntity.CurrencyId = accountViewModel.CurrencyId.Value;
                accountEntity.TypeId = accountViewModel.AccountTypeId.Value;
                accountEntity.Name = accountViewModel.Name;
                accountEntity.Description = accountEntity.Description;
                if (accountViewModel.InitialQuantity != decimal.Zero)
                {
                    if (accountEntity.AccountType == AccountTypeEnum.Asset || accountEntity.AccountType == AccountTypeEnum.Expenses)
                    {
                        accountEntity.Debit = accountViewModel.InitialQuantity;
                    } else
                    {
                        accountEntity.Credit = accountViewModel.InitialQuantity;
                    }
                }
                db.Accounts.Add(accountEntity);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name", accountViewModel.CurrencyId);
            ViewBag.AccountTypeId = new SelectList(AccountType.AccountTypes, "Id", "Name");
            return View(accountViewModel);
        }

        // GET: Accounts/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Account account = db.Accounts.Find(id);
            if (account == null)
            {
                return HttpNotFound();
            }
            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name", account.CurrencyId);
            return View(account);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,TypeId,CurrencyId,UserId,Name,Description,Debit,Credit")] Account account)
        {
            if (ModelState.IsValid)
            {
                db.Entry(account).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name", account.CurrencyId);
            return View(account);
        }

        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Account account = db.Accounts.Find(id);
            if (account == null)
            {
                return HttpNotFound();
            }
            var accountViewModel = new AccountViewModel(account);
            return View(accountViewModel);
        }

        // POST: Accounts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Account account = db.Accounts.Find(id);
            db.Accounts.Remove(account);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
