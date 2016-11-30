using Chokin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chokin.Service
{
    public class AccountTransactionsService
    {
        private ChokinEntities _context;

        public AccountTransactionsService(ChokinEntities context)
        {
            _context = context;
        }

        public void LogTransaction(JournalEntry journalEntry)
        {
            var debitAccount = _context.Accounts.Single(account => account.Id == journalEntry.DebitAccountId);
            var creditAccount = _context.Accounts.Single(account => account.Id == journalEntry.CreditAccountId);

            debitAccount.Debit += journalEntry.Amount;
            creditAccount.Credit += journalEntry.Amount;

            _context.JournalEntries.Add(journalEntry);
            _context.SaveChanges();
        }
    }
}