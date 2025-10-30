import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Removed ReactQuill due to React 19 compatibility issues
import { blogsAPI, uploadAPI } from '../services/api.jsx';
import { generateSlug } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Eye,
  Save,
  Upload,
} from 'lucide-react';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    categories: [],
    tags: [],
    metaDescription: '',
    metaKeywords: [],
    status: 'draft',
    featuredImage: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const categories = [
    'Mental Health',
    'Self-Care',
    'Therapy',
    'Mindfulness',
    'Wellness',
    'Personal Growth',
    'Recovery',
    'Coping Strategies',
    'Support',
    'Resources',
  ];

  // Rich text editor configuration (simplified for React 19 compatibility)

  const fetchBlog = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await blogsAPI.getById(id);
      const blog = response.data.data.blog;
      
      setFormData({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        categories: blog.categories,
        tags: blog.tags,
        metaDescription: blog.metaDescription || '',
        metaKeywords: blog.metaKeywords || [],
        status: blog.status,
        featuredImage: blog.featuredImage,
      });
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      toast.error('Failed to load blog');
      navigate('/admin/blogs');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id, isEdit, fetchBlog]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeywordAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newKeyword = e.target.value.trim();
      if (!formData.metaKeywords.includes(newKeyword)) {
        setFormData(prev => ({
          ...prev,
          metaKeywords: [...prev.metaKeywords, newKeyword]
        }));
      }
      e.target.value = '';
    }
  };

  const handleKeywordRemove = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      try {
        setIsUploadingImage(true);
        
        // Convert to base64
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            // Upload to Cloudinary via backend
            const response = await uploadAPI.uploadImage({
              image: event.target.result,
              folder: 'easeandbloom/blogs'
            });

            // Set the Cloudinary image data
            setFormData(prev => ({
              ...prev,
              featuredImage: response.data.data.image
            }));
            
            toast.success('Image uploaded successfully');
          } catch (error) {
            console.error('Image upload failed:', error);
            toast.error('Failed to upload image. Please try again.');
          } finally {
            setIsUploadingImage(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to read image file');
        setIsUploadingImage(false);
      }
    }
  };

  const handleSave = async (status = 'draft') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    if (formData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    if (!formData.featuredImage) {
      toast.error('Please upload a featured image');
      return;
    }

    if (isUploadingImage) {
      toast.error('Please wait for image upload to complete');
      return;
    }

    try {
      setIsSaving(true);
      
      const blogData = {
        ...formData,
        status,
        slug: generateSlug(formData.title),
      };

      if (isEdit) {
        await blogsAPI.update(id, blogData);
        toast.success('Blog updated successfully');
      } else {
        await blogsAPI.create(blogData);
        toast.success('Blog created successfully');
      }

      navigate('/admin/blogs');
    } catch (error) {
      console.error('Failed to save blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/blogs')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEdit ? 'Update your blog post' : 'Write and publish a new blog post'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          
          <button
            onClick={() => {
              if (isEdit) {
                window.open(`/blog/${formData.slug}`, '_blank');
              } else {
                toast.error('Please save the blog first to preview it live');
              }
            }}
            className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
            title={isEdit ? 'Open live blog in new tab' : 'Save blog first to preview live'}
          >
            <Eye className="h-4 w-4 mr-2" />
            Live Preview
          </button>
          
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter blog post title..."
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[400px] resize-vertical"
              placeholder="Write your blog content here..."
              rows={20}
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="featured-image"
                disabled={isUploadingImage}
              />
              <label
                htmlFor="featured-image"
                className={`cursor-pointer flex flex-col items-center justify-center ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploadingImage ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Uploading image...</p>
                  </div>
                ) : formData.featuredImage ? (
                  <div className="space-y-2">
                    <img
                      src={formData.featuredImage.url}
                      alt="Featured"
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload featured image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    <p className="text-xs text-gray-400 mt-1">Image will be uploaded to Cloudinary</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Author name"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories *
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              onKeyDown={handleTagAdd}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add tags (press Enter)"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description for search engines..."
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                onKeyDown={handleKeywordAdd}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add keywords (press Enter)"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.metaKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {keyword}
                    <button
                      onClick={() => handleKeywordRemove(keyword)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowPreviewModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              {/* Modal header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Blog Preview
                  </h3>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 max-h-[80vh] overflow-y-auto">
                {/* Frontend-style Blog Preview */}
                <article className="max-w-4xl mx-auto">
                  {/* Header */}
                  <header className="mb-8">
                    {formData.featuredImage?.url && (
                      <div className="mb-6">
                        <img
                          src={formData.featuredImage.url}
                          alt={formData.title}
                          className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {formData.title || 'Blog Title'}
                    </h1>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span>By {formData.author || 'Author'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                      {formData.categories.length > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{formData.categories.join(', ')}</span>
                        </>
                      )}
                    </div>
                    {formData.metaDescription && (
                      <p className="text-lg text-gray-600 italic border-l-4 border-indigo-500 pl-4">
                        {formData.metaDescription}
                      </p>
                    )}
                  </header>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="whitespace-pre-wrap leading-relaxed"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {formData.content || 'Start writing your blog content...'}
                    </div>
                  </div>

                  {/* Tags */}
                  {formData.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Keywords */}
                  {formData.metaKeywords.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        <strong>Keywords:</strong> {formData.metaKeywords.join(', ')}
                      </p>
                    </div>
                  )}
                </article>
              </div>

              {/* Modal footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                {isEdit && (
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      window.open(`/blog/${formData.slug}`, '_blank');
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Open Live Blog
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
