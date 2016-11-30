using Chokin.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chokin.ViewModels
{
    public static class ViewHelper
    {
        public static string ToMonetaryString(this ICurrency currency, decimal amount )
        {
            return string.Format("{0:n2} {1}", amount, currency.Currency.Symbol);
        }
    }
}