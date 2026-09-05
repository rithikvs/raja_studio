const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = localStorage.getItem('raja_access_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    let response;
    try {
        response = await fetch(`${baseUrl}/api${path}`, { ...options, headers });
    } catch {
        throw new Error('Unable to reach the Raja Studio server. Run npm run dev and try again.');
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || 'Something went wrong. Please try again.');
    return body;
}
