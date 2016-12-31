using ChokinCF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChokinCF.Repository
{
    public interface IRepository : IDisposable
    {

    }

    public interface IRepository<T> : IRepository where T : class, IId, IAuditable, new()
    {
        IEnumerable<T> Entities { get; }
        IEnumerable<T> FindByPredicate(Func<T, bool> predicate);
        T AddEntity(T entity);
        void DeleteEntity(T entity);
        void SaveChanges();
    }
}