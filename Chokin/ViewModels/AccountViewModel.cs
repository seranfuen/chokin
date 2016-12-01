using Chokin.Models;
using Chokin.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Chokin.ViewModels
{
    public class AccountViewModel : ICurrency
    {
        private Account _account;
        private int? _accountTypeId;
        private string _name;
        private string _description;
        private int? _currencyId;
        private decimal _initialQuantity = decimal.Zero;

        public AccountViewModel(Account account)
        {
            _account = account;
            _accountTypeId = account.TypeId;
            _currencyId = account.CurrencyId;
            _name = account.Name;
            _description = account.Description;
        }

        public AccountViewModel()
        {

        }

        public Currency Currency
        {
            get
            {
                return _account != null ? _account.Currency : null;
            }
        }

        [DisplayName("Currency")]
        public string CurrencyName
        {
            get
            {
                if (_account != null)
                {
                    return Currency.Name;
                }
                else
                {
                    return null;
                }
            }
        }
        
        [DisplayName("Currency")]
        [Required]
        public int? CurrencyId
        {
            get
            {
                return _currencyId;
            }
            set
            {
                _currencyId = value;
            }
        }

        [DisplayName("Id")]
        public int Id
        {
            get { return _account != null ? _account.Id : 0; }
        }

        [DisplayName("Account Name")]
        [Required]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        [DisplayName("Account Type")]
        public string AccountType
        {
            get { return _account != null ? _account.AccountTypeName : null; }
        }

        [DisplayName("User")]
        public string UserName
        {
            get { return _account != null ? _account.AspNetUser.UserName : null; }
        }

        [DisplayName("Credit")]
        public string Credit
        {
            get
            {
                return _account != null ? this.ToMonetaryString(_account.Credit) : null;
            }
        }

        [DisplayName("Debit")]
        public string Debit
        {
            get
            {
                return _account != null ? this.ToMonetaryString(_account.Debit) : null;
            }
        }

        [DisplayName("Balance")]
        public string Balance
        {
            get
            {
                return _account != null ? this.ToMonetaryString(_account.Balance) : null;
            }
        }

        [DisplayName("Initial Quantity")]
        public decimal InitialQuantity
        {
            get { return _initialQuantity; }
            set { _initialQuantity = value; }
        }

        [DisplayName("Account Type")]
        [Required]
        public int? AccountTypeId
        {
            get
            {
                return _accountTypeId;
            }
            set
            {
                _accountTypeId = value;
            }
        }

        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }
    }
}