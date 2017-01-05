using ChokinCF.Models;

namespace ChokinCF.Repository
{
    public interface ICurrencyRepository : IRepository<Currency>
    {
        bool HasCurrency(string name);
        bool HasCurrencyWithName(Currency currency);
    }
}