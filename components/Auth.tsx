import React, { useState } from 'react';
import { auth } from '../lib/storage';
import { useTranslation } from '../hooks/useTranslation';
import ForgotPasswordModal from './ForgotPasswordModal';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      if (auth.login(username, password)) {
        onLoginSuccess();
      } else {
        setError(t('invalidCredentials'));
      }
    } else {
      if (auth.signup(username, password, email)) {
        onLoginSuccess();
      } else {
        setError(t('usernameTaken'));
      }
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLoginView ? t('signInTitle') : t('createAccountTitle')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">{t('username')}</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isLoginView ? 'rounded-t-md' : 'rounded-t-md'}`}
                placeholder={t('username')}
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            {!isLoginView && (
              <div className="-mt-px">
                <label htmlFor="email" className="sr-only">{t('email')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t('email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            )}
            <div className="-mt-px">
              <label htmlFor="password-input" className="sr-only">{t('password')}</label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isLoginView ? 'rounded-b-md' : 'rounded-b-md'}`}
                placeholder={t('password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isLoginView && (
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <button
                    type="button"
                    onClick={() => setIsForgotPasswordModalOpen(true)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    {t('forgotPassword')}
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoginView ? t('signIn') : t('signUp')}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {isLoginView ? t('noAccount') : t('alreadyHaveAccount')}{' '}
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {isLoginView ? t('createOne') : t('signIn')}
          </button>
        </p>
      </div>
    </div>
    {isForgotPasswordModalOpen && <ForgotPasswordModal onClose={() => setIsForgotPasswordModalOpen(false)} />}
    </>
  );
};

export default Auth;