using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChokinCF.Models
{
    /// <summary>
    /// Interface that all auditable entities must implement
    /// </summary>
    public interface IAuditable
    {
        DateTime CreatedOn 
        {
            get;
            set;
        }

        string CreatedUserId
        {
            get;
            set;
        }

        ApplicationUser CreatedUser
        {
            get;
            set;
        }

        DateTime LastModifiedOn
        {
            get;
            set;
        }

        string LastModifiedUserId
        {
            get;
            set;
        }

        ApplicationUser LastModifiedUser
        {
            get;
            set;
        }
    }
}
