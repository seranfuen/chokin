using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ChokinCF.Models
{
    public class Account
    {
        [ScaffoldColumn(false)]
        public int Id { get; set; }

        [Required]
        public int AccountTypeId { get; set; }

        [Required]
        public int CurrencyId { get; set; }

        [ScaffoldColumn(false)]
        public string UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }

        [ScaffoldColumn(false)]
        public decimal Debit { get; set; }

        [ScaffoldColumn(false)]
        public decimal Credit { get; set; }

        public decimal Balance
        {
            get
            {
                var balance = Debit - Credit;
                // Balance changes sign on the right side of the balance sheet
                if (AccountType.Type == AccountTypeEnum.Equity || AccountType.Type == AccountTypeEnum.Income || AccountType.Type == AccountTypeEnum.Liability)
                {
                    return -balance;
                }
                else
                {
                    return balance;
                }
            }
        }

        public virtual ApplicationUser User { get; set; }
        public virtual Currency Currency { get; set; }
        public virtual AccountType AccountType { get; set; }
    }
}