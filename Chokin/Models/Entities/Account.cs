using Chokin.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace Chokin.Models
{
    public partial class Account : ICurrency
    {
  
        public AccountTypeEnum AccountType
        {
            get
            {
                return (AccountTypeEnum)TypeId;
            }
        }

        [DisplayName("Account Type")]
        public string AccountTypeName
        {
            get
            {
                return AccountType.ToString();
            }
        }

        public decimal Balance
        {
            get
            {
                return Debit - Credit;
            }
        }
    }
}