import React, { useState, useEffect, useRef } from 'react';
import { Invoice, Customer, Template, UserData } from './types';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import TemplateList from './components/TemplateList';
import Auth from './components/Auth';
import ChangePasswordModal from './components/ChangePasswordModal';
import { DocumentIcon } from './components/icons/DocumentIcon';
import { UserGroupIcon } from './components/icons/UserGroupIcon';
import { TemplateIcon } from './components/icons/TemplateIcon';
import { LogoutIcon } from './components/icons/LogoutIcon';
import { UserIcon } from './components/icons/UserIcon';
import { KeyIcon } from './components/icons/KeyIcon';
import { GlobeAltIcon } from './components/icons/GlobeAltIcon';
import { ArrowDownTrayIcon } from './components/icons/ArrowDownTrayIcon';
import { ArrowUpTrayIcon } from './components/icons/ArrowUpTrayIcon';
import { auth, db } from './lib/storage';
import { useLanguage } from './contexts/LanguageContext';
import { useTranslation } from './hooks/useTranslation';

const createNewInvoice = (template?: Template): Invoice => {
  const baseInvoice = template ? { ...template } : {
    sender: { name: '', address: '', phone: '' },
    taxNumber: '',
    payee: '',
    bankDetails: '',
    logoUrl: '',
    recipient: {name: '', address: ''},
    items: [{ id: crypto.randomUUID(), description: '', hours: 1, rate: 0 }],
    notes: '',
  };

  return {
    ...baseInvoice,
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    recipient: template?.recipient || {name: '', address: ''},
  };
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(auth.getCurrentUser());
  const [invoice, setInvoice] = useState<Invoice>(createNewInvoice());
  const [showPreview, setShowPreview] = useState(false);
  const [currentView, setCurrentView] = useState<'invoice' | 'customers' | 'templates'>('invoice');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const { language, setLanguage } = useLanguage();
  const { t, loading: translationsLoading } = useTranslation();


  useEffect(() => {
    if (currentUser) {
      const userData = db.getUserData();
      if (userData) {
        setCustomers(userData.customers);
        setTemplates(userData.templates);
        setInvoice(createNewInvoice(userData.templates[0]));
      }
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (currentUser) {
        db.saveUserData({ customers, templates });
    }
  }, [customers, templates, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginSuccess = () => {
    setCurrentUser(auth.getCurrentUser());
    setShowPreview(false);
    setCurrentView('invoice');
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
  };
  
  const handleGenerateInvoice = () => setShowPreview(true);
  const handleEditInvoice = () => setShowPreview(false);

  const handleNewInvoice = (template?: Template) => {
    setInvoice(createNewInvoice(template));
    setShowPreview(false);
    setCurrentView('invoice');
  };

  const handleSaveCustomer = (customer: Customer) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === customer.id ? customer : c));
    } else {
      setCustomers([...customers, customer]);
    }
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
  };
  
  const handleAddNewCustomer = () => {
    setEditingCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const handleSaveTemplate = (templateName: string) => {
      const newTemplate: Template = {
          id: crypto.randomUUID(),
          name: templateName,
          ...invoice,
      };
      delete (newTemplate as Partial<Invoice>).invoiceNumber;
      delete (newTemplate as Partial<Invoice>).invoiceDate;

      setTemplates(prev => [...prev, newTemplate]);
      alert(t('templateSaved', { templateName }));
  };

  const handleDeleteTemplate = (templateId: string) => {
      setTemplates(templates.filter(t => t.id !== templateId));
  };

  const handleExportData = () => {
    const userData = db.getUserData();
    if (userData) {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(userData, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "invoice-data.json";
      link.click();
    }
    setIsUserMenuOpen(false);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text !== 'string') throw new Error('File content is not a string');
          const importedData: UserData = JSON.parse(text);

          if (importedData && Array.isArray(importedData.customers) && Array.isArray(importedData.templates)) {
            db.saveUserData(importedData);
            setCustomers(importedData.customers);
            setTemplates(importedData.templates);
            if (importedData.templates.length > 0) {
              handleNewInvoice(importedData.templates[0]);
            } else {
              handleNewInvoice();
            }
            alert(t('importSuccess'));
          } else {
            throw new Error('Invalid data structure');
          }
        } catch (error) {
          console.error("Failed to import data:", error);
          alert(t('importError'));
        }
      };
      reader.readAsText(file);
    }
    if (event.target) {
        event.target.value = '';
    }
    setIsUserMenuOpen(false);
  };

  const renderContent = () => {
    switch(currentView) {
      case 'customers':
        return <CustomerList customers={customers} onAdd={handleAddNewCustomer} onEdit={handleEditCustomer} onDelete={handleDeleteCustomer} />;
      case 'templates':
        return <TemplateList templates={templates} onUse={handleNewInvoice} onDelete={handleDeleteTemplate} />;
      case 'invoice':
      default:
        if (showPreview) {
          return <InvoicePreview invoice={invoice} onEdit={handleEditInvoice} onNew={() => handleNewInvoice()} />;
        }
        return <InvoiceForm invoice={invoice} setInvoice={setInvoice} onGenerate={handleGenerateInvoice} customers={customers} onSaveTemplate={handleSaveTemplate} />;
    }
  };

  if (translationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <input type="file" ref={importInputRef} className="hidden" accept=".json" onChange={handleImportData} />
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <DocumentIcon className="h-8 w-8 text-indigo-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('appTitle')}</h1>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setCurrentView('invoice')} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'invoice' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <DocumentIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{t('invoice')}</span>
            </button>
            <button onClick={() => setCurrentView('customers')} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'customers' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <UserGroupIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{t('customers')}</span>
            </button>
            <button onClick={() => setCurrentView('templates')} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'templates' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <TemplateIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{t('templates')}</span>
            </button>
            
            <div ref={userMenuRef} className="relative ml-2 sm:ml-4 border-l border-gray-200 dark:border-gray-700 pl-2 sm:pl-4">
                <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center gap-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('openUserMenu')} aria-haspopup="true" aria-expanded={isUserMenuOpen}>
                    <UserIcon className="h-5 w-5"/>
                    <span className="hidden md:inline text-sm font-medium">{currentUser}</span>
                </button>
                {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                        <div className="px-4 py-3" role="none">
                            <p className="text-sm text-gray-700 dark:text-gray-200" role="none">{t('signedInAs')}</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate" role="none">{currentUser}</p>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700" role="none"></div>
                        <div className="py-1" role="none">
                             <button onClick={() => { setIsChangePasswordModalOpen(true); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                <KeyIcon className="h-5 w-5" />
                                <span>{t('changePassword')}</span>
                            </button>
                            <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                <LogoutIcon className="h-5 w-5" />
                                <span>{t('logout')}</span>
                            </button>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700" role="none"></div>
                         <div className="py-1" role="none">
                            <button onClick={() => importInputRef.current?.click()} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                <ArrowUpTrayIcon className="h-5 w-5" />
                                <span>{t('importData')}</span>
                            </button>
                             <button onClick={handleExportData} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>{t('exportData')}</span>
                            </button>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700" role="none"></div>
                        <div className="py-1" role="none">
                           <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400 flex items-center gap-2"><GlobeAltIcon className="h-5 w-5"/> {t('language')}</div>
                            <button onClick={() => { setLanguage('en'); setIsUserMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`} role="menuitem">
                                🇬🇧 English
                            </button>
                             <button onClick={() => { setLanguage('de'); setIsUserMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === 'de' ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`} role="menuitem">
                                🇩🇪 Deutsch
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {isCustomerModalOpen && <CustomerForm customerToEdit={editingCustomer} onSave={handleSaveCustomer} onCancel={() => { setIsCustomerModalOpen(false); setEditingCustomer(null); }} />}
      {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setIsChangePasswordModalOpen(false)} />}

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} React Invoice Generator. {t('allRightsReserved')}</p>
      </footer>
    </div>
  );
};

export default App;
