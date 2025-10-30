import React, { useState } from 'react';
import { auth } from '../lib/storage';
import { XMarkIcon } from './icons/XMarkIcon';
import { useTranslation } from '../hooks/useTranslation';

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }
    
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        const result = auth.changePassword(currentUser, currentPassword, newPassword);
        if (result.success) {
            setSuccess(t('passwordChangedSuccess'));
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            setError(result.message);
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('changePasswordTitle')}</h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input type="password" placeholder={t('currentPassword')} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              <input type="password" placeholder={t('newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              <input type="password" placeholder={t('confirmNewPassword')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
            </div>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-4 text-center">{success}</p>}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">{t('cancel')}</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">{t('saveChanges')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
