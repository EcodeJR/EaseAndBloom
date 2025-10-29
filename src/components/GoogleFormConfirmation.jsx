import { useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { ArrowRight, Key, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const GoogleFormConfirmation = ({ onContinue }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  // The secret code that will be provided in the Google Form
  const VALID_CODE = import.meta.env.VITE_SECRET_CODE;

  const handleCodeChange = (e) => {
    const code = e.target.value.toUpperCase().trim();
    setSecretCode(code);
    setCodeError('');
    
    // Check if code is valid
    if (code === VALID_CODE) {
      setIsCodeValid(true);
      setCodeError('');
    } else if (code.length >= VALID_CODE.length) {
      setIsCodeValid(false);
      setCodeError('Invalid code. Please check and try again.');
    } else {
      setIsCodeValid(false);
    }
  };

  const handleContinue = () => {
    if (!isCodeValid) {
      setCodeError('Please enter the secret code from the Google Form.');
      return;
    }
    
    setIsLoading(true);
    // Simulate loading and then continue to guidelines
    setTimeout(() => {
      onContinue();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6">
          <FaRegHeart className="h-8 w-8 text-pink-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Thank you for joining Ease & Bloom!
        </h1>
        
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Step 1: Complete Registration</h2>
          <p className="text-lg text-gray-700 mb-4">
            First, please fill out our quick registration form to join our community:
          </p>
          <a 
            href="https://forms.gle/yGLbuZ2oGfhc8ve16"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Open Registration Form
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-sm text-gray-600 mt-4 italic">
            💡 After submitting the form, you'll receive a secret code. Copy it and return here to continue.
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Step 2: Enter Secret Code</h2>
          <p className="text-lg text-gray-700 mb-4">
            After completing the form, you'll receive a <strong>secret code</strong>. Enter it below to continue:
          </p>
          
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={secretCode}
              onChange={handleCodeChange}
              placeholder="Enter your secret code"
              className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg text-lg font-mono uppercase tracking-wider focus:outline-none focus:ring-2 transition-all ${
                isCodeValid 
                  ? 'border-green-500 focus:ring-green-500 bg-green-50' 
                  : codeError 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              maxLength={20}
            />
            {isCodeValid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
            {codeError && !isCodeValid && secretCode.length > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          
          {codeError && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {codeError}
            </p>
          )}
          
          {isCodeValid && (
            <p className="text-green-600 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Code verified! You can now continue.
            </p>
          )}
        </div>
        
        <button 
          onClick={handleContinue}
          disabled={!isCodeValid || isLoading}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5">
                <LoadingSpinner size="small" />
              </div>
              Loading...
            </>
          ) : (
            <>
              Continue to Guidelines
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
        
        <p className="text-lg text-gray-600 mt-8 flex items-center justify-center gap-2">
          We can't wait to welcome you!
          <span className="text-blue-500">💙</span>
        </p>
      </div>
    </div>
  );
};

export default GoogleFormConfirmation;
