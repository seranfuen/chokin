using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChokinCF.Models
{
    /// <summary>
    /// An interface that all entities with numeric IDs must implement. Exposes the ID
    /// </summary>
    public interface IId
    {
        int Id { get; set; }
    }
}
