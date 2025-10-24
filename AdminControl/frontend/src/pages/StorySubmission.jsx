import { useState } from 'react';
import { storiesAPI } from '../services/api.jsx';
import {
  Heart,
  User,
  Mail,
  FileText,
  Tag,
} from 'lucide-react';
import { validatePassword } from '../utils/helpers';
import toast from 'react-hot-toast';

const StorySubmission = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    submitterName: '',
    submitterEmail: '',
    category: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    'Recovery Journey',
    'Coping Strategies',
    'Personal Experience',
    'Hope & Healing',
    'Support & Resources',
    'Mental Health Awareness',
    'Therapy Experience',
    'Self-Discovery',
    'Overcoming Challenges',
    'Inspiration',
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.content.length < 50) {
      toast.error('Story content must be at least 50 characters long');
      return;
    }

    if (formData.content.length > 5000) {
      toast.error('Story content cannot exceed 5000 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await storiesAPI.submit(formData);
      setIsSubmitted(true);
      toast.success('Your story has been submitted successfully!');
    } catch (error) {
      console.error('Failed to submit story:', error);
      toast.error('Failed to submit story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Thank You for Sharing
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your story has been submitted and is under review. We'll notify you if it gets published.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    title: '',
                    content: '',
                    submitterName: '',
                    submitterEmail: '',
                    category: '',
                  });
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Another Story
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
            Share Your Story
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your experience can help others on their journey to mental wellness
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Give your story a meaningful title..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Your Story *
              </label>
              <textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Share your experience, insights, or journey. Your story can inspire and help others..."
                required
              />
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>Minimum 50 characters</span>
                <span className={formData.content.length > 5000 ? 'text-red-500' : ''}>
                  {formData.content.length}/5000 characters
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Submitter Name */}
            <div>
              <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="submitterName"
                value={formData.submitterName}
                onChange={(e) => handleChange('submitterName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Leave blank to remain anonymous"
              />
              <p className="mt-1 text-sm text-gray-500">
                If you leave this blank, your story will be published as "Anonymous"
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email (Optional)
              </label>
              <input
                type="email"
                id="submitterEmail"
                value={formData.submitterEmail}
                onChange={(e) => handleChange('submitterEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                We'll only use this to notify you if your story is published. Your email will never be shared publicly.
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Heart className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Privacy & Safety
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your story will be reviewed before publishing</li>
                      <li>We may edit for clarity while preserving your voice</li>
                      <li>Your email is never shared publicly</li>
                      <li>You can request story removal at any time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Share My Story
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By submitting your story, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorySubmission;
