using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChokinCF.Models
{
    public class EntityBase : IId, IAuditable
    {
        public int Id
        {
            get;
            set;
        }

        public DateTime CreatedOn
        {
            get;
            set;
        }

        public string CreatedUserId
        {
            get;
            set;
        }

        public ApplicationUser CreatedUser
        {
            get;
            set;
        }

        public DateTime LastModifiedOn
        {
            get;
            set;
        }

        public string LastModifiedUserId
        {
            get;
            set;
        }

        public ApplicationUser LastModifiedUser
        {
            get;
            set;
        }
    }
}