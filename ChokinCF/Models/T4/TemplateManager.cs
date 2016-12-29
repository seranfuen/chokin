using EnvDTE;
using Microsoft.VisualStudio.TextTemplating;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace ChokinCF.Models.T4
{
    /// <summary>
    /// Adapted from https://damieng.com/blog/2009/11/06/multiple-outputs-from-t4-made-easy-revisited
    /// </summary>
    public class TemplateManager
    {
        private StringBuilder _template;
        private string _fileName;
        private ITextTemplatingEngineHost _host;
        private DTE _dte;
        private ProjectItem _templateProjectItem;
        private List<string> _listFilesAdded = new List<string>();

        public TemplateManager(ITextTemplatingEngineHost host, StringBuilder template)
        {
            _template = template;
            _host = host;

            var hostServiceProvider = (IServiceProvider)host;
            if (hostServiceProvider == null)
                throw new ArgumentNullException("Could not obtain IServiceProvider");
            _dte = (DTE)hostServiceProvider.GetService(typeof(DTE));
            if (_dte == null)
            {
                throw new ArgumentNullException("Could not obtain DTE from host");
            }
            _templateProjectItem = _dte.Solution.FindProjectItem(host.TemplateFile);
        }

        public void StartFile(string fileName)
        {
            _fileName = fileName;
        }

        public void Flush()
        {
            var path = Path.GetDirectoryName(_host.TemplateFile);
            var pathFileName = Path.Combine(path, _fileName);
            File.WriteAllText(pathFileName, _template.ToString());
            _listFilesAdded.Add(pathFileName);
            _template.Clear();
        }

        public void SyncProject()
        {
            var originalFilePrefix = Path.GetFileNameWithoutExtension(_templateProjectItem.get_FileNames(0)) + ".";
            var dictionaryProjectFiles = new Dictionary<string, ProjectItem>();
            foreach (ProjectItem projectItem in _templateProjectItem.ProjectItems)
            {
                dictionaryProjectFiles[projectItem.get_FileNames(0)] = projectItem;
            }

            foreach (var pair in dictionaryProjectFiles)
            {
                if (!_listFilesAdded.Contains(pair.Key) && !(Path.GetFileNameWithoutExtension(pair.Key) + ".").StartsWith(originalFilePrefix))
                {
                    pair.Value.Delete();
                }
            }

            foreach (var file in _listFilesAdded)
            {
                if (!dictionaryProjectFiles.ContainsKey(file))
                {
                    _templateProjectItem.ProjectItems.AddFromFile(file);
                }
            }
            _template.Clear();
        }
    }
}