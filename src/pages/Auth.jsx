import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { authService } from '../services/db';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('mobile');
  const [role, setRole] = useState('Team Member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const user = await authService.signIn(email, password);
        onAuthSuccess?.(user);
      } else {
        if (!name) {
          setError('Please provide your name.');
          setLoading(false);
          return;
        }
        const user = await authService.signUp(email, password, name, department, role);
        onAuthSuccess?.(user);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-surface px-4 transition-colors duration-300">
      <Card variant="extruded" className="w-full max-w-[420px] transition-all duration-300 border border-outline-variant/40">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-fixed mb-3 shadow-inner">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="var(--color-primary)" />
              <circle cx="12" cy="4" r="2" fill="var(--color-primary)" opacity="0.7" />
              <circle cx="12" cy="20" r="2" fill="var(--color-primary)" opacity="0.7" />
              <circle cx="4" cy="8" r="2" fill="var(--color-primary)" opacity="0.5" />
              <circle cx="20" cy="8" r="2" fill="var(--color-primary)" opacity="0.5" />
              <circle cx="4" cy="16" r="2" fill="var(--color-primary)" opacity="0.5" />
              <circle cx="20" cy="16" r="2" fill="var(--color-primary)" opacity="0.5" />
              <line x1="12" y1="9" x2="12" y2="6" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
              <line x1="12" y1="18" x2="12" y2="15" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
              <line x1="9.5" y1="10.5" x2="6" y2="9" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
              <line x1="14.5" y1="10.5" x2="18" y2="9" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
              <line x1="9.5" y1="13.5" x2="6" y2="15" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
              <line x1="14.5" y1="13.5" x2="18" y2="15" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
          <h2 className="type-headline-md text-on-surface">Juan Team ERP</h2>
          <p className="type-body-md text-on-surface-variant mt-1">
            {isLogin ? 'Sign in to access your workspace' : 'Create an account to join the team'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl type-label-md flex items-start gap-2 animate-fadeIn">
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <Input
                label="Full Name"
                placeholder="e.g. Mira"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <div className="flex flex-col gap-1.5 w-full">
                <span className="type-label-md text-on-surface-variant uppercase tracking-wide">Department</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDepartment('iot')}
                    className={`py-2 px-4 rounded-xl type-label-md transition-all border ${
                      department === 'iot'
                        ? 'border-primary bg-primary-fixed text-primary font-semibold'
                        : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    IoT Department
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepartment('mobile')}
                    className={`py-2 px-4 rounded-xl type-label-md transition-all border ${
                      department === 'mobile'
                        ? 'border-primary bg-primary-fixed text-primary font-semibold'
                        : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    Mobile Department
                  </button>
                </div>
              </div>

              <Input
                label="Role"
                placeholder="e.g. Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2 relative py-3"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M4 12a8 8 0 0 1 8-8" />
                </svg>
                Processing...
              </span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Form Toggle Link */}
        <div className="mt-5 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="type-label-md text-primary hover:underline transition-all"
          >
            {isLogin ? "Don't have an account? Register" : 'Already registered? Sign In'}
          </button>
        </div>
      </Card>
    </div>
  );
}
