import { useState, useEffect } from 'react';
import { waitlistAPI } from '../services/api.jsx';
import toast from 'react-hot-toast';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  UserPlus,
  Mail,
  CheckCircle,
  Clock,
  Download,
  Search,
  Filter,
  Trash2,
  Send,
} from 'lucide-react';
import { formatDate, getRelativeTime } from '../utils/helpers';

const WaitlistManagement = () => {
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: '',
    htmlContent: '',
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    fetchWaitlistData();
    fetchWaitlistStats();
  }, [currentPage, filterStatus, searchQuery]);

  const fetchWaitlistData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc',
      });
      if (filterStatus) params.append('status', filterStatus);
      if (searchQuery) params.append('search', searchQuery);

      const response = await waitlistAPI.getAll(params.toString());
      setWaitlistEntries(response.data.data.docs);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch waitlist entries:', error);
      toast.error('Failed to load waitlist entries.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWaitlistStats = async () => {
    try {
      const response = await waitlistAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch waitlist stats:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEntries(waitlistEntries.map((entry) => entry._id));
    } else {
      setSelectedEntries([]);
    }
  };

  const handleSelectEntry = (id) => {
    setSelectedEntries((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    );
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this waitlist entry?')) return;
    try {
      await waitlistAPI.deleteEntry(id);
      toast.success('Waitlist entry deleted successfully.');
      fetchWaitlistData();
      fetchWaitlistStats();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast.error(error.response?.data?.message || 'Failed to delete entry.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await waitlistAPI.updateStatus(id, { status });
      toast.success(`Entry status updated to ${status}.`);
      fetchWaitlistData();
      fetchWaitlistStats();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleEmailFormChange = (e) => {
    setEmailForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendEmails = async (e) => {
    e.preventDefault();
    if (selectedEntries.length === 0) {
      toast.error('Please select at least one recipient.');
      return;
    }
    setIsSendingEmail(true);
    try {
      await waitlistAPI.sendNotification({
        recipients: selectedEntries,
        subject: emailForm.subject,
        htmlContent: emailForm.htmlContent,
      });
      toast.success(`Emails sent to ${selectedEntries.length} recipients.`);
      setIsEmailModalOpen(false);
      setEmailForm({ subject: '', htmlContent: '' });
      setSelectedEntries([]);
      fetchWaitlistData();
      fetchWaitlistStats();
    } catch (error) {
      console.error('Failed to send emails:', error);
      toast.error(error.response?.data?.message || 'Failed to send emails.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleExportCSV = () => {
    if (waitlistEntries.length === 0) {
      toast.error('No data to export.');
      return;
    }

    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Status',
      'Joined At',
      'Notified At',
      'Converted At',
    ];
    const rows = waitlistEntries.map((entry) => [
      entry.firstName,
      entry.lastName,
      entry.email,
      entry.status,
      formatDate(entry.createdAt),
      entry.notifiedAt ? formatDate(entry.notifiedAt) : '',
      entry.convertedAt ? formatDate(entry.convertedAt) : '',
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    rows.forEach((rowArray) => {
      let row = rowArray.join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'waitlist_entries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Waitlist data exported successfully!');
  };

  if (isLoading && !waitlistEntries.length && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waitlist Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your waitlist subscribers and send notifications.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            disabled={selectedEntries.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email ({selectedEntries.length})
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Total Subscribers', value: stats.total, icon: UserPlus, color: 'bg-indigo-500' },
            { name: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
            { name: 'Notified', value: stats.notified, icon: Mail, color: 'bg-blue-500' },
            { name: 'Converted', value: stats.converted, icon: CheckCircle, color: 'bg-green-500' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${stat.color} p-3 rounded-md`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="notified">Notified</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    onChange={handleSelectAll}
                    checked={selectedEntries.length === waitlistEntries.length && waitlistEntries.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {waitlistEntries.length > 0 ? (
                waitlistEntries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={selectedEntries.includes(entry._id)}
                        onChange={() => handleSelectEntry(entry._id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.firstName} {entry.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : entry.status === 'notified'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(entry.createdAt)} ({getRelativeTime(entry.createdAt)})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(entry._id, 'notified')}
                          disabled={entry.status === 'notified' || entry.status === 'converted'}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mark as Notified"
                        >
                          <Mail className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(entry._id, 'converted')}
                          disabled={entry.status === 'converted'}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mark as Converted"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Entry"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No waitlist entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Send Email to Selected Subscribers</h3>
            <form onSubmit={handleSendEmails} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={emailForm.subject}
                  onChange={handleEmailFormChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Use placeholders like: {'{{firstName}}'}, {'{{lastName}}'}, {'{{fullName}}'}, {'{{email}}'}
                </p>
                <div className="border border-gray-300 rounded-md bg-white" style={{ minHeight: '400px' }}>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={(newState) => {
                      setEditorState(newState);
                      const html = draftToHtml(convertToRaw(newState.getCurrentContent()));
                      setEmailForm({ ...emailForm, htmlContent: html });
                    }}
                    toolbar={{
                      options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
                      inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough'],
                      },
                      blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                      },
                      fontSize: {
                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                      },
                      fontFamily: {
                        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                      },
                      list: {
                        options: ['unordered', 'ordered'],
                      },
                      textAlign: {
                        options: ['left', 'center', 'right', 'justify'],
                      },
                      colorPicker: {
                        colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                          'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                          'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                          'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                          'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                          'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
                      },
                    }}
                    editorStyle={{
                      minHeight: '300px',
                      padding: '10px',
                      backgroundColor: 'white',
                    }}
                    placeholder="Write your email content here..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingEmail ? 'Sending...' : 'Send Emails'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistManagement;
