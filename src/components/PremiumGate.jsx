import React from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthProvider';

// Premium gate wrapper - shows upgrade prompt for free users
const PremiumGate = ({ 
  children, 
  feature = 'this feature',
  showPreview = true,
  className = ''
}) => {
  const { isPremium, user } = useAuth();

  // If user is premium or not logged in (demo mode), show content
  if (isPremium || !user) {
    return children;
  }

  // Free user - show upgrade prompt
  return (
    <div className={`relative ${className}`}>
      {showPreview && (
        <div className="opacity-30 pointer-events-none blur-[2px]">
          {children}
        </div>
      )}
      <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center`}>
        <div className="text-center p-8 bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-amber-500/30 max-w-md mx-4">
          <div className="inline-flex p-4 bg-amber-500/10 rounded-xl mb-4">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Premium Feature</h3>
          <p className="text-sm text-slate-400 mb-6">
            Upgrade to Premium to unlock {feature} and other powerful AI tools.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard?upgrade=true'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold rounded-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to Premium
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-500 mt-4">Only $19/month • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
};

// Premium badge component
export const PremiumBadge = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded ${className}`}>
    <Sparkles className="w-3 h-3" />
    PREMIUM
  </span>
);

// Lock icon for premium features in free mode
export const PremiumLock = ({ className = '' }) => {
  const { isPremium, user } = useAuth();
  
  if (isPremium || !user) return null;
  
  return (
    <Lock className={`w-4 h-4 text-amber-500 ${className}`} />
  );
};

// Hook to check feature limits
export const useFeatureLimits = () => {
  const { isPremium, user } = useAuth();

  return {
    maxConditions: isPremium || !user ? Infinity : 3,
    maxMedicalEntries: isPremium || !user ? Infinity : 5,
    canUseAI: isPremium || !user,
    canExportPDF: isPremium || !user,
    canExportData: isPremium || !user,
    isPremium: isPremium || !user
  };
};

export default PremiumGate;

