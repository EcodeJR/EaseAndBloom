import { useState, useEffect, useCallback } from 'react';
import { storiesAPI } from '../services/api.jsx';
import {
  Eye,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  Clock,
  User,
  Calendar,
} from 'lucide-react';
import { formatDate, getRelativeTime, getStatusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedStory, setSelectedStory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const statusTabs = [
    { key: 'pending', label: 'Pending Review', count: 0 },
    { key: 'approved', label: 'Approved', count: 0 },
    { key: 'published', label: 'Published', count: 0 },
    { key: 'rejected', label: 'Rejected', count: 0 },
  ];

  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await storiesAPI.getAllAdmin({
        page: currentPage,
        limit: 10,
        status: selectedStatus,
      });
      setStories(response.data.data.stories);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedStatus]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleApprove = async (storyId) => {
    try {
      await storiesAPI.approve(storyId);
      toast.success('Story approved successfully');
      closeModal();
      fetchStories();
    } catch (error) {
      console.error('Failed to approve story:', error);
      toast.error('Failed to approve story');
    }
  };

  const handlePublish = async (storyId) => {
    try {
      await storiesAPI.publish(storyId);
      toast.success('Story published successfully');
      closeModal();
      fetchStories();
    } catch (error) {
      console.error('Failed to publish story:', error);
      toast.error('Failed to publish story');
    }
  };

  const handleReject = async (storyId) => {
    try {
      await storiesAPI.reject(storyId, { rejectionReason });
      toast.success('Story rejected');
      closeModal();
      fetchStories();
    } catch (error) {
      console.error('Failed to reject story:', error);
      toast.error('Failed to reject story');
    }
  };

  const handleDelete = async (storyId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await storiesAPI.delete(storyId);
        toast.success('Story deleted successfully');
        fetchStories();
      } catch (error) {
        console.error('Failed to delete story:', error);
        toast.error('Failed to delete story');
      }
    }
  };

  const openStoryModal = (story) => {
    setSelectedStory(story);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStory(null);
    setRejectionReason('');
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Story Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and moderate anonymous story submissions
        </p>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedStatus === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Stories List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {stories.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {stories.map((story) => (
              <li key={story._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                          {story.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start ${getStatusColor(
                            story.status
                          )}`}
                        >
                          {story.status}
                        </span>
                      </div>
                      
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-1 sm:gap-0">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="truncate">{story.submitterName}</span>
                        </div>
                        <span className="hidden sm:inline mx-2">•</span>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{getRelativeTime(story.createdAt)}</span>
                        </div>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs inline-block">
                          {story.category}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {story.content.substring(0, 150)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end sm:justify-start space-x-3 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => openStoryModal(story)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View full story"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      {story.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openStoryModal(story)}
                            className="text-green-600 hover:text-green-900"
                            title="Review & Approve story"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openStoryModal(story)}
                            className="text-red-600 hover:text-red-900"
                            title="Review & Reject story"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      
                      {story.status === 'approved' && (
                        <button
                          onClick={() => handlePublish(story._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Publish story"
                        >
                          <Clock className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(story._id, story.title)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete story"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No {selectedStatus} stories
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStatus === 'pending' 
                ? 'No stories are waiting for review.'
                : `No ${selectedStatus} stories found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Story Detail Modal */}
      {showModal && selectedStory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full sm:w-full mx-4 sm:mx-0">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Story Review
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedStory.title}
                    </h4>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-0">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{selectedStory.submitterName}</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(selectedStory.createdAt)}</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs inline-block">
                        {selectedStory.category}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Story Content:</h5>
                    <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedStory.content}
                      </p>
                    </div>
                  </div>
                  
                  {selectedStory.status === 'pending' && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (Optional):
                      </h5>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Provide feedback to the submitter..."
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedStory.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedStory._id)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Approve Story
                    </button>
                    <button
                      onClick={() => handleReject(selectedStory._id)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Reject Story
                    </button>
                  </>
                )}
                {selectedStory.status === 'approved' && (
                  <button
                    onClick={() => handlePublish(selectedStory._id)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Publish Story
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
