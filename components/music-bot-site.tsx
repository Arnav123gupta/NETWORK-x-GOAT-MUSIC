'use client'

import { useEffect, useState } from 'react'
import { Activity, Check, ChevronRight, CircleHelp, Gauge, LayoutDashboard, Menu, MessageCircle, Music2, Radio, RefreshCw, Server, ShieldCheck, Terminal, X, Zap } from 'lucide-react'

type Page = 'home' | 'pairing' | 'dashboard' | 'commands' | 'about'
type ServerStatus = 'online' | 'offline' | 'maintenance' | 'unknown'
type ServerInfo = { id: string; name: string; region: string; status: ServerStatus; load?: number }

const serverDirectory: ServerInfo[] = Array.from({ length: 10 }, (_, index) => ({
  id: `s${index + 1}`,
  name: `Node ${String(index + 1).padStart(2, '0')}`,
  region: ['North America', 'South America', 'Western Europe', 'Eastern Europe', 'Africa', 'Middle East', 'South Asia', 'Southeast Asia', 'East Asia', 'Oceania'][index],
  status: 'unknown',
}))

const countryCodes = ['+91', '+1', '+44', '+234', '+27', '+61', '+81', '+49', '+33', '+971']

const navItems: { id: Page; label: string; icon: typeof Radio }[] = [
  { id: 'home', label: 'Home', icon: Radio }, { id: 'pairing', label: 'Pairing', icon: MessageCircle }, { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'commands', label: 'Commands', icon: Terminal }, { id: 'about', label: 'About', icon: CircleHelp },
]

function MusicBackendStatus() {
  const [statuses, setStatuses] = useState({ backend: 'checking', whatsapp: 'checking', music: 'checking' })
  useEffect(() => {
    let active = true
    const load = async () => {
      const checks = await Promise.all([
        fetch('/api/health', { cache: 'no-store' }).then(r => ({ backend: r.ok ? 'online' : 'offline' })).catch(() => ({ backend: 'offline' })),
        fetch('/api/bot/status', { cache: 'no-store' }).then(async r => { const d = await r.json(); return { whatsapp: d.status === 'connected' ? 'online' : d.status === 'unconfigured' ? 'not configured' : 'offline' } }).catch(() => ({ whatsapp: 'offline' })),
        fetch('/api/music/health', { cache: 'no-store' }).then(async r => { const d = await r.json(); return { music: d.status === 'online' ? 'online' : d.status === 'not_configured' ? 'not configured' : 'offline' } }).catch(() => ({ music: 'offline' }))
      ])
      if (active) setStatuses(Object.assign({}, ...checks))
    }
    void load()
    return () => { active = false }
  }, [])
  return <div className="hidden flex-wrap items-center gap-3 text-[9px] font-medium uppercase tracking-[0.12em] text-white/45 sm:flex"><span>API {statuses.backend}</span><span>WhatsApp {statuses.whatsapp}</span><span>Music {statuses.music}</span></div>
}

