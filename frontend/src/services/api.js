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
        throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    // Try to parse the response as JSON
    let body;
    try {
        body = await response.json();
    } catch (error) {
        console.error('❌ Response parsing error:', error);
        throw new Error('Server returned an invalid response. Please try again.');
    }
    
    if (!response.ok) {
        const errorMessage = body.message || body.error || 'Something went wrong. Please try again.';
        throw new Error(errorMessage);
    }
    
    return body;
}
