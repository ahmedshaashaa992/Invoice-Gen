import React from 'react';
import { Invoice, LineItem, Customer } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { useTranslation } from '../hooks/useTranslation';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  onGenerate: () => void;
  customers: Customer[];
  onSaveTemplate: (templateName: string) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice, onGenerate, customers, onSaveTemplate }) => {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    if (keys.length > 1) {
      setInvoice(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev as any)[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setInvoice(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoice(prev => ({...prev, logoUrl: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  }
  
  const handleItemChange = (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
    const newItems = invoice.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      hours: 1,
      rate: 0,
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };
  
  const removeItem = (id: string) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find(c => c.id === customerId);

    if (selectedCustomer) {
      setInvoice(prev => ({
        ...prev,
        recipient: {
          name: selectedCustomer.name,
          address: selectedCustomer.address,
        },
        notes: prev.notes.includes('Payment Terms:') || prev.notes.includes(t('paymentTermsLabel')) ? prev.notes : `${t('paymentTermsLabel')}: ${selectedCustomer.paymentTerms}\n\n${prev.notes}`,
      }));
    } else {
       setInvoice(prev => ({
        ...prev,
        recipient: { name: '', address: ''},
      }));
    }
  };

  const handleSaveTemplateClick = () => {
    const name = prompt(t('enterTemplateName'));
    if (name) {
      onSaveTemplate(name);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('createInvoice')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('invoiceNumber')}</label>
          <input type="text" name="invoiceNumber" id="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('invoiceDate')}</label>
          <input type="date" name="invoiceDate" id="invoiceDate" value={invoice.invoiceDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('taxNumber')}</label>
          <input type="text" name="taxNumber" id="taxNumber" value={invoice.taxNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subject')}</label>
          <input type="text" name="subject" id="subject" value={invoice.subject} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="contractDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contractDate')}</label>
          <input type="date" name="contractDate" id="contractDate" value={invoice.contractDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm" />
        </div>
        <div>
            <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('companyLogo')}</label>
            <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900/60"/>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('from')}</h3>
          <div className="space-y-4">
            <input type="text" placeholder={t('yourNamePlaceholder')} name="sender.name" value={invoice.sender.name} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
            <textarea placeholder={t('yourAddressPlaceholder')} name="sender.address" value={invoice.sender.address} onChange={handleInputChange} rows={3} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm"></textarea>
            <input type="text" placeholder={t('yourPhonePlaceholder')} name="sender.phone" value={invoice.sender.phone} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('to')}</h3>
          <div className="mb-4">
            <label htmlFor="customer-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('selectCustomer')}</label>
            <select
              id="customer-select"
              onChange={handleCustomerSelect}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 sm:text-sm"
            >
              <option value="">{t('selectOrEnterManually')}</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder={t('clientNamePlaceholder')} name="recipient.name" value={invoice.recipient.name} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
            <textarea placeholder={t('clientAddressPlaceholder')} name="recipient.address" value={invoice.recipient.address} onChange={handleInputChange} rows={3} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm"></textarea>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('items')}</h3>
        <div className="space-y-4">
          {invoice.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <input type="text" placeholder={t('descriptionPlaceholder')} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="col-span-12 md:col-span-4 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              <input type="text" placeholder={t('detailsPlaceholder')} value={item.details || ''} onChange={e => handleItemChange(item.id, 'details', e.target.value)} className="col-span-6 md:col-span-2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              <input type="number" placeholder={t('hoursPlaceholder')} value={item.hours || ''} onChange={e => handleItemChange(item.id, 'hours', parseFloat(e.target.value))} className="col-span-6 md:col-span-2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              <input type="number" placeholder={t('ratePlaceholder')} value={item.rate || ''} onChange={e => handleItemChange(item.id, 'rate', parseFloat(e.target.value))} className="col-span-6 md:col-span-2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              <button onClick={() => removeItem(item.id)} aria-label={t('removeItemAria')} className="col-span-6 md:col-span-2 flex items-center justify-center text-red-500 hover:text-red-700 dark:hover:text-red-400">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-sm">
          <PlusIcon className="w-5 h-5" />
          {t('addItem')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
         <div>
          <label htmlFor="payee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('payee')}</label>
          <input type="text" name="payee" id="payee" value={invoice.payee} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('bankDetails')}</label>
          <textarea name="bankDetails" id="bankDetails" value={invoice.bankDetails} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm"></textarea>
        </div>
      </div>
       <div className="mt-8">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('notes')}</label>
          <textarea name="notes" id="notes" value={invoice.notes} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm"></textarea>
        </div>
      
      <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3">
        <button onClick={handleSaveTemplateClick} className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {t('saveAsTemplate')}
        </button>
        <button onClick={onGenerate} className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {t('generateInvoice')}
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;