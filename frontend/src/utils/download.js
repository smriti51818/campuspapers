import api from './api';

/**
 * Forces a browser download for a given URL.
 * Handles Cloudinary URLs specifically to use their 'attachment' transformation.
 * 
 * @param {string} url - The URL of the file to download
 * @param {string} filename - The preferred filename for the download
 * @param {string} paperId - Optional paper ID to increment download count
 */
export const downloadFile = async (url, filename, paperId) => {
    if (!url) return;

    // Track download on backend if paperId is provided
    if (paperId) {
        console.log(`📡 Tracking download for paper: ${paperId} to ${import.meta.env.VITE_API_BASE}`);
        try {
            const res = await api.post(`/api/papers/${paperId}/download`);
            console.log('✅ Download logged successfully. New count:', res.data.downloads);
        } catch (err) {
            console.error('❌ Failed to log download:', err.response?.data || err.message);
        }
    }

    try {
        // Optimization for Cloudinary URLs:
        // Adding 'fl_attachment' transformation forces the Content-Disposition header.
        if (url.includes('cloudinary.com') && url.includes('/upload/')) {
            // Handle both cases: with or without version/public_id
            const downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename || 'download.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        // Generic fallback: Fetch and Blob
        // Forces download by creating a local blob URL.
        // Note: requires CORS permission from the source server.
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'download.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
        console.warn('Advanced download failed, falling back to basic link:', error);
        // Final fallback: try standard anchor behavior
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = filename || 'download.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
