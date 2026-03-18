import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Briefcase,
  User,
  AtSign,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  Save,
  Eye,
  X,
  Check,
  Pencil,
  ExternalLink,
  BookOpen,
  Loader2,
  LogOut,
} from 'lucide-react'
import {
  api,
  type ProjectResponse,
  type SkillResponse,
  type ExperienceResponse,
  type AboutResponse,
  type InterestResponse,
  type CourseworkResponse,
  type SocialResponse,
  type ContactMetaResponse,
} from '../lib/api'

/* ═══════════════════════════════════════════════
   SIDEBAR NAV CONFIG
   ═══════════════════════════════════════════════ */

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: BarChart3 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'about', label: 'About', icon: User },
  { id: 'coursework', label: 'Coursework', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: AtSign },
]

/* ═══════════════════════════════════════════════
   REUSABLE PIECES
   ═══════════════════════════════════════════════ */

function AdminInput({ label, value, onChange, type = 'text', mono = false, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] text-steel mb-1.5 tracking-wider uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 bg-white border border-mist rounded-lg text-sm text-ink placeholder-silver focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/10 transition-all ${mono ? 'font-mono text-xs' : ''}`}
      />
    </div>
  )
}

function AdminTextarea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] text-steel mb-1.5 tracking-wider uppercase">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3.5 py-2.5 bg-white border border-mist rounded-lg text-sm text-ink placeholder-silver focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/10 transition-all resize-none"
      />
    </div>
  )
}

function AdminSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] text-steel mb-1.5 tracking-wider uppercase">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-3.5 py-2.5 bg-white border border-mist rounded-lg text-sm text-ink focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/10 transition-all pr-10"
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-steel pointer-events-none" />
      </div>
    </div>
  )
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim()
    if (t && !tags.includes(t)) { onChange([...tags, t]); setInput('') }
  }
  return (
    <div>
      <label className="block font-mono text-[11px] text-steel mb-1.5 tracking-wider uppercase">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full bg-blue-wash text-blue">
            {tag}
            <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-ember transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Add tag…"
          className="flex-1 px-3 py-2 bg-white border border-mist rounded-lg text-sm text-ink placeholder-silver focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/10 transition-all font-mono text-xs"
        />
        <button onClick={add} className="px-3 py-2 bg-cloud text-steel rounded-lg hover:bg-blue-wash hover:text-blue transition-all text-xs font-mono">
          Add
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    live: 'bg-teal/10 text-teal',
    wip: 'bg-blue/10 text-blue',
    archived: 'bg-silver/30 text-steel',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${colors[status] || colors.archived}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-teal' : status === 'wip' ? 'bg-blue' : 'bg-silver'}`} />
      {status}
    </span>
  )
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-snow border border-mist rounded-xl p-6 ${className}`}>
      {children}
    </div>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-ink text-white rounded-xl shadow-xl shadow-ink/20"
    >
      <Check size={16} className="text-teal" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-steel hover:text-white transition-colors ml-2"><X size={14} /></button>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════════ */

export default function Admin() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  // ── Data state ──────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [skills, setSkills] = useState<SkillResponse[]>([])
  const [experience, setExperience] = useState<ExperienceResponse[]>([])
  const [about, setAbout] = useState<AboutResponse | null>(null)
  const [interests, setInterests] = useState<InterestResponse[]>([])
  const [coursework, setCoursework] = useState<CourseworkResponse[]>([])
  const [socials, setSocials] = useState<SocialResponse[]>([])
  const [contactMeta, setContactMeta] = useState<ContactMetaResponse | null>(null)

  // ── Local bio state (derived from about.bio_paragraphs) ─────────────────
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [hobbies, setHobbies] = useState('')

  // ── UI state ─────────────────────────────────────────────────────────────
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [editingExp, setEditingExp] = useState<number | null>(null)
  const [editingSocial, setEditingSocial] = useState<number | null>(null)
  const [newCourseName, setNewCourseName] = useState('')
  const [addingCourse, setAddingCourse] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const showError = (msg: string) => showToast(`Error: ${msg}`)

  // ── Initial data load ────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }

    Promise.all([
      api.projects.list(),
      api.skills.list(),
      api.experience.list(),
      api.about.get(),
      api.interests.list(),
      api.coursework.list(),
      api.contact.get(),
      api.socials.list(),
    ]).then(([p, sk, ex, ab, intr, cw, cm, so]) => {
      setProjects(p)
      setSkills(sk)
      setExperience(ex)
      setAbout(ab)
      setHeadline(ab.bio_paragraphs[0] ?? '')
      setBio(ab.bio_paragraphs[1] ?? '')
      setHobbies(ab.bio_paragraphs[2] ?? '')
      setInterests(intr)
      setCoursework(cw)
      setContactMeta(cm)
      setSocials(so)
    }).catch(err => {
      if ((err as Error).message.includes('401')) { navigate('/admin/login'); return }
      showError((err as Error).message)
    }).finally(() => setIsLoading(false))
  }, [navigate])

  /* ── Projects ── */

  const updateProjectLocal = (id: number, field: string, value: unknown) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const saveProject = async (project: ProjectResponse) => {
    try {
      const updated = await api.projects.update(project.id, project)
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
      setEditingProject(null)
      showToast('Project updated')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const addProject = async () => {
    try {
      const created = await api.projects.create({
        project_id: `project-${Date.now()}`,
        title: 'New Project',
        description: '',
        tags: [],
        year: '2026',
        color: '#3b6cf5',
        status: 'wip',
        link: '',
        sort_order: projects.length,
      })
      setProjects(prev => [created, ...prev])
      setEditingProject(created.id)
      showToast('Project created')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const deleteProject = async (id: number) => {
    try {
      await api.projects.delete(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      if (editingProject === id) setEditingProject(null)
      showToast('Project deleted')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── Skills ── */

  const updateSkillLocal = (id: number, field: string, value: unknown) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const saveAllSkills = async () => {
    try {
      await Promise.all(skills.map(s => api.skills.update(s.id, s)))
      showToast('Skills saved')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const addSkill = async () => {
    try {
      const created = await api.skills.create({ name: 'New Skill', level: 50, category: 'Lang', sort_order: skills.length })
      setSkills(prev => [...prev, created])
      showToast('Skill added')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const deleteSkill = async (id: number) => {
    try {
      await api.skills.delete(id)
      setSkills(prev => prev.filter(s => s.id !== id))
      showToast('Skill removed')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── Experience ── */

  const updateExpLocal = (id: number, field: string, value: unknown) => {
    setExperience(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const saveExp = async (exp: ExperienceResponse) => {
    try {
      const updated = await api.experience.update(exp.id, exp)
      setExperience(prev => prev.map(e => e.id === updated.id ? updated : e))
      setEditingExp(null)
      showToast('Experience updated')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const addExp = async () => {
    try {
      const created = await api.experience.create({
        year: '2026 — Present',
        title: 'New Position',
        subtitle: 'Company',
        description: '',
        active: false,
        sort_order: experience.length,
      })
      setExperience(prev => [...prev, created])
      setEditingExp(created.id)
      showToast('Experience added')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const deleteExp = async (id: number) => {
    try {
      await api.experience.delete(id)
      setExperience(prev => prev.filter(e => e.id !== id))
      if (editingExp === id) setEditingExp(null)
      showToast('Experience removed')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── About bio ── */

  const saveAbout = async () => {
    if (!about) return
    try {
      const updated = await api.about.update({ bio_paragraphs: [headline, bio, hobbies] })
      setAbout(updated)
      showToast('Bio saved')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── Interests ── */

  const updateInterestLocal = (id: number, field: string, value: string) => {
    setInterests(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const saveInterest = async (item: InterestResponse) => {
    try {
      const updated = await api.interests.update(item.id, item)
      setInterests(prev => prev.map(i => i.id === updated.id ? updated : i))
      showToast('Interest saved')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const addInterest = async () => {
    try {
      const created = await api.interests.create({
        icon: '',
        label: 'New Interest',
        desc: 'Description here',
        sort_order: interests.length,
      })
      setInterests(prev => [...prev, created])
      showToast('Interest added')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const deleteInterest = async (id: number) => {
    try {
      await api.interests.delete(id)
      setInterests(prev => prev.filter(i => i.id !== id))
      showToast('Interest removed')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── Coursework ── */

  const addCourse = async () => {
    const name = newCourseName.trim()
    if (!name) return
    try {
      const created = await api.coursework.create({ name, sort_order: coursework.length })
      setCoursework(prev => [...prev, created])
      setNewCourseName('')
      setAddingCourse(false)
      showToast('Course added')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const deleteCourse = async (id: number) => {
    try {
      await api.coursework.delete(id)
      setCoursework(prev => prev.filter(c => c.id !== id))
      showToast('Course removed')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── Socials ── */

  const updateSocialLocal = (id: number, field: string, value: string) => {
    setSocials(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const saveSocial = async (social: SocialResponse) => {
    try {
      const updated = await api.socials.update(social.id, social)
      setSocials(prev => prev.map(s => s.id === updated.id ? updated : s))
      setEditingSocial(null)
      showToast('Social link updated')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const addSocial = async () => {
    try {
      const created = await api.socials.create({
        icon: 'Link',
        label: 'New Link',
        handle: '@handle',
        href: 'https://',
        sort_order: socials.length,
      })
      setSocials(prev => [...prev, created])
      setEditingSocial(created.id)
      showToast('Social link added')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  const deleteSocial = async (id: number) => {
    try {
      await api.socials.delete(id)
      setSocials(prev => prev.filter(s => s.id !== id))
      if (editingSocial === id) setEditingSocial(null)
      showToast('Social link deleted')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── Contact meta ── */

  const saveContactMeta = async () => {
    if (!contactMeta) return
    try {
      const updated = await api.contact.update(contactMeta)
      setContactMeta(updated)
      showToast('Contact info saved')
    } catch (err) {
      showError((err as Error).message)
    }
  }

  /* ── Loading screen ── */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-steel">
          <Loader2 size={32} className="animate-spin text-blue" />
          <span className="font-mono text-sm tracking-wider">Loading admin panel…</span>
        </div>
      </div>
    )
  }

  /* ── Section renderers ── */

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-sans font-semibold text-ink mb-1">Dashboard</h2>
        <p className="text-steel text-sm">Manage your portfolio content. All changes persist to the database.</p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Projects', count: projects.length, live: projects.filter(p => p.status === 'live').length, color: 'blue' },
          { label: 'Skills', count: skills.length, live: null, color: 'violet' },
          { label: 'Experience', count: experience.length, live: experience.filter(e => e.active).length, color: 'teal' },
          { label: 'Courses', count: coursework.length, live: null, color: 'ember' },
        ].map(card => (
          <SectionCard key={card.label}>
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-[11px] text-steel tracking-wider uppercase">{card.label}</span>
              <span className={`w-2 h-2 rounded-full bg-${card.color} mt-1`} />
            </div>
            <p className="text-3xl font-sans font-bold text-ink">{card.count}</p>
            {card.live !== null && (
              <p className="text-xs text-steel mt-1 font-mono">{card.live} active</p>
            )}
          </SectionCard>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SectionCard>
          <h3 className="font-sans font-semibold text-ink mb-4 flex items-center gap-2">
            <FolderKanban size={16} className="text-blue" /> Recent Projects
          </h3>
          <div className="space-y-3">
            {projects.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-mist">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <span className="text-sm text-ink font-medium">{p.title}</span>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <h3 className="font-sans font-semibold text-ink mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue" /> Top Skills
          </h3>
          <div className="space-y-3">
            {skills.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-sm text-ink flex-1">{s.name}</span>
                <div className="w-32 h-2 bg-cloud rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-dim to-blue-light" style={{ width: `${s.level}%` }} />
                </div>
                <span className="font-mono text-[11px] text-steel w-8 text-right">{s.level}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )

  const renderProjects = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-ink mb-1">Projects</h2>
          <p className="text-steel text-sm">{projects.length} total — {projects.filter(p => p.status === 'live').length} live, {projects.filter(p => p.status === 'wip').length} WIP</p>
        </div>
        <button onClick={addProject} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors shadow-sm">
          <Plus size={14} /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map(project => (
          <SectionCard key={project.id} className="!p-0 overflow-hidden">
            <div
              className="flex items-center gap-4 p-5 cursor-pointer hover:bg-cloud/50 transition-colors"
              onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
            >
              <GripVertical size={14} className="text-silver" />
              <div className="w-4 h-4 rounded-md border border-mist" style={{ background: project.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-ink truncate">{project.title}</span>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-steel truncate mt-0.5">{project.description}</p>
              </div>
              <span className="font-mono text-xs text-silver shrink-0">{project.year}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 text-steel hover:text-blue transition-colors">
                    <ExternalLink size={13} />
                  </a>
                )}
                <button onClick={e => { e.stopPropagation(); setEditingProject(editingProject === project.id ? null : project.id) }} className="p-1.5 text-steel hover:text-blue transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={e => { e.stopPropagation(); deleteProject(project.id) }} className="p-1.5 text-steel hover:text-ember transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingProject === project.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-mist p-6 bg-white space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <AdminInput label="Title" value={project.title} onChange={v => updateProjectLocal(project.id, 'title', v)} />
                      <AdminInput label="Year" value={project.year} onChange={v => updateProjectLocal(project.id, 'year', v)} mono />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <AdminInput label="Slug (project_id)" value={project.project_id} onChange={v => updateProjectLocal(project.id, 'project_id', v)} mono placeholder="my-project-slug" />
                      <AdminInput label="Link URL" value={project.link || ''} onChange={v => updateProjectLocal(project.id, 'link', v)} mono placeholder="https://…" />
                    </div>
                    <AdminTextarea label="Description" value={project.description} onChange={v => updateProjectLocal(project.id, 'description', v)} />
                    <div className="grid grid-cols-2 gap-5">
                      <AdminSelect
                        label="Status"
                        value={project.status}
                        onChange={v => updateProjectLocal(project.id, 'status', v)}
                        options={[
                          { value: 'live', label: 'Live' },
                          { value: 'wip', label: 'WIP' },
                          { value: 'archived', label: 'Archived' },
                        ]}
                      />
                      <div>
                        <label className="block font-mono text-[11px] text-steel mb-1.5 tracking-wider uppercase">Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={project.color}
                            onChange={e => updateProjectLocal(project.id, 'color', e.target.value)}
                            className="w-10 h-10 rounded-lg border border-mist cursor-pointer"
                          />
                          <input
                            value={project.color}
                            onChange={e => updateProjectLocal(project.id, 'color', e.target.value)}
                            className="flex-1 px-3 py-2.5 bg-white border border-mist rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <TagEditor tags={project.tags} onChange={tags => updateProjectLocal(project.id, 'tags', tags)} />
                    <div className="flex justify-end pt-2">
                      <button onClick={() => saveProject(project)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors">
                        <Save size={13} /> Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        ))}
      </div>
    </motion.div>
  )

  const renderSkills = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-ink mb-1">Skills</h2>
          <p className="text-steel text-sm">{skills.length} skills across {new Set(skills.map(s => s.category)).size} categories</p>
        </div>
        <button onClick={addSkill} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors shadow-sm">
          <Plus size={14} /> Add Skill
        </button>
      </div>

      <SectionCard className="!p-0 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 text-[11px] font-mono text-steel tracking-wider uppercase px-6 py-3 border-b border-mist bg-cloud/50">
          <span>Skill</span>
          <span className="w-20 text-center">Category</span>
          <span className="w-28 text-center">Level</span>
          <span className="w-16"></span>
        </div>
        {skills.map(skill => (
          <div key={skill.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-0 items-center px-6 py-3.5 border-b border-mist last:border-b-0 hover:bg-cloud/30 transition-colors">
            <input
              value={skill.name}
              onChange={e => updateSkillLocal(skill.id, 'name', e.target.value)}
              className="text-sm text-ink bg-transparent focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue/10 rounded px-2 py-1 -ml-2 transition-all"
            />
            <div className="w-20">
              <select
                value={skill.category}
                onChange={e => updateSkillLocal(skill.id, 'category', e.target.value)}
                className="appearance-none font-mono text-[11px] text-steel bg-transparent focus:outline-none focus:bg-white rounded px-2 py-1 text-center cursor-pointer"
              >
                {['Web', 'Lang', 'Data', 'Front', 'Back', 'Cloud', 'BI', 'IS'].map(c =>
                  <option key={c} value={c}>{c}</option>
                )}
              </select>
            </div>
            <div className="w-28 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={skill.level}
                onChange={e => updateSkillLocal(skill.id, 'level', parseInt(e.target.value))}
                className="w-16 accent-blue"
              />
              <span className="font-mono text-xs text-steel w-8 text-right">{skill.level}%</span>
            </div>
            <div className="w-16 flex justify-end">
              <button onClick={() => deleteSkill(skill.id)} className="p-1.5 text-silver hover:text-ember transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </SectionCard>

      <div className="flex justify-end">
        <button onClick={saveAllSkills} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors">
          <Save size={13} /> Save All
        </button>
      </div>
    </motion.div>
  )

  const renderExperience = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-ink mb-1">Experience</h2>
          <p className="text-steel text-sm">{experience.length} entries — {experience.filter(e => e.active).length} currently active</p>
        </div>
        <button onClick={addExp} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors shadow-sm">
          <Plus size={14} /> Add Entry
        </button>
      </div>

      <div className="space-y-3">
        {experience.map(exp => (
          <SectionCard key={exp.id} className="!p-0 overflow-hidden">
            <div
              className="flex items-center gap-4 p-5 cursor-pointer hover:bg-cloud/50 transition-colors"
              onClick={() => setEditingExp(editingExp === exp.id ? null : exp.id)}
            >
              <GripVertical size={14} className="text-silver" />
              <div className={`w-3 h-3 rounded-full border-2 ${exp.active ? 'bg-blue border-blue' : 'bg-white border-silver'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-ink">{exp.title}</span>
                  {exp.active && <span className="font-mono text-[10px] text-teal bg-teal/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>}
                </div>
                <p className="text-xs text-steel mt-0.5">{exp.subtitle}</p>
              </div>
              <span className="font-mono text-xs text-silver shrink-0">{exp.year}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={e => { e.stopPropagation(); setEditingExp(editingExp === exp.id ? null : exp.id) }} className="p-1.5 text-steel hover:text-blue transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={e => { e.stopPropagation(); deleteExp(exp.id) }} className="p-1.5 text-steel hover:text-ember transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingExp === exp.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-mist p-6 bg-white space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <AdminInput label="Title" value={exp.title} onChange={v => updateExpLocal(exp.id, 'title', v)} />
                      <AdminInput label="Date Range" value={exp.year} onChange={v => updateExpLocal(exp.id, 'year', v)} mono />
                    </div>
                    <AdminInput label="Organization" value={exp.subtitle} onChange={v => updateExpLocal(exp.id, 'subtitle', v)} />
                    <AdminTextarea label="Description" value={exp.description} onChange={v => updateExpLocal(exp.id, 'description', v)} />
                    <div className="flex items-center gap-3">
                      <label className="font-mono text-[11px] text-steel tracking-wider uppercase">Currently Active</label>
                      <button
                        onClick={() => updateExpLocal(exp.id, 'active', !exp.active)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${exp.active ? 'bg-blue' : 'bg-silver'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${exp.active ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button onClick={() => saveExp(exp)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors">
                        <Save size={13} /> Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        ))}
      </div>
    </motion.div>
  )

  const renderAbout = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-sans font-semibold text-ink mb-1">About Page</h2>
        <p className="text-steel text-sm">Edit your bio, interests, and personal details.</p>
      </div>

      <SectionCard>
        <h3 className="font-sans font-semibold text-ink mb-5">Bio</h3>
        <div className="space-y-5">
          <AdminTextarea label="Headline" value={headline} onChange={setHeadline} rows={2} />
          <AdminTextarea label="Main Paragraph" value={bio} onChange={setBio} rows={3} />
          <AdminTextarea label="Hobbies & Personal" value={hobbies} onChange={setHobbies} rows={2} />
        </div>
        <div className="flex justify-end pt-5">
          <button onClick={saveAbout} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors">
            <Save size={13} /> Save Bio
          </button>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-sans font-semibold text-ink">Focus Areas / Interests</h3>
          <button onClick={addInterest} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-blue bg-blue-wash rounded-lg hover:bg-blue/10 transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {interests.map(item => (
            <div key={item.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-start p-4 rounded-lg bg-white border border-mist">
              <input
                value={item.icon}
                onChange={e => updateInterestLocal(item.id, 'icon', e.target.value)}
                className="w-20 text-sm text-steel font-mono bg-transparent focus:outline-none focus:bg-snow focus:ring-2 focus:ring-blue/10 rounded px-2 py-1.5 transition-all border border-mist"
                placeholder="icon"
              />
              <input
                value={item.label}
                onChange={e => updateInterestLocal(item.id, 'label', e.target.value)}
                className="text-sm text-ink font-medium bg-transparent focus:outline-none focus:bg-snow focus:ring-2 focus:ring-blue/10 rounded px-2 py-1.5 -ml-2 transition-all"
                placeholder="Interest name"
              />
              <input
                value={item.desc}
                onChange={e => updateInterestLocal(item.id, 'desc', e.target.value)}
                className="text-sm text-steel bg-transparent focus:outline-none focus:bg-snow focus:ring-2 focus:ring-blue/10 rounded px-2 py-1.5 transition-all"
                placeholder="Short description"
              />
              <div className="flex items-center gap-1 mt-1">
                <button onClick={() => saveInterest(item)} className="p-1.5 text-steel hover:text-blue transition-colors">
                  <Save size={13} />
                </button>
                <button onClick={() => deleteInterest(item.id)} className="p-1.5 text-silver hover:text-ember transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  )

  const renderCoursework = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-ink mb-1">Coursework</h2>
          <p className="text-steel text-sm">{coursework.length} courses listed</p>
        </div>
        <button onClick={() => setAddingCourse(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors shadow-sm">
          <Plus size={14} /> Add Course
        </button>
      </div>

      {addingCourse && (
        <SectionCard>
          <div className="flex items-center gap-3">
            <input
              autoFocus
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCourse()}
              placeholder="Course name…"
              className="flex-1 px-3.5 py-2.5 bg-white border border-mist rounded-lg text-sm text-ink placeholder-silver focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/10 transition-all"
            />
            <button onClick={addCourse} className="px-4 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors">
              Add
            </button>
            <button onClick={() => { setAddingCourse(false); setNewCourseName('') }} className="px-4 py-2.5 bg-cloud text-steel font-mono text-xs rounded-lg hover:bg-mist transition-colors">
              Cancel
            </button>
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <div className="flex flex-wrap gap-2.5">
          {coursework.map(course => (
            <span key={course.id} className="group inline-flex items-center gap-2 font-mono text-sm px-4 py-2.5 rounded-xl border border-mist bg-white text-ink hover:border-blue/30 transition-all">
              {course.name}
              <button onClick={() => deleteCourse(course.id)} className="text-silver hover:text-ember opacity-0 group-hover:opacity-100 transition-all">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  )

  const renderContact = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-sans font-semibold text-ink mb-1">Contact Info</h2>
        <p className="text-steel text-sm">Social links and contact details shown on the Contact page.</p>
      </div>

      {/* Social links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-semibold text-ink">Social Links</h3>
          <button onClick={addSocial} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-blue bg-blue-wash rounded-lg hover:bg-blue/10 transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>

        <div className="space-y-3">
          {socials.map(social => (
            <SectionCard key={social.id} className="!p-0 overflow-hidden">
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-cloud/50 transition-colors"
                onClick={() => setEditingSocial(editingSocial === social.id ? null : social.id)}
              >
                <GripVertical size={14} className="text-silver" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-ink">{social.label}</span>
                  <p className="text-xs text-steel font-mono mt-0.5">{social.handle}</p>
                </div>
                <span className="font-mono text-xs text-silver truncate max-w-48 shrink-0">{social.href}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={e => { e.stopPropagation(); setEditingSocial(editingSocial === social.id ? null : social.id) }} className="p-1.5 text-steel hover:text-blue transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteSocial(social.id) }} className="p-1.5 text-steel hover:text-ember transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {editingSocial === social.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-mist p-6 bg-white space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <AdminInput label="Label" value={social.label} onChange={v => updateSocialLocal(social.id, 'label', v)} />
                        <AdminInput label="Icon name" value={social.icon} onChange={v => updateSocialLocal(social.id, 'icon', v)} mono placeholder="Github, Linkedin, Mail…" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <AdminInput label="Handle / Display text" value={social.handle} onChange={v => updateSocialLocal(social.id, 'handle', v)} mono />
                        <AdminInput label="URL / href" value={social.href} onChange={v => updateSocialLocal(social.id, 'href', v)} mono placeholder="https://…" />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button onClick={() => saveSocial(social)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors">
                          <Save size={13} /> Save Changes
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>
          ))}
        </div>
      </div>

      {/* Page meta */}
      {contactMeta && (
        <SectionCard>
          <h3 className="font-sans font-semibold text-ink mb-5">Page Meta</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <AdminInput label="Heading" value={contactMeta.heading} onChange={v => setContactMeta(prev => prev ? { ...prev, heading: v } : prev)} />
              <AdminInput label="Subheading" value={contactMeta.subheading} onChange={v => setContactMeta(prev => prev ? { ...prev, subheading: v } : prev)} />
            </div>
            <AdminTextarea label="Body Text" value={contactMeta.body_text} onChange={v => setContactMeta(prev => prev ? { ...prev, body_text: v } : prev)} rows={3} />
            <AdminInput label="Location Text" value={contactMeta.location_text} onChange={v => setContactMeta(prev => prev ? { ...prev, location_text: v } : prev)} />
          </div>
          <div className="flex justify-end pt-5">
            <button onClick={saveContactMeta} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue text-white font-mono text-xs font-semibold rounded-lg hover:bg-blue-dim transition-colors">
              <Save size={13} /> Save Meta
            </button>
          </div>
        </SectionCard>
      )}
    </motion.div>
  )

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    overview: renderOverview,
    projects: renderProjects,
    skills: renderSkills,
    experience: renderExperience,
    about: renderAbout,
    coursework: renderCoursework,
    contact: renderContact,
  }

  return (
    <div className="min-h-screen bg-cloud flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white border-r border-mist flex flex-col fixed top-0 left-0 bottom-0 z-40">
        <div className="p-6 border-b border-mist">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center">
              <span className="font-mono text-white text-sm font-bold">NB</span>
            </div>
            <div>
              <span className="text-sm font-medium text-ink block leading-tight">Admin Panel</span>
              <span className="font-mono text-[10px] text-steel tracking-wider">PORTFOLIO CMS</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sections.map(section => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-blue-wash text-blue font-medium'
                    : 'text-steel hover:text-ink hover:bg-cloud'
                }`}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-mist space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-mist text-sm text-steel hover:text-blue hover:border-blue/30 transition-all"
          >
            <Eye size={14} /> View Live Site
          </a>
          <button
            onClick={() => { localStorage.removeItem('admin_token'); navigate('/admin/login') }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-steel hover:text-ember hover:bg-ember/5 transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-[960px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection}>
              {sectionRenderers[activeSection]?.()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
