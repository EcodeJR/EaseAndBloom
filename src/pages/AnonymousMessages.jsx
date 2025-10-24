import { useState } from 'react';
import { Heart, User, Mail, MessageSquare, Send, Shield, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { storiesAPI } from '../services/api';

const AnonymousMessages = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    submitterName: '',
    submitterEmail: '',
    isAnonymous: true,
    allowPublishing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    'Inspiration'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      submitterName: formData.isAnonymous ? 'Anonymous' : formData.submitterName
    };

    // Only include email if not anonymous and email is provided
    if (!formData.isAnonymous && formData.submitterEmail) {
      submitData.submitterEmail = formData.submitterEmail;
    }

    console.log('Submitting story data:', submitData);

    try {
      const { data } = await storiesAPI.create(submitData);

      if (data.success) {
        toast.success('Your message has been submitted successfully! Thank you for sharing your story.');
        setFormData({
          title: '',
          content: '',
          category: '',
          submitterName: '',
          submitterEmail: '',
          isAnonymous: true,
          allowPublishing: false
        });
      } else {
        console.error('Story submission error:', data);
        if (data.errors && data.errors.length > 0) {
          const errorMessages = data.errors.map(error => `${error.path}: ${error.msg}`).join(', ');
          toast.error(`Validation errors: ${errorMessages}`);
        } else {
          toast.error(data.message || 'Failed to submit message. Please try again.');
        }
      }
    } catch (error) {
      console.error('Message submission error:', error);
      toast.error('Something went wrong. Message should have more than 50 characters. Please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section with Background */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-pink-900/80">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Share Your Story
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your voice matters. Share your mental health journey, experiences, or words of encouragement with our community.
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.02] transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Story Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Give your story a meaningful title"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Your Story *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Share your story, experience, or message of hope... Min 50 - Max 500 characters"
              />
            </div>

            {/* Anonymous Option */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isAnonymous" className="ml-2 text-sm font-medium text-gray-700">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Submit anonymously
                </label>
              </div>
              <p className="text-sm text-gray-600">
                If you choose to submit anonymously, your name and email will not be stored or displayed.
              </p>
            </div>

            {/* Name and Email (only if not anonymous) */}
            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="submitterName"
                    name="submitterName"
                    value={formData.submitterName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="submitterEmail"
                    name="submitterEmail"
                    value={formData.submitterEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            {/* Publishing Permission */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="allowPublishing"
                  name="allowPublishing"
                  checked={formData.allowPublishing}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="allowPublishing" className="ml-2 text-sm font-medium text-gray-700">
                  <Eye className="inline h-4 w-4 mr-1" />
                  Allow us to publish your story
                </label>
              </div>
              <p className="text-sm text-gray-600">
                By checking this box, you give us permission to review and potentially publish your story on our platform to help others. We will always respect your privacy and may edit for clarity while preserving your message.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Share Your Story
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                <Shield className="inline h-4 w-4 mr-1" />
                Your privacy and safety are our top priorities. All submissions are reviewed before publishing.
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AnonymousMessages;