export function MusicBotSite() {
  const [page, setPage] = useState<Page>('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = (next: Page) => { setPage(next); setMobileOpen(false) }
  return <main className="min-h-screen overflow-hidden bg-[#090405] text-white selection:bg-red-500/30"><div className="energy energy-one"/><div className="energy energy-two"/><div className="noise"/>
    <header className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><button className="group flex items-center gap-3 text-left" onClick={() => navigate('home')} aria-label="Go to home"><div className="brand-mark"><Music2 size={20}/></div><div><div className="font-display text-sm font-bold tracking-[0.2em] sm:text-base">NETWORK X GOAT</div><div className="text-[9px] font-semibold tracking-[0.35em] text-red-400/70">MUSIC MD</div></div></button><nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1.5 lg:flex" aria-label="Primary navigation">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`nav-link ${page === id ? 'nav-active' : ''}`}><Icon size={14}/>{label}</button>)}</nav><div className="flex items-center gap-2"><MusicBackendStatus /><button className="mobile-menu lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X size={19}/> : <Menu size={19}/>}</button></div></header>
    {mobileOpen && <div className="relative z-30 mx-5 grid gap-1 rounded-2xl border border-white/10 bg-[#16090b]/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`nav-link justify-start ${page === id ? 'nav-active' : ''}`}><Icon size={15}/>{label}</button>)}</div>}
    <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-8 sm:px-8 lg:px-12"><div className="h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent"/>{page === 'home' || page === 'pairing' ? <PairingPage onNavigate={navigate}/> : <ContentPage page={page} onNavigate={navigate}/>}</div>
    <footer className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-5 text-[10px] uppercase tracking-[0.16em] text-white/30 sm:flex-row sm:px-8 lg:px-12"><span>© 2026 Network X Goat Music MD. All rights reserved.</span><span className="flex items-center gap-2"><ShieldCheck size={13} className="text-red-400"/> Official provider setup</span></footer>
  </main>
}

function PairingPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <section className="pairing-grid py-10 lg:py-16">
    <div className="flex flex-col justify-center py-5 lg:pr-12">
      <div className="eyebrow"><span className="eyebrow-line"/> OFFICIAL WHATSAPP CLOUD API</div>
      <h1 className="hero-title mt-5">Connect your<br/><span>business number.</span></h1>
      <p className="mt-6 max-w-md text-sm leading-7 text-white/50">This project currently uses Meta WhatsApp Cloud API. It does not support personal WhatsApp QR or phone-number pairing.</p>
      <div className="visualizer-wrap mt-10"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="visualizer-core"><div className="core-glow"/><Music2 size={31} className="relative z-10 text-red-100"/></div>{[1,2,3,4,5].map((bar) => <div key={bar} className={`bar bar-${bar}`}/>)}</div>
      <div className="feature-row mt-10 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40"><span className="feature-badge"><ShieldCheck size={13} className="text-red-400"/> Official API</span><span className="feature-badge"><Activity size={13} className="text-red-400"/> Verified status</span></div>
    </div>
    <div className="glass-panel p-5 sm:p-7 lg:p-9">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400"><MessageCircle size={13}/> WhatsApp setup</div>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">Meta business onboarding</h2>
      <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-6 text-white/65">
        <li>Create or select a Meta developer app and add the WhatsApp product.</li>
        <li>Register and verify a business phone number in WhatsApp Manager.</li>
        <li>Configure the access token and phone number ID on the backend host.</li>
        <li>Set the webhook callback URL and verification token, then subscribe to the required webhook fields.</li>
        <li>Keep the app secret and all credentials server-side. Never put them in frontend code.</li>
      </ol>
      <div className="mt-7 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-100" role="status">Personal QR pairing and generated pairing codes are disabled because the current Cloud API adapter cannot provide them.</div>
      <button onClick={() => onNavigate('dashboard')} className="generate-btn mt-6 px-5">View service status <ChevronRight size={16}/></button>
    </div>
  </section>
}

function ContentPage({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) { const content = { dashboard: { icon: LayoutDashboard, title: 'Control center', desc: 'Your connected sessions, activity, and music controls will appear here once a session is active.', cards: ['Active sessions', 'Commands today', 'Uptime'] }, commands: { icon: Terminal, title: 'Command library', desc: 'Explore the commands your music bot will support. Connect a session to start using them in WhatsApp.', cards: ['Play a track', 'Queue music', 'Skip current'] }, about: { icon: CircleHelp, title: 'Built for the next track', desc: 'Network X Goat Music MD is a secure, community-first WhatsApp music infrastructure layer.', cards: ['Secure by design', 'Global nodes', 'Open tooling'] } }[page as 'dashboard'|'commands'|'about']; const Icon = content.icon; return <section className="min-h-[680px] py-20"><div className="mx-auto max-w-3xl text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400"><Icon size={26}/></div><div className="eyebrow mt-8 justify-center"><span className="eyebrow-line"/> NETWORK X GOAT <span className="eyebrow-line"/></div><h1 className="hero-title mt-4">{content.title}</h1><p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/45">{content.desc}</p><button onClick={() => onNavigate('pairing')} className="generate-btn mt-8 px-5">Open pairing terminal <ChevronRight size={16}/></button></div><div className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-3">{content.cards.map((card) => <div key={card} className="glass-panel p-5 text-left"><Gauge size={16} className="text-red-400"/><div className="mt-5 text-sm font-semibold">{card}</div><div className="mt-2 text-xs leading-5 text-white/35">Available after backend connection.</div></div>)}</div></section> }
