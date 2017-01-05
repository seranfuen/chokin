using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using ChokinCF.Repository;

namespace ChokinCF.API
{
    public class ApiControllerBase : ApiController
    {
        protected IRepository _currentRepository;
        protected UnitOfWork _currentUnitOfWork;

        protected void InitializeRepository(IRepository repository)
        {
            _currentRepository = repository;
            _currentRepository.SetCurrentUser(RequestContext.Principal.Identity.GetUserId());
        }

        protected void InitializeUnitOfWork(UnitOfWork unitOfWork)
        {

        }
    }
}