using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Description;
using ChokinCF.Models;
using ChokinCF.Repository;

namespace ChokinCF.API
{
    public class CurrenciesController : ApiControllerBase
    {
        private ICurrencyRepository _repository;

        public CurrenciesController(ICurrencyRepository repository)
        {
            _repository = repository;
        }

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            InitializeRepository(_repository);
        }

        [Authorize(Roles = "Admin")]
        // GET: api/Currencies
        public IEnumerable<Currency> GetCurrencies()
        {
            return _repository.Entities;
        }

        // GET: api/Currencies/5
        [ResponseType(typeof(Currency))]
        public IHttpActionResult GetCurrency(int id)
        {
            Currency currency = _repository.FindById(id);
            if (currency == null)
            {
                return NotFound();
            }

            return Ok(currency);
        }

        // PUT: api/Currencies/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCurrency(int id, Currency currency)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id != currency.Id)
            {
                return BadRequest();
            }
            else if (_repository.HasCurrency(currency.Name))
            {
                return BadRequest("There is already another currency with the same name");
            }

            _repository.Edit(currency);
            try
            {
                _repository.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (_repository.FindById(id) == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Currencies
        [ResponseType(typeof(Currency))]
        public IHttpActionResult PostCurrency(Currency currency)
        {
            if (currency == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (_repository.HasCurrency(currency.Name))
            {
                return BadRequest("There is already another currency with the same name");
            }
            _repository.AddEntity(currency);
            _repository.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = currency.Id }, currency);
        }

        // DELETE: api/Currencies/5
        [ResponseType(typeof(Currency))]
        public IHttpActionResult DeleteCurrency(int id)
        {
            Currency currency = _repository.FindById(id);
            if (currency == null)
            {
                return NotFound();
            }

            _repository.DeleteEntity(currency);
            _repository.SaveChanges();

            return Ok(currency);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repository.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}