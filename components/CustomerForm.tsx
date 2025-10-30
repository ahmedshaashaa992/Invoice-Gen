import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { useTranslation } from '../hooks/useTranslation';

interface CustomerFormProps {
  customerToEdit: Customer | null;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customerToEdit, onSave, onCancel }) => {
  const [customer, setCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    address: '',
    email: '',
    paymentTerms: 'Net 30',
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (customerToEdit) {
      setCustomer(customerToEdit);
    } else {
       setCustomer({ name: '', address: '', email: '', paymentTerms: 'Net 30' });
    }
  }, [customerToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerData = {
        ...customer,
        id: customerToEdit?.id || crypto.randomUUID(),
    };
    onSave(customerData);
  };

  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {customerToEdit ? t('editCustomer') : t('addCustomer')}
                    </h2>
                    <button type="button" onClick={onCancel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('nameLabel')}</label>
                        <input type="text" name="name" id="name" value={customer.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')}</label>
                        <input type="email" name="email" id="email" value={customer.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('addressLabel')}</label>
                        <textarea name="address" id="address" value={customer.address} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm"></textarea>
                    </div>
                    <div>
                        <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('paymentTermsLabel')}</label>
                        <input type="text" name="paymentTerms" id="paymentTerms" value={customer.paymentTerms} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
                    </div>
                </div>
            </div>
          
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                    {t('cancel')}
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                    {t('saveCustomer')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;