import React from 'react';
import { Invoice } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface InvoicePreviewProps {
  invoice: Invoice;
  onEdit: () => void;
  onNew: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onEdit, onNew }) => {
  const { t, language } = useTranslation();

  const total = invoice.items.reduce((acc, item) => {
    const amount = (item.hours || (item.details === 'Pauchale' ? 1 : 0)) * (item.rate || 0);
    return acc + amount;
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Use toLocaleDateString for better i18n
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  }

  const formatCurrency = (amount?: number) => {
    if (typeof amount === 'undefined') return '';
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
  }
  
  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 print:hidden">
            <button onClick={onEdit} className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {t('editInvoice')}
            </button>
            <button onClick={handlePrint} className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {t('printOrDownload')}
            </button>
            <button onClick={onNew} className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                {t('newInvoice')}
            </button>
        </div>

        <div id="invoice-content" className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-4xl mx-auto print:shadow-none print:rounded-none font-[Arial,sans-serif] text-sm text-black">
            
            <div className="bg-black text-white p-2 text-right">
                <strong>{t('previewDateLabel')}:</strong> {formatDate(invoice.invoiceDate)}
            </div>

            <header className="flex justify-between items-start mt-8 mb-8">
                <div>
                    <p className="font-bold text-base">{invoice.sender.name}</p>
                    <p className="whitespace-pre-line">{invoice.sender.address}</p>
                    <p>{invoice.sender.phone}</p>
                </div>
                <div className="text-right">
                    <p>{t('previewTaxNumberLabel')}: {invoice.taxNumber}</p>
                    <h2 className="text-2xl font-bold underline mt-1">{t('previewInvoiceNumberLabel')}: {invoice.invoiceNumber}</h2>
                    {invoice.logoUrl && (
                        <img src={invoice.logoUrl} alt={t('companyLogoAlt')} className="w-48 mt-4 ml-auto" />
                    )}
                </div>
            </header>
            
            <section className="mb-8">
                <p className="font-bold">{t('previewToLabel')}</p>
                <p>{invoice.recipient.name}</p>
                <p className="whitespace-pre-line">{invoice.recipient.address}</p>
            </section>
            
            <section className="flex justify-between items-center border-b border-gray-400 pb-4 mb-4">
                <p className="font-bold">{invoice.subject}</p>
                <p>{t('previewContractDateLabel')} {formatDate(invoice.contractDate || '1970-01-01')}</p>
            </section>
            
            <section className="mb-4">
                <table className="w-full">
                    <thead>
                        <tr className="text-blue-800">
                            <th className="text-left font-bold py-2">{t('previewDescriptionHeader')}</th>
                            <th className="text-center font-bold py-2">{t('previewHoursHeader')}</th>
                            <th className="text-center font-bold py-2">{t('previewRateHeader')}</th>
                            <th className="text-right font-bold py-2">{t('previewAmountHeader')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map(item => {
                             const itemTotal = (item.hours || (item.details === 'Pauchale' ? 1 : 0)) * (item.rate || 0);
                             return (
                                <tr key={item.id} className="border-b border-gray-300">
                                    <td className={`py-2 ${!item.hours && !item.rate && !item.details ? 'pl-8' : ''}`}>
                                        {item.description}
                                    </td>
                                    <td className="py-2 text-center">{item.hours || (item.details ? item.details : '')}</td>
                                    <td className="py-2 text-center">{item.rate ? formatCurrency(item.rate) : ''}</td>
                                    <td className="py-2 text-right">{item.rate ? formatCurrency(itemTotal) : ''}</td>
                                </tr>
                             )
                        })}
                    </tbody>
                </table>
            </section>
            
             <section className="flex justify-end mb-8">
                <div className="w-1/3 text-right">
                    <div className="flex justify-between items-center">
                        <p className="text-blue-800">{t('total')}</p>
                        <p className="font-bold text-base">{formatCurrency(total)}</p>
                    </div>
                </div>
            </section>
            
            <footer className="space-y-2">
                <p><strong>{t('previewPayeeLabel')}:</strong> {invoice.payee}</p>
                <p><strong>{t('previewBankDetailsLabel')}:</strong> {invoice.bankDetails}</p>
                <p className="pt-4"><strong>{t('previewNotesLabel')}:</strong> {invoice.notes}</p>
            </footer>
        </div>
    </div>
  );
};

export default InvoicePreview;