using ChokinCF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChokinCF.Repository
{
    public interface IRepository<T> where T : class, IId, IAuditable, new()
    {
        List<T> Entities { get; }
        List<T> FindByPredicate(Func<T, bool> predicate);
        T Create();
        T AddEntity(T entity);
        void DeleteEntity(T entity);
        void SaveChanges();
    }
}
