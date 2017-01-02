using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChokinCF.Models;

namespace ChokinCF.Repository
{
    public partial class AccountRepository
    {
        public IEnumerable<Account> GetAccountsByUserId(string userId)
        {
            return GetQuery().Where(account => account.UserId == userId);
        }

        protected override IQueryable<Account> GetQuery()
        {
            return _entitySet.Include("Currency").Include("AccountType").Include("User");
        }
    }
}