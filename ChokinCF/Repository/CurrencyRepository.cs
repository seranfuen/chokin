using ChokinCF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChokinCF.Repository
{
    public partial class CurrencyRepository
    {
        public bool HasCurrency(string name)
        {
            return FindByPredicate(entity => entity.Name.Equals(name, StringComparison.OrdinalIgnoreCase)).Count() > 0;
        }

        public bool HasCurrencyWithName(Currency currency)
        {
            return FindByPredicate(entity => entity.Name.Equals(currency.Name, StringComparison.OrdinalIgnoreCase) && currency.Id != entity.Id).Count() > 0;
        }
    }
}