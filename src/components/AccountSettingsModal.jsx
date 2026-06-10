import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input } from './ui';
import { authService } from '../services/db';

export default function AccountSettingsModal({ isOpen, onClose, currentUser, onUpdate }) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security'
  const [name, setName] = useState(currentUser?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Convert uploaded image file to base64
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(name.trim(), avatarUrl);
      onUpdate(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.updatePassword(password);
      setSuccess('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <Card variant="extruded-lg" className="border border-outline-variant/60 shadow-2xl bg-surface p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
            <h3 className="type-headline-sm text-on-surface">Account Settings</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant"
              aria-label="Close settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl type-label-md flex items-start gap-2 animate-fadeIn">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl type-label-md flex items-start gap-2 animate-fadeIn">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              <span>{success}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="neu-inset-sm flex p-1 gap-1 items-center mt-5 mb-5 relative shrink-0">
            <button
              onClick={() => {
                setActiveTab('general');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 relative py-2 rounded-lg type-label-md transition-colors text-center ${
                activeTab === 'general' ? 'text-white font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low/50'
              }`}
            >
              {activeTab === 'general' && (
                <motion.div layoutId="activeSettingsTab" className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm" />
              )}
              General
            </button>
            <button
              onClick={() => {
                setActiveTab('security');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 relative py-2 rounded-lg type-label-md transition-colors text-center ${
                activeTab === 'security' ? 'text-white font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low/50'
              }`}
            >
              {activeTab === 'security' && (
                <motion.div layoutId="activeSettingsTab" className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm" />
              )}
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-[260px]">
            <AnimatePresence mode="wait">
              {activeTab === 'general' ? (
                <motion.form
                  key="general"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSaveProfile}
                  className="space-y-5"
                >
                  {/* Profile Picture Uploader */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary font-bold text-headline-sm flex items-center justify-center shadow-inner overflow-hidden border border-outline-variant">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          name ? name[0].toUpperCase() : 'U'
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col items-center sm:items-start">
                      <span className="type-label-md text-on-surface-variant uppercase tracking-wider block">Profile Picture</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={triggerFileSelect}>
                          Upload Image
                        </Button>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <Input
                    label="Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Juan"
                    required
                  />

                  <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSavePassword}
                  className="space-y-4"
                >
                  <Input
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />

                  <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Updating...' : 'Change Password'}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
