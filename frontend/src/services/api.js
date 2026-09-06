const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = localStorage.getItem('raja_access_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    
    let response;
    try {
        response = await fetch(`${baseUrl}/api${path}`, { ...options, headers });
    } catch (error) {
        console.error('❌ Network error:', error);
        // Network failure - unable to reach server
        throw new Error('Unable to reach the server. Please check your internet connection and try again.');
    }
    
    // Try to parse the response as JSON
    let body;
    try {
        body = await response.json();
    } catch (error) {
        console.error('❌ Response parsing error. Status:', response.status, 'URL:', `${baseUrl}/api${path}`);
        
        // Specific error messages based on HTTP status
        if (response.status === 401) {
            throw new Error('Invalid email/phone or password.');
        } else if (response.status === 403) {
            throw new Error('Access denied. You do not have permission to perform this action.');
        } else if (response.status === 404) {
            throw new Error('The requested resource was not found.');
        } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
        } else if (response.status === 0) {
            // Status 0 typically indicates CORS or network issues
            throw new Error('Unable to connect to server. Please check your internet connection.');
        }
        
        throw new Error('Server returned an invalid response. Please try again.');
    }
    
    if (!response.ok) {
        // Use server's error message if available, otherwise use status-specific messages
        const errorMessage = body.message || body.error || getStatusMessage(response.status);
        throw new Error(errorMessage);
    }
    
    return body;
}

// Helper function to get status-specific error messages
function getStatusMessage(status) {
    switch (status) {
        case 400:
            return 'Invalid request. Please check your input and try again.';
        case 401:
            return 'Invalid email/phone or password.';
        case 403:
            return 'Access denied. You do not have permission to perform this action.';
        case 404:
            return 'The requested resource was not found.';
        case 409:
            return 'This resource already exists.';
        case 413:
            return 'The file is too large. Please use a smaller file.';
        case 429:
            return 'Too many requests. Please wait a moment and try again.';
        case 500:
            return 'Server error. Please try again later.';
        case 502:
        case 503:
        case 504:
            return 'Server is temporarily unavailable. Please try again in a moment.';
        default:
            return 'Something went wrong. Please try again.';
    }
}
