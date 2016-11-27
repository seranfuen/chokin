//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Chokin.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class RecurringTransaction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Concept { get; set; }
        public decimal Amount { get; set; }
        public int DebitAccountId { get; set; }
        public int CreditAcountId { get; set; }
        public byte DayMonth { get; set; }
        public bool Active { get; set; }
        public string UserId { get; set; }
        public int CurrencyId { get; set; }
    
        public virtual Account Account { get; set; }
        public virtual Account Account1 { get; set; }
        public virtual AspNetUser AspNetUser { get; set; }
        public virtual Currency Currency { get; set; }
    }
}
