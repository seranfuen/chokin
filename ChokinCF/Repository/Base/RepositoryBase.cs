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
        protected IDbSet<T> _entitySet;

        public RepositoryBase(ApplicationDbContext context)
        {
            _context = context;
            _entitySet = context.Set<T>();
        }

        public virtual List<T> Entities
        {
            get
            {
                return _entitySet.ToList();
            }
        }

        public virtual T AddEntity(T entity)
        {
            return _entitySet.Add(entity);
        }

        public virtual T Create()
        {
            var newEntity = new T();
            InitializeEntity(newEntity);
            AddEntity(newEntity);
            return newEntity;
        }

        public virtual void DeleteEntity(T entity)
        {
            _entitySet.Remove(entity);
        }

        public virtual List<T> FindByPredicate(Func<T, bool> predicate)
        {
            return Entities.Where(predicate).ToList();
        }

        public virtual void SaveChanges()
        {
            _context.SaveChanges();
        }

        protected virtual void InitializeEntity(T entity)
        {
            
        }
    }
}