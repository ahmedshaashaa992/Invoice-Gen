import React from 'react';
import { Customer } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { useTranslation } from '../hooks/useTranslation';

interface CustomerListProps {
  customers: Customer[];
  onAdd: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onAdd, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('customers')}</h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="w-5 h-5" />
          {t('addCustomer')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {customers.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map(customer => (
              <li key={customer.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">{customer.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line">{customer.address}</p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button 
                    onClick={() => onEdit(customer)} 
                    className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    aria-label={t('editCustomerAria', { name: customer.name })}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onDelete(customer.id)} 
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                    aria-label={t('deleteCustomerAria', { name: customer.name })}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 px-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('noCustomersYet')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('addFirstCustomer')}</p>
            <button
              onClick={onAdd}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="w-5 h-5" />
              {t('addCustomer')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;