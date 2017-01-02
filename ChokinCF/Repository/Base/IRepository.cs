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
        void SetCurrentUser(string userId);
        void SaveChanges();
    }

    public interface IRepository<T> : IRepository where T : class, IId, IAuditable, new()
    {
        IEnumerable<T> Entities { get; }
        IEnumerable<T> FindByPredicate(Func<T, bool> predicate);
        T FindById(int id);
        T AddEntity(T entity);
        void Edit(T entity);
        void DeleteEntity(T entity);
    }
}