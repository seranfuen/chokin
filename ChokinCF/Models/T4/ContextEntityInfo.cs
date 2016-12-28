using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChokinCF.Models.T4
{
    public class ContextEntityInfo
    {

        public ContextEntityInfo(string contextPropertyName, Type entityType)
        {
            ContextPropertyName = contextPropertyName;
            EntityType = entityType;
        }

        public string ContextPropertyName
        {
            get;
            private set;
        }

        public Type EntityType
        {
            get;
            private set;
        }

        public string EntityName
        {
            get
            {
                return EntityType.Name;
            }
        }

        public override string ToString()
        {
            return ContextPropertyName + " -> " + EntityType.Name;
        }
    }
}