import React, { useState } from 'react';
import { auth } from '../lib/storage';
import { emailService } from '../lib/emailService';
import { XMarkIcon } from './icons/XMarkIcon';
import { useTranslation } from '../hooks/useTranslation';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useTranslation();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = auth.getUserByUsername(username);
    if (!user) {
      setError(t('userNotFound'));
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    auth.setUserResetCode(username, code);

    // This service is mocked to show an alert, but can be configured
    await emailService.sendResetCode(user.email, username, code);

    setSuccess(t('resetCodeSent'));
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = auth.verifyAndResetPassword(username, resetCode, newPassword);
    if (result.success) {
      setSuccess(t('passwordResetSuccess'));
      setTimeout(() => {
        onClose();
      }, 3000);
    } else {
      setError(result.message || t('invalidResetCode'));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {step === 1 ? (
          <form onSubmit={handleSendCode}>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('forgotPasswordTitle')}</h2>
                <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('forgotPasswordInstructions')}</p>
              <input type="text" placeholder={t('username')} value={username} onChange={e => setUsername(e.target.value)} required className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md">{t('cancel')}</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">{t('sendResetCode')}</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('resetPassword')}</h2>
                <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('resetPasswordInstructions')}</p>
              <div className="space-y-4">
                  <input type="text" placeholder={t('resetCode')} value={resetCode} onChange={e => setResetCode(e.target.value)} required className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
                  <input type="password" placeholder={t('newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 sm:text-sm" />
              </div>
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm mt-4 text-center">{success}</p>}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md">{t('cancel')}</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">{t('resetPassword')}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
