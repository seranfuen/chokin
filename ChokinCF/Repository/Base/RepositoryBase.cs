using ChokinCF.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ChokinCF.Repository
{
    public class RepositoryBase<T> : IRepository<T> where T : class, IId, IAuditable, new()
    {
        protected ApplicationDbContext _context;
        protected DbSet<T> _entitySet;
        protected string _userId;

        public RepositoryBase(ApplicationDbContext context)
        {
            _context = context;
            _entitySet = context.Set<T>();
        }

        public virtual IEnumerable<T> Entities
        {
            get
            {
                return GetQuery();
            }
        }

        public virtual T AddEntity(T entity)
        {
            return _entitySet.Add(entity);
        }

        public virtual void Edit(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
        }

        public virtual T FindById(int id)
        {
            return FindByPredicate(entity => entity.Id == id).SingleOrDefault();
        }

        public virtual void DeleteEntity(T entity)
        {
            _entitySet.Remove(entity);
        }

        public virtual IEnumerable<T> FindByPredicate(Func<T, bool> predicate)
        {
            return Entities.Where(predicate).ToList();
        }

        public virtual void SaveChanges()
        {
            _context.CurrentUserId = _userId;
            _context.SaveChanges();
        }
        public void SetCurrentUser(string userId)
        {
            _userId = userId;
        }

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }

        protected virtual IQueryable<T> GetQuery()
        {
            return _entitySet;
        }
    }
}