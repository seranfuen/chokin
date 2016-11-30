using Chokin.Models;
using Chokin.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace Chokin.ViewModels
{
    public class AccountViewModel : ICurrency
    {
        private Account _account;

        public AccountViewModel(Account account)
        {
            _account = account;
        }

        public Currency Currency
        {
            get
            {
                return _account.Currency;
            }
        }

        [DisplayName("Currency")]
        public string CurrencyName
        {
            get
            {
                return Currency.Name;
            }
        }

        [DisplayName("Id")]
        public int Id
        {
            get { return _account.Id; }
        }

        [DisplayName("Account Name")]
        public string Name
        {
            get { return _account.Name; }
        }

        [DisplayName("Account Type")]
        public string AccountType
        {
            get { return _account.AccountTypeName; }
        }

        [DisplayName("User")]
        public string UserName
        {
            get { return _account.AspNetUser.UserName; }
        }

        [DisplayName("Credit")]
        public string Credit
        {
            get
            {
                return this.ToMonetaryString(_account.Credit);
            }
        }

        [DisplayName("Debit")]
        public string Debit
        {
            get
            {
                return this.ToMonetaryString(_account.Debit);
            }
        }

        [DisplayName("Balance")]
        public string Balance
        {
            get
            {
                return this.ToMonetaryString(_account.Balance);
            }
        }

        public string Description
        {
            get { return _account.Description; }
        }
    }
}