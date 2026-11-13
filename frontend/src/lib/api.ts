/** Thin client for the Django API. Same-origin in dev via the Vite proxy; set VITE_API_BASE_URL for a split deploy. */
const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {
	constructor(public status: number, message: string) { super(message); }
}

const csrfToken = () => document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] ?? '';

async function call<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
	const res = await fetch(BASE + path, {
		method, credentials: 'include',
		headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken() },
		body: body === undefined ? undefined : JSON.stringify(body)
	});
	if (!res.ok) {
		const detail = await res.json().then((j) => j.detail ?? JSON.stringify(j)).catch(() => res.statusText);
		throw new ApiError(res.status, detail);
	}
	return res.json();
}

export type Me = { username: string | null };

export const api = {
	csrf: () => call<Me>('/auth/csrf/'),
	me: () => call<Me>('/auth/me/'),
	register: (username: string, password: string) => call<Me>('/auth/register/', 'POST', { username, password }),
	login: (username: string, password: string) => call<Me>('/auth/login/', 'POST', { username, password }),
	logout: () => call<Me>('/auth/logout/', 'POST'),
	getSnapshot: <T>() => call<T>('/finance/snapshot/'),
	putSnapshot: <T>(data: T) => call<T>('/finance/snapshot/', 'PUT', data)
};
