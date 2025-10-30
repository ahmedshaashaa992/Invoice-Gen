import React from 'react';
import { Template } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { useTranslation } from '../hooks/useTranslation';

interface TemplateListProps {
  templates: Template[];
  onUse: (template: Template) => void;
  onDelete: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, onUse, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('invoiceTemplates')}</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {templates.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {templates.map(template => (
              <li key={template.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">{template.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('from')}: {template.sender.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('subject')}: {template.subject}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => onUse(template)}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                    {t('useTemplate')}
                  </button>
                  <button 
                    onClick={() => onDelete(template.id)} 
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                    aria-label={t('deleteTemplateAria', { name: template.name })}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 px-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('noTemplatesYet')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('createFirstTemplate')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;