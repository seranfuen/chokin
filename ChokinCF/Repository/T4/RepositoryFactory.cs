﻿//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using ChokinCF.Models;

namespace ChokinCF.Repository
{
    public class RepositoryFactory
    {
		private Dictionary<Type, IRepository> _repositoryCache;
		private ApplicationDbContext _context;

		public RepositoryFactory(ApplicationDbContext context) 
		{
			_context = context;
			_repositoryCache = new Dictionary<Type, IRepository>();
		}

		public IRepository<Currency> CurrencyRepository 
		{
			get 
			{
				var modelType = typeof(Currency);
				if (!_repositoryCache.ContainsKey(typeof(Currency))) 
				{
					_repositoryCache[modelType] = new CurrencyRepository(_context);
				}
				return (IRepository<Currency>)_repositoryCache[modelType];
			}
		}

		public IRepository<Account> AccountRepository 
		{
			get 
			{
				var modelType = typeof(Account);
				if (!_repositoryCache.ContainsKey(typeof(Account))) 
				{
					_repositoryCache[modelType] = new AccountRepository(_context);
				}
				return (IRepository<Account>)_repositoryCache[modelType];
			}
		}

		public IRepository<AccountType> AccountTypeRepository 
		{
			get 
			{
				var modelType = typeof(AccountType);
				if (!_repositoryCache.ContainsKey(typeof(AccountType))) 
				{
					_repositoryCache[modelType] = new AccountTypeRepository(_context);
				}
				return (IRepository<AccountType>)_repositoryCache[modelType];
			}
		}

        public static CurrencyRepository CreateCurrencyRepository()
        {
            return new CurrencyRepository(new ApplicationDbContext());
        }
        public static AccountRepository CreateAccountRepository()
        {
            return new AccountRepository(new ApplicationDbContext());
        }
        public static AccountTypeRepository CreateAccountTypeRepository()
        {
            return new AccountTypeRepository(new ApplicationDbContext());
        }
   }
}