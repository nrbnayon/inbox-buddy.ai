// lib\api\emails.js

import { axiosInstance } from "../axios";

export const emailApi = {
  // Fetch emails with pagination and filters
  fetchEmails: async (params = {}) => {
    const response = await axiosInstance.get('/emails', { params });
    return response.data;
  },

  // Mark email as read
  markAsRead: async (emailId) => {
    const response = await axiosInstance.patch(`/emails/mark-as-read/${emailId}`);
    return response.data;
  },

  // Send email reply
  sendReply: async (emailId, data) => {
    const formData = new FormData();
    formData.append("message", data.content);
    if (data.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
    const response = await axiosInstance.post(`/emails/reply/${emailId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Move email to trash
  moveToTrash: async (emailId) => {
    const response = await axiosInstance.delete(`/emails/trash/${emailId}`);
    return response.data;
  },

  // Search emails
  searchEmails: async (query) => {
    const response = await axiosInstance.get('/emails/search', {
      params: { q: query }
    });
    return response.data;
  },

  // Fetch important emails
  fetchImportantEmails: async () => {
    const response = await axiosInstance.get('/emails/important');
    return response.data;
  },

  // Create email draft
  createDraft: async (data) => {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
    const response = await axiosInstance.post('/emails/draft', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download attachment
  downloadAttachment: async (emailId, attachmentId) => {
    const response = await axiosInstance.get('/emails/download/attachment', {
      params: { emailId, attachmentId },
      responseType: 'blob'
    });
    return response.data;
  },

  // Summarize email
  summarizeEmail: async (emailId) => {
    const response = await axiosInstance.get(`/emails/summarize/${emailId}`);
    return response.data;
  },
};