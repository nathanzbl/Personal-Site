const API_BASE = '/api/v1'

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = { method }
  if (body !== undefined) {
    opts.headers = { 'Content-Type': 'application/json' }
    opts.body = JSON.stringify(body)
  }
  const token = localStorage.getItem('admin_token')
  if (token) opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` }
  const res = await fetch(`${API_BASE}${path}`, opts)
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProjectResponse {
  id: number
  project_id: string
  title: string
  description: string
  tags: string[]
  year: string
  color: string
  status: 'live' | 'wip' | 'archived'
  link?: string
  sort_order: number
}

export interface SkillResponse {
  id: number
  name: string
  level: number
  category: string
  sort_order: number
}

export interface ExperienceResponse {
  id: number
  year: string
  title: string
  subtitle: string
  description: string
  active: boolean
  sort_order: number
}

export interface AboutResponse {
  id: number
  bio_paragraphs: string[]
  facts: { icon: string; text: string }[]
  headshot_url?: string
  status_text?: string
  info_fields: { label: string; value: string }[]
}

export interface InterestResponse {
  id: number
  icon: string
  label: string
  desc: string
  sort_order: number
}

export interface CourseworkResponse {
  id: number
  name: string
  sort_order: number
}

export interface SocialResponse {
  id: number
  icon: string
  label: string
  handle: string
  href: string
  sort_order: number
}

export interface ContactMetaResponse {
  id: number
  heading: string
  subheading: string
  body_text: string
  location_text: string
}

// ── API client ─────────────────────────────────────────────────────────────

export const api = {
  projects: {
    list: () => request<ProjectResponse[]>('GET', '/projects'),
    create: (data: Omit<ProjectResponse, 'id'>) =>
      request<ProjectResponse>('POST', '/projects', data),
    update: (id: number, data: Partial<Omit<ProjectResponse, 'id'>>) =>
      request<ProjectResponse>('PUT', `/projects/${id}`, data),
    delete: (id: number) => request<void>('DELETE', `/projects/${id}`),
  },

  skills: {
    list: () => request<SkillResponse[]>('GET', '/skills'),
    create: (data: Omit<SkillResponse, 'id'>) =>
      request<SkillResponse>('POST', '/skills', data),
    update: (id: number, data: Partial<Omit<SkillResponse, 'id'>>) =>
      request<SkillResponse>('PUT', `/skills/${id}`, data),
    delete: (id: number) => request<void>('DELETE', `/skills/${id}`),
  },

  experience: {
    list: () => request<ExperienceResponse[]>('GET', '/experience'),
    create: (data: Omit<ExperienceResponse, 'id'>) =>
      request<ExperienceResponse>('POST', '/experience', data),
    update: (id: number, data: Partial<Omit<ExperienceResponse, 'id'>>) =>
      request<ExperienceResponse>('PUT', `/experience/${id}`, data),
    delete: (id: number) => request<void>('DELETE', `/experience/${id}`),
  },

  about: {
    get: () => request<AboutResponse>('GET', '/about'),
    update: (data: Partial<Omit<AboutResponse, 'id'>>) =>
      request<AboutResponse>('PUT', '/about', data),
  },

  interests: {
    list: () => request<InterestResponse[]>('GET', '/about/interests'),
    create: (data: Omit<InterestResponse, 'id'>) =>
      request<InterestResponse>('POST', '/about/interests', data),
    update: (id: number, data: Partial<Omit<InterestResponse, 'id'>>) =>
      request<InterestResponse>('PUT', `/about/interests/${id}`, data),
    delete: (id: number) => request<void>('DELETE', `/about/interests/${id}`),
  },

  coursework: {
    list: () => request<CourseworkResponse[]>('GET', '/about/coursework'),
    create: (data: Omit<CourseworkResponse, 'id'>) =>
      request<CourseworkResponse>('POST', '/about/coursework', data),
    update: (id: number, data: Partial<Omit<CourseworkResponse, 'id'>>) =>
      request<CourseworkResponse>('PUT', `/about/coursework/${id}`, data),
    delete: (id: number) => request<void>('DELETE', `/about/coursework/${id}`),
  },

  contact: {
    get: () => request<ContactMetaResponse>('GET', '/contact'),
    update: (data: Partial<Omit<ContactMetaResponse, 'id'>>) =>
      request<ContactMetaResponse>('PUT', '/contact', data),
  },

  socials: {
    list: () => request<SocialResponse[]>('GET', '/contact/socials'),
    create: (data: Omit<SocialResponse, 'id'>) =>
      request<SocialResponse>('POST', '/contact/socials', data),
    update: (id: number, data: Partial<Omit<SocialResponse, 'id'>>) =>
      request<SocialResponse>('PUT', `/contact/socials/${id}`, data),
    delete: (id: number) => request<void>('DELETE', `/contact/socials/${id}`),
  },

  auth: {
    login: (username: string, password: string) =>
      request<{ access_token: string }>('POST', '/auth/login', { username, password }),
  },
}
