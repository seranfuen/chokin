using ChokinCF.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace ChokinCF.Controllers
{
    public class ControllerBase : Controller
    {
        protected IRepository _currentRepository;
        protected UnitOfWork _currentUnitOfWork;

        protected void InitializeRepository(IRepository repository)
        {
            _currentRepository = repository;
            _currentRepository.SetCurrentUser(User.Identity.GetUserName());
        }

        protected void InitializeUnitOfWork(UnitOfWork unitOfWork)
        {

        }
    }
}