using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ChokinCF.Models
{
    // We will only use Assets (bank account, deposits, other financial assets), Income and Expenses, but for sake of completeness we'll add all types
    public enum AccountTypeEnum
    {
        Asset,
        Liability,
        Equity,
        Income,
        Expense
    }

    public partial class AccountType
    {
        [ScaffoldColumn(false)]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; }

        [ScaffoldColumn(false)]
        public int TypeId { get; set; }

        [NotMapped]
        public AccountTypeEnum Type
        {
            get
            {
                return (AccountTypeEnum)TypeId;
            }
            set
            {
                TypeId = (int)value;
            }
        }
    }
}