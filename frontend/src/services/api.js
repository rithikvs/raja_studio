const getBaseUrl = () => {
    // If running on localhost or 127.0.0.1, use local backend on port 8787
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:8787';
    }
    return (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(/\/$/, '');
};

export async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = localStorage.getItem('raja_access_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    
    let targetUrl = `${getBaseUrl()}/api${path}`;
    let response;

    try {
        response = await fetch(targetUrl, { ...options, headers });
    } catch (error) {
        console.error('❌ Primary fetch failed for:', targetUrl, error);
        // Fallback retry to local backend if main URL failed
        if (!targetUrl.includes('localhost:8787')) {
            try {
                targetUrl = `http://localhost:8787/api${path}`;
                response = await fetch(targetUrl, { ...options, headers });
            } catch (fallbackErr) {
                console.error('❌ Fallback fetch also failed:', fallbackErr);
                throw new Error('Unable to reach the server. Please check if your backend server is running on port 8787.');
            }
        } else {
            throw new Error('Unable to reach the server. Please check if your backend server is running on port 8787.');
        }
    }
    
    // Try to parse the response as JSON
    let body;
    try {
        body = await response.json();
    } catch (error) {
        console.error('❌ Response parsing error. Status:', response.status, 'URL:', targetUrl);
        
        if (response.status === 401) {
            throw new Error('Invalid email/phone or password.');
        } else if (response.status === 403) {
            throw new Error('Access denied. You do not have permission to perform this action.');
        } else if (response.status === 404) {
            throw new Error('The requested resource was not found.');
        } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
        }
        
        throw new Error('Server returned an invalid response. Please try again.');
    }
    
    if (!response.ok) {
        const errorMessage = body.message || body.error || getStatusMessage(response.status);
        throw new Error(errorMessage);
    }
    
    return body;
}

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
