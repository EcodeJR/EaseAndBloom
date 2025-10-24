import { useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { ArrowRight } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const GoogleFormConfirmation = ({ onContinue }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
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
            href="https://forms.gle/JuyrDjNapxkXxBir6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Open Registration Form
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Step 2: Read Guidelines</h2>
          <p className="text-lg text-gray-700 mb-4">
            After completing the form, please read our Community Guidelines before joining the group.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Click below to continue:
          </p>
        </div>
        
        <button 
          onClick={handleContinue}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
