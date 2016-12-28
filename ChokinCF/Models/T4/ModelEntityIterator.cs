using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ChokinCF.Models.T4
{
    public class ModelEntityIterator
    {
        private Type _contextDbType;

        public ModelEntityIterator(Type contextDbType)
        {
            _contextDbType = contextDbType;
        }

        public List<ContextEntityInfo> ContextEntities
        {
            get
            {
                var listContextEntities = new List<ContextEntityInfo>();
                foreach (var property in _contextDbType.GetProperties())
                {
                    var typeName = GetTypeName(property.PropertyType.Name);
                    if (typeName == typeof(DbSet).Name)
                    {
                        if (property.PropertyType.GenericTypeArguments != null && property.PropertyType.GenericTypeArguments.Length == 1)
                        {
                            listContextEntities.Add(new ContextEntityInfo(property.Name, property.PropertyType.GenericTypeArguments[0]));
                        }
                    }
                }
                return listContextEntities;
            }
        }

        private string GetTypeName(string typeName)
        {
            var index = typeName.IndexOf("`");
            if (index == -1)
            {
                return typeName;
            } else
            {
                return typeName.Substring(0, index);
            }
        }
    }
}