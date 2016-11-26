using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chokin.Models
{
    public enum AccountTypeEnum
    {
        Asset = 10,
        Equity = 20,
        Expenses = 30,
        Revenue = 40
    }

    public class AccountType
    {
        public AccountType(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public int Id
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public static List<AccountType> AccountTypes
        {
            get
            {
                var types = new List<AccountType>();
                foreach (var typeValue in Enum.GetValues(typeof(AccountTypeEnum)))
                {
                    types.Add(new AccountType((int)typeValue, typeValue.ToString()));
                }
                return types.OrderBy(type => type.Id).ToList();
            }
        }
    }
}