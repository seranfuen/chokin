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
using Chokin.Service;

namespace Chokin.Controllers
{
    public class JournalEntriesController : Controller
    {
        private ChokinEntities db = new ChokinEntities();

        // GET: JournalEntries
        public ActionResult Index()
        {
            var journalEntries = db.JournalEntries.Include(j => j.CreditAccount).Include(j => j.DebitAccount).Include(j => j.AspNetUser).Include(j => j.Currency);
            return View(journalEntries.ToList());
        }

        // GET: JournalEntries/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            JournalEntry journalEntry = db.JournalEntries.Find(id);
            if (journalEntry == null)
            {
                return HttpNotFound();
            }
            return View(journalEntry);
        }

        // GET: JournalEntries/Create
        public ActionResult Create()
        {
            ViewBag.CreditAccountId = new SelectList(db.Accounts, "Id", "Name");
            ViewBag.DebitAccountId = new SelectList(db.Accounts, "Id", "Name");
            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name");
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Amount,Date,Concept,DebitAccountId,CreditAccountId,CurrencyId")] JournalEntry journalEntry)
        {
            if (ModelState.IsValid)
            {
                journalEntry.UserId = User.Identity.GetUserId();
                var ofService = new AccountTransactionsService(db);
                ofService.LogTransaction(journalEntry);

                return RedirectToAction("Index");
            }

            ViewBag.CreditAccountId = new SelectList(db.Accounts, "Id", "Name");
            ViewBag.DebitAccountId = new SelectList(db.Accounts, "Id", "Name");
            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name");
            return View(journalEntry);
        }

        // GET: JournalEntries/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            JournalEntry journalEntry = db.JournalEntries.Find(id);
            if (journalEntry == null)
            {
                return HttpNotFound();
            }
            ViewBag.CreditAccountId = new SelectList(db.Accounts, "Id", "Name", journalEntry.CreditAccountId);
            ViewBag.DebitAccountId = new SelectList(db.Accounts, "Id", "Name", journalEntry.DebitAccountId);
            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name", journalEntry.CurrencyId);
            return View(journalEntry);
        }

        // POST: JournalEntries/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Amount,Date,Concept,DebitAccountId,CreditAccountId,CurrencyId,UserId,IsRecurring,IsCancelling")] JournalEntry journalEntry)
        {
            if (ModelState.IsValid)
            {
                db.Entry(journalEntry).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreditAccountId = new SelectList(db.Accounts, "Id", "Name", journalEntry.CreditAccountId);
            ViewBag.DebitAccountId = new SelectList(db.Accounts, "Id", "Name", journalEntry.DebitAccountId);
            ViewBag.CurrencyId = new SelectList(db.Currencies, "Id", "Name", journalEntry.CurrencyId);
            return View(journalEntry);
        }

        // GET: JournalEntries/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            JournalEntry journalEntry = db.JournalEntries.Find(id);
            if (journalEntry == null)
            {
                return HttpNotFound();
            }
            return View(journalEntry);
        }

        // POST: JournalEntries/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            JournalEntry journalEntry = db.JournalEntries.Find(id);
            db.JournalEntries.Remove(journalEntry);
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
