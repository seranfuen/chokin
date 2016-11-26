using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chokin.Models
{
    public partial class Account
    {
        public AccountTypeEnum AccountType
        {
            get
            {
                return (AccountTypeEnum)TypeId;
            }
        }

        public string AccountTypeName
        {
            get
            {
                return AccountType.ToString();
            }
        }
    }
}