/**
 * Admin Panel JS — Manoj Associates
 * Local-storage DB, CRUD, Auth, Export/Import
 */

'use strict';

/* ==========================================
   DATABASE HELPERS
========================================== */
const DB = {
  KEYS: {
    REQS:     'ma_requirements',
    PROJS:    'ma_projects',
    APPS:     'ma_applications',
    SETTINGS: 'ma_admin_settings',
    AUTH:     'ma_admin_auth',
    SESSION:  'ma_session',
  },

  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    // Write sync timestamp so homepage polling can detect any change
    if (key !== 'ma_last_updated') {
      localStorage.setItem('ma_last_updated', Date.now().toString());
    }
    // Also sync to Cloud if available
    if (typeof CloudDB !== 'undefined' && CloudDB.isCloudReady()) {
      CloudDB.set(key, val, key);
    }
  },

  getReqs()     {
    let val = this.get(this.KEYS.REQS);
    if (!val) return [];
    return Array.isArray(val) ? val : (typeof val === 'object' ? Object.values(val) : []);
  },
  getProjs()    {
    let val = this.get(this.KEYS.PROJS);
    if (!val) return [];
    return Array.isArray(val) ? val : (typeof val === 'object' ? Object.values(val) : []);
  },
  getApps()     {
    let val = this.get(this.KEYS.APPS);
    if (!val) return [];
    return Array.isArray(val) ? val : (typeof val === 'object' ? Object.values(val) : []);
  },
  getSettings() { return this.get(this.KEYS.SETTINGS) || defaultSettings(); },
  setReqs(d)    { this.set(this.KEYS.REQS, d); },
  setProjs(d)   { this.set(this.KEYS.PROJS, d); },
  setApps(d)    { this.set(this.KEYS.APPS, d); },
  setSettings(d){ this.set(this.KEYS.SETTINGS, d); },
};

/* ==========================================
   SEED PROJECTS (Landmark Portfolio)
========================================== */
const SEED_PROJECTS = [
  {
    id: 'proj_001',
    title: 'Lucknow Metro',
    sector: 'metro',
    city: 'lucknow',
    client: 'Lucknow Metro',
    location: 'Lucknow, UP',
    status: 'Completed',
    desc: 'Execution of tunneling and metro station civil works for Lucknow Metro.',
    photos: [
      'Lucknow Metro Road Restoration.png',
      'Lucknow Metro Civil Works.png',
      'LucknowMetro/Lucknow1st.png',
      'LucknowMetro/Lucknow2nd.png',
      'LucknowMetro/Lucknow3rd.png',
      'homeSlider/9th.png'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_002',
    title: 'Pune Metro',
    sector: 'metro',
    city: 'pune',
    client: 'Pune Metro',
    location: 'Pune, Maharashtra',
    status: 'Completed',
    desc: 'Execution of tunneling and metro station works for Pune Metro.',
    photos: [
      'pune metro/1th.png',
      'punemetro.png',
      'pune metro/2th.png',
      'Pune Metro Finishing Works.png',
      'Pune Metro Basalt Cladding Work.png',
      'Pune Metro Segment Transportation.png',
      'pune metro/3rd.png',
      'pune metro/4th.png'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_003',
    title: 'Delhi Metro DC-05',
    sector: 'metro',
    city: 'delhi',
    client: 'Afcons Infrastructure',
    location: 'Delhi NCR',
    status: 'Completed',
    desc: 'Tunnel segment works for Delhi Metro Package DC-05.',
    photos: [
      'delhi_metro/delhi_2nd.png',
      'delhi_metro/afcons_img_2.png',
      'delhi_metro/afcons_img_3.png'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_004',
    title: 'Goregaon Mulund Link Road',
    sector: 'road',
    city: 'palghar',
    client: 'J. Kumar',
    location: 'Palghar, Maharashtra',
    status: 'In Progress',
    desc: 'Construction works for Goregaon Mulund Link Road (GMLR).',
    photos: [
      'link road/link-1th.jpeg',
      'link road/link-2nd.jpeg'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_005',
    title: 'Noida International Airport',
    sector: 'airport',
    city: 'noida',
    client: 'Tata Projects',
    location: 'Jewar, UP',
    status: 'In Progress',
    desc: 'Flooring and architectural civil works for Noida International Airport.',
    photos: [
      'airport.png',
      'airport/airport_1th.png',
      'airport/hd_image.png'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_006',
    title: 'Chennai Metro TU-01 & UG-06',
    sector: 'metro',
    city: 'chennai',
    client: 'Tata Projects',
    location: 'Chennai, Tamil Nadu',
    status: 'In Progress',
    desc: 'Tunnel segment casting and works for Chennai Metro Phase 2.',
    photos: [
      'chennai_mtero/chennai_7th.png',
      'chennai_mtero/chennai_1th.jpeg',
      'chennai_mtero/chennai_2nd.jpeg',
      'chennai_mtero/chennai_3th.jpeg',
      'chennai_mtero/chennai_4th.jpeg',
      'chennai_mtero/chennai_5th.jpeg'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_007',
    title: 'Bhopal Metro',
    sector: 'metro',
    city: 'bhopal',
    client: 'Tata Projects',
    location: 'Bhopal, MP',
    status: 'In Progress',
    desc: 'Tunnel segment works for Bhopal Metro project.',
    photos: [
      'BhopalMetroSegment/Bhopal_1th.jpeg',
      'BhopalMetroSegment/Bhopal_2nd.jpeg',
      'BhopalMetroSegment/Bhopal_3th.jpeg'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_008',
    title: 'Segment transportation TU-01',
    sector: 'transport',
    city: 'chennai',
    client: 'Tata Projects',
    location: 'Chennai, Tamil Nadu',
    status: 'In Progress',
    desc: 'Specialized tunnel segment transportation (long-bed trucks) for Chennai Metro TU-01 package.',
    photos: [
      'chennai_mtero/chennai_5th.jpeg',
      'chennai_mtero/chennai_6th.jpeg'
    ],
    active: true,
    created: new Date().toISOString(),
  },
  {
    id: 'proj_009',
    title: 'Basalt Cladding - Taj Hotel',
    sector: 'urban',
    city: 'lucknow',
    client: 'Taj Hotels / Tata',
    location: 'Gomti Nagar, Lucknow',
    status: 'Completed',
    desc: 'Specialized work order for fixing high-quality Basalt Cladding for the prestigious Taj Hotel Project in Gomti Nagar, Lucknow.',
    photos: [
      'taj.png'
    ],
    active: true,
    created: new Date().toISOString(),
  }
];


/* ==========================================
   DEFAULT DATA
========================================== */
function defaultSettings() {
  return {
    announcer_on: true,
    announcer_text: '🚨 URGENT REQUIREMENT: Seeking Senior Civil Engineers for Pune Metro Tunneling — 3-5 Yrs Experience  |  🏗️ IMMEDIATE NEED: Experienced Site Supervisors for Noida Airport Project  |  ⚙️ HIRING: Hydraulic Rig Operators & Surveyors — Apply Now via Contact Form',
    ticker_style: 'urgent',
    admin_user: 'admin',
    admin_pass: 'admin123',
    company_name: 'Manoj Associates',
    req_section_title: 'Current Openings & Urgent Requirements',
    req_section_subtitle: 'Join India\'s premier infrastructure contractor. We are actively hiring skilled engineers, supervisors, surveyors, and operators for live metro, highway, and airport projects.',
    contact_email: 'manojdwivedi@manojassociates.com',
    contact_phone: '9415005550',
  };
}

const SEED_REQUIREMENTS = [
  {
    id: 'req_001',
    title: 'Senior Civil Engineer — Metro Tunneling',
    category: 'metro',
    openings: 4,
    experience: '5–8 Years',
    location: 'Pune Metro / Chennai Metro',
    urgency: 'urgent',
    active: true,
    description: 'We are urgently seeking Senior Civil Engineers with deep expertise in metro tunneling, TBM operations, and underground station civil works. The candidate will be responsible for site execution, quality assurance, and coordination with L&T/Afcons project teams.',
    qualifications: 'B.Tech / M.Tech Civil Engineering. Prior experience on DMRC, CMRL, PMRDA, or equivalent metro projects preferred.',
    created: new Date().toISOString(),
  },
  {
    id: 'req_002',
    title: 'Site Supervisor — Civil & Finishing Works',
    category: 'metro',
    openings: 8,
    experience: '3–5 Years',
    location: 'Delhi Metro / Bhopal Metro',
    urgency: 'urgent',
    active: true,
    description: 'Supervise day-to-day civil finishing, cladding, and MEP integration works on metro stations. Must be capable of managing a workforce of 20-50 labourers, handling daily progress reports, and ensuring zero-defect execution.',
    qualifications: 'Diploma / B.Tech Civil. Metro or high-rise finishing work experience strongly preferred.',
    created: new Date().toISOString(),
  },
  {
    id: 'req_003',
    title: 'Survey Engineer',
    category: 'metro',
    openings: 3,
    experience: '2–4 Years',
    location: 'Lucknow / Patna Metro',
    urgency: 'immediate',
    active: true,
    description: 'Conduct precise topographic, alignment, and settlement monitoring surveys on underground and elevated metro corridor sites. Proficiency with Total Station, GPS, and levelling instruments essential.',
    qualifications: 'B.Tech / Diploma in Civil Engineering with strong hands-on survey instrumentation skills.',
    created: new Date().toISOString(),
  },
  {
    id: 'req_004',
    title: 'Hydraulic Rig / Piling Operator',
    category: 'machinery',
    openings: 5,
    experience: '4–7 Years',
    location: 'Noida International Airport / Pan-India',
    urgency: 'urgent',
    active: true,
    description: 'Operate hydraulic rotary piling rigs for airport foundation and metro pile casting works. Must have ITI or equivalent certification and documented safe operational experience on large rigs.',
    qualifications: 'ITI Mechanical/Operator. Valid HMV licence preferred. Prior airport or metro site experience.',
    created: new Date().toISOString(),
  },
  {
    id: 'req_005',
    title: 'Sub-Contractor — Concrete & Shuttering',
    category: 'procurement',
    openings: 2,
    experience: 'Established Firm',
    location: 'Pan-India (Multiple Project Sites)',
    urgency: 'active',
    active: true,
    description: 'Empanelment of experienced sub-contracting firms for mass concrete pouring, shuttering / form-work, and reinforcement works on metro and highway projects. Joint-venture opportunities also available.',
    qualifications: 'Registered firm with GST, PF/ESI registration, minimum 3 years of documented project execution track record.',
    created: new Date().toISOString(),
  },
  {
    id: 'req_006',
    title: 'Highway Site Engineer',
    category: 'highway',
    openings: 3,
    experience: '2–5 Years',
    location: 'Uttar Pradesh / Maharashtra',
    urgency: 'active',
    active: true,
    description: 'Site execution of highway embankment, pavement layering, road restoration, and drainage works as part of NHAI/state-highway projects. Must be proficient in road geometry, MoRT&H standards, and DPR reading.',
    qualifications: 'B.Tech / Diploma Civil. Experience on NH or SH highway project mandatory.',
    created: new Date().toISOString(),
  },
  {
    id: 'req_007',
    title: 'Airport Infrastructure Project Manager',
    category: 'aviation',
    openings: 1,
    experience: '8–12 Years',
    location: 'Noida International Airport',
    urgency: 'pipeline',
    active: false,
    description: 'Lead a team of 20+ engineers on airport civil and infrastructure works. Manage project schedules, sub-contractor coordination, billing, and client interface for aviation-grade infrastructure delivery.',
    qualifications: 'B.Tech Civil with MBA/PG preferred. Prior experience on DIAL/MIAL/NIAL or similar Grade-A airport project mandatory.',
    created: new Date().toISOString(),
  },
];

/* ==========================================
   INITIALISE DATABASE (seed if empty & real-time sync)
========================================== */
async function initDB() {
  if (typeof CloudDB !== 'undefined' && CloudDB.isCloudReady()) {
    try {
      const cloudReqs = await CloudDB.get('ma_requirements');
      if (cloudReqs && cloudReqs.length) {
        localStorage.setItem('ma_requirements', JSON.stringify(cloudReqs));
      } else if (!DB.getReqs().length) {
        DB.setReqs(SEED_REQUIREMENTS);
      }

      const cloudProjs = await CloudDB.get('ma_projects');
      if (cloudProjs && cloudProjs.length) {
        localStorage.setItem('ma_projects', JSON.stringify(cloudProjs));
      } else if (!DB.getProjs().length) {
        DB.setProjs(SEED_PROJECTS);
      }

      const cloudSettings = await CloudDB.get('ma_admin_settings');
      if (cloudSettings && typeof cloudSettings === 'object') {
        localStorage.setItem('ma_admin_settings', JSON.stringify(cloudSettings));
      }
      const cloudApps = await CloudDB.get('ma_applications');
      if (cloudApps && cloudApps.length) {
        localStorage.setItem('ma_applications', JSON.stringify(cloudApps));
      }
      refreshCurrentPanel();
    } catch (e) {
      console.warn("Cloud init sync error:", e);
    }

    // Realtime listener for incoming applications from homepage
    CloudDB.listen('ma_applications', (data) => {
      let apps = [];
      if (data && Array.isArray(data)) apps = data;
      else if (data && typeof data === 'object') apps = Object.values(data);
      localStorage.setItem('ma_applications', JSON.stringify(apps));
      renderApplications(currentAppFilter, currentAppSearch);
      renderDashboard();
    });

    // Realtime listener for requirements changes
    CloudDB.listen('ma_requirements', (data) => {
      let reqs = [];
      if (data && Array.isArray(data)) reqs = data;
      else if (data && typeof data === 'object') reqs = Object.values(data);
      if (reqs.length) {
        localStorage.setItem('ma_requirements', JSON.stringify(reqs));
        if (currentPanel === 'requirements') renderRequirements(currentReqFilter, currentReqSearch);
        renderDashboard();
      }
    });

    // Realtime listener for projects changes
    CloudDB.listen('ma_projects', (data) => {
      let projs = [];
      if (data && Array.isArray(data)) projs = data;
      else if (data && typeof data === 'object') projs = Object.values(data);
      if (projs.length) {
        localStorage.setItem('ma_projects', JSON.stringify(projs));
        if (currentPanel === 'projects') renderProjects(currentProjFilter, currentProjSearch);
      }
    });
  } else {
    if (!DB.getReqs().length) {
      DB.setReqs(SEED_REQUIREMENTS);
    }
    if (!DB.getProjs().length) {
      DB.setProjs(SEED_PROJECTS);
    }
  }
}

/* ==========================================
   SESSION / AUTH
========================================== */
function isLoggedIn() {
  return sessionStorage.getItem('ma_admin_session') === 'true';
}
function login(user, pass) {
  const s = DB.getSettings();
  return user === s.admin_user && pass === s.admin_pass;
}
function doLogin() {
  sessionStorage.setItem('ma_admin_session', 'true');
}
function doLogout() {
  sessionStorage.removeItem('ma_admin_session');
  location.reload();
}

/* ==========================================
   UTILITIES
========================================== */
function uid() { return 'req_' + Date.now() + Math.floor(Math.random()*1000); }
function appId() { return 'app_' + Date.now() + Math.floor(Math.random()*1000); }

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function timeAgo(iso) {
  if (!iso) return '';
  const secs = Math.floor((Date.now() - new Date(iso))/1000);
  if (secs < 60)    return 'Just now';
  if (secs < 3600)  return Math.floor(secs/60) + 'm ago';
  if (secs < 86400) return Math.floor(secs/3600) + 'h ago';
  return Math.floor(secs/86400) + 'd ago';
}

function categoryLabel(cat) {
  const map = { metro:'Metro & Tunneling', highway:'Highway & Bridge', aviation:'Aviation', machinery:'Heavy Machinery', procurement:'Procurement / Sub-Contract' };
  return map[cat] || cat;
}
function urgencyLabel(u) {
  const map = { urgent:'🔴 Urgent Hiring', immediate:'🟠 Immediate', active:'🟢 Active', pipeline:'🔵 Pipeline' };
  return map[u] || u;
}
function statusLabel(s) {
  const map = { new:'New', reviewed:'Reviewed', shortlisted:'Shortlisted', contacted:'Contacted' };
  return map[s] || s;
}

/* ==========================================
   TOAST
========================================== */
let toastTimer;
function toast(msg, type='success') {
  const el = document.getElementById('admin-toast');
  const icon = type==='success' ? 'fa-circle-check' : type==='error' ? 'fa-circle-xmark' : 'fa-circle-info';
  el.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
  el.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = ''; }, 3200);
}

/* ==========================================
   CONFIRM DIALOG (uses browser)
========================================== */
function confirmAction(msg) { return window.confirm(msg); }

/* ==========================================
   DASHBOARD
========================================== */
function renderDashboard() {
  const reqs = DB.getReqs();
  const apps = DB.getApps();
  const active = reqs.filter(r => r.active).length;
  const urgent = reqs.filter(r => r.urgency === 'urgent' && r.active).length;
  const newApps = apps.filter(a => a.status === 'new').length;

  document.getElementById('dash-total-reqs').textContent = reqs.length;
  document.getElementById('dash-active-reqs').textContent = active;
  document.getElementById('dash-urgent').textContent = urgent;
  document.getElementById('dash-new-apps').textContent = newApps;

  // Badge
  const badge = document.getElementById('sidebar-app-badge');
  if (badge) badge.textContent = newApps;

  // Recent applications
  const container = document.getElementById('recent-apps-list');
  if (!container) return;
  const recent = [...apps].sort((a,b) => new Date(b.created)-new Date(a.created)).slice(0,5);
  if (!recent.length) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><h3>No Applications Yet</h3><p>Applications submitted on the homepage will appear here.</p></div>`;
    return;
  }
  container.innerHTML = recent.map(a => `
    <div class="mini-app-item">
      <div class="mini-app-info">
        <div class="app-name">${a.name}</div>
        <div class="app-role">${a.position || 'General Inquiry'}</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="app-status-badge ${a.status}">${statusLabel(a.status)}</span>
        <span class="mini-app-time">${timeAgo(a.created)}</span>
      </div>
    </div>
  `).join('');
}

/* ==========================================
   REQUIREMENTS PANEL
========================================== */
let currentEditId = null;

function renderRequirements(filter='all', search='') {
  let reqs = DB.getReqs();
  if (filter !== 'all') reqs = reqs.filter(r => r.category === filter || r.urgency === filter);
  if (search) {
    const q = search.toLowerCase();
    reqs = reqs.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }
  const grid = document.getElementById('req-grid');
  if (!grid) return;

  if (!reqs.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-folder-open"></i><h3>No Requirements Found</h3><p>Add a new requirement or adjust filters.</p></div>`;
    return;
  }

  grid.innerHTML = reqs.map(r => `
    <div class="req-admin-card ${r.active ? '' : 'inactive'}" id="rcard-${r.id}">
      <div class="req-card-top">
        <div class="req-card-title">${r.title}</div>
        <span class="req-category-chip ${r.category}">${categoryLabel(r.category)}</span>
      </div>
      <div class="req-card-meta">
        <span><i class="fa-solid fa-users"></i> ${r.openings} Opening${r.openings>1?'s':''}</span>
        <span><i class="fa-solid fa-briefcase"></i> ${r.experience}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${r.location}</span>
      </div>
      <p style="font-size:0.82rem;color:#6B7280;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${r.description}</p>
      <div class="req-card-footer">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="urgency-badge ${r.urgency}">${urgencyLabel(r.urgency)}</span>
          <label class="status-toggle-pill" onclick="toggleReqStatus('${r.id}')">
            <div class="toggle-switch ${r.active?'on':''}"></div>
            <span style="font-size:0.75rem;color:#6B7280;">${r.active?'Live':'Hidden'}</span>
          </label>
        </div>
        <div class="req-actions">
          <button class="btn btn-ghost btn-sm btn-icon" title="Edit" onclick="openEditModal('${r.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" title="Delete" onclick="deleteReq('${r.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleReqStatus(id) {
  const reqs = DB.getReqs();
  const idx = reqs.findIndex(r => r.id === id);
  if (idx < 0) return;
  reqs[idx].active = !reqs[idx].active;
  DB.setReqs(reqs);
  renderRequirements(currentReqFilter, currentReqSearch);
  syncHomepageAnnouncer();
  toast(`Requirement ${reqs[idx].active ? 'activated' : 'hidden'} successfully.`);
}

function deleteReq(id) {
  if (!confirmAction('Delete this requirement? This cannot be undone.')) return;
  const reqs = DB.getReqs().filter(r => r.id !== id);
  DB.setReqs(reqs);
  renderRequirements(currentReqFilter, currentReqSearch);
  renderDashboard();
  syncHomepageAnnouncer();
  toast('Requirement deleted.', 'info');
}

/* ── Add / Edit Modal ── */
function openAddModal() {
  currentEditId = null;
  document.getElementById('req-modal-title').textContent = 'Add New Requirement';
  document.getElementById('req-form').reset();
  document.getElementById('req-active').checked = true;
  openModal('req-modal');
}

function openEditModal(id) {
  const r = DB.getReqs().find(r => r.id === id);
  if (!r) return;
  currentEditId = id;
  document.getElementById('req-modal-title').textContent = 'Edit Requirement';
  document.getElementById('req-title').value        = r.title;
  document.getElementById('req-category').value     = r.category;
  document.getElementById('req-openings').value     = r.openings;
  document.getElementById('req-experience').value   = r.experience;
  document.getElementById('req-location').value     = r.location;
  document.getElementById('req-urgency').value      = r.urgency;
  document.getElementById('req-description').value  = r.description;
  document.getElementById('req-qualifications').value = r.qualifications || '';
  document.getElementById('req-active').checked     = r.active;
  openModal('req-modal');
}

function saveRequirement() {
  const title   = document.getElementById('req-title').value.trim();
  const cat     = document.getElementById('req-category').value;
  const openings= parseInt(document.getElementById('req-openings').value) || 1;
  const exp     = document.getElementById('req-experience').value.trim();
  const loc     = document.getElementById('req-location').value.trim();
  const urgency = document.getElementById('req-urgency').value;
  const desc    = document.getElementById('req-description').value.trim();
  const qual    = document.getElementById('req-qualifications').value.trim();
  const active  = document.getElementById('req-active').checked;

  if (!title || !cat || !loc || !desc) { toast('Please fill all required fields.', 'error'); return; }

  const reqs = DB.getReqs();

  if (currentEditId) {
    const idx = reqs.findIndex(r => r.id === currentEditId);
    if (idx >= 0) {
      reqs[idx] = { ...reqs[idx], title, category:cat, openings, experience:exp, location:loc, urgency, description:desc, qualifications:qual, active };
    }
    toast('Requirement updated successfully.');
  } else {
    reqs.unshift({ id:uid(), title, category:cat, openings, experience:exp, location:loc, urgency, description:desc, qualifications:qual, active, created:new Date().toISOString() });
    toast('New requirement added successfully.');
  }

  DB.setReqs(reqs);
  closeModal('req-modal');
  renderRequirements(currentReqFilter, currentReqSearch);
  renderDashboard();
  syncHomepageAnnouncer();
}

/* ==========================================
   APPLICATIONS PANEL
========================================== */
function renderApplications(filter='all', search='') {
  let apps = DB.getApps();
  if (filter !== 'all') apps = apps.filter(a => a.status === filter);
  if (search) {
    const q = search.toLowerCase();
    apps = apps.filter(a => a.name.toLowerCase().includes(q) || (a.position||'').toLowerCase().includes(q) || (a.email||'').toLowerCase().includes(q));
  }
  apps = [...apps].sort((a,b) => new Date(b.created)-new Date(a.created));

  const tbody = document.getElementById('apps-tbody');
  if (!tbody) return;

  if (!apps.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-inbox"></i><h3>No Applications</h3><p>Applications submitted via the homepage will appear here.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = apps.map(a => `
    <tr class="app-header-row">
      <td><strong>${a.name}</strong></td>
      <td><span style="font-weight:600;color:var(--admin-text);">${a.position || '—'}</span></td>
      <td><a href="mailto:${a.email}" style="color:var(--admin-accent);text-decoration:underline;">${a.email||'—'}</a></td>
      <td><a href="tel:${a.phone}" style="color:var(--admin-text);">${a.phone||'—'}</a></td>
      <td>${a.experience||'—'}</td>
      <td><span class="app-status-badge ${a.status}">${statusLabel(a.status)}</span></td>
      <td>
        <select class="filter-select" style="padding:5px 8px;font-size:0.75rem;" onchange="updateAppStatus('${a.id}', this.value)">
          <option value="new" ${a.status==='new'?'selected':''}>New</option>
          <option value="reviewed" ${a.status==='reviewed'?'selected':''}>Reviewed</option>
          <option value="shortlisted" ${a.status==='shortlisted'?'selected':''}>Shortlisted</option>
          <option value="contacted" ${a.status==='contacted'?'selected':''}>Contacted</option>
        </select>
        <button class="btn btn-danger btn-sm btn-icon" style="margin-left:6px;" title="Delete" onclick="deleteApp('${a.id}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
    <tr class="app-message-row">
      <td colspan="7">
        <div class="app-message-box">
          <div class="app-message-header">
            <span class="app-message-title">
              <i class="fa-solid fa-file-lines"></i> Cover Message &amp; Key Qualifications
            </span>
            <span class="app-message-date">
              <i class="fa-regular fa-calendar"></i> Submitted: ${formatDate(a.created)}
            </span>
          </div>
          <div class="app-message-content">${(a.message || 'No cover message provided by applicant.').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateAppStatus(id, status) {
  const apps = DB.getApps();
  const idx = apps.findIndex(a => a.id === id);
  if (idx >= 0) { apps[idx].status = status; DB.setApps(apps); renderDashboard(); toast('Status updated.', 'info'); }
}

function deleteApp(id) {
  if (!confirmAction('Remove this application?')) return;
  DB.setApps(DB.getApps().filter(a => a.id !== id));
  renderApplications(currentAppFilter, currentAppSearch);
  renderDashboard();
  toast('Application removed.', 'info');
}

function exportApps() {
  const apps = DB.getApps();
  if (!apps.length) { toast('No applications to export.', 'error'); return; }
  const headers = ['Name','Position','Email','Phone','Experience','Message','Status','Date'];
  const rows = apps.map(a => [
    a.name, a.position||'', a.email||'', a.phone||'', a.experience||'', (a.message||'').replace(/,/g,' '), a.status, formatDate(a.created)
  ]);
  const csv = [headers, ...rows].map(r => r.map(c=>`"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='applications_export.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('Applications exported to CSV.', 'success');
}

/* ==========================================
   ANNOUNCER PANEL
========================================== */
let _annEnabled = true; // module-level state for toggle

function renderAnnouncerPanel() {
  const s = DB.getSettings();
  _annEnabled = s.announcer_on !== false; // default ON
  _updateToggleUI();
  document.getElementById('ann-text').value = s.announcer_text || '';
  document.getElementById('ann-style').value = s.ticker_style || 'urgent';
  _updateAnnouncerPreview();
}

function _updateToggleUI() {
  const sw  = document.getElementById('ann-toggle-switch');
  const lbl = document.getElementById('ann-toggle-label');
  if (sw)  sw.className  = `toggle-switch ${_annEnabled ? 'on' : ''}`;
  if (lbl) lbl.textContent = _annEnabled ? 'ON' : 'OFF';
  if (lbl) lbl.style.color = _annEnabled ? '#2E7D32' : '#6B7280';
}

function _updateAnnouncerPreview() {
  const text    = (document.getElementById('ann-text')?.value || '').trim();
  const style   = document.getElementById('ann-style')?.value || 'urgent';
  const preview = document.getElementById('ann-preview');
  const textEl  = document.getElementById('ann-preview-text');
  const bgMap   = { urgent:'#1F3A5F', warning:'#7B3100', success:'#1B5E20', dark:'#111' };
  if (preview) preview.style.background = bgMap[style] || '#1F3A5F';
  if (textEl)  textEl.textContent = text || '(no announcement text yet)';
}

/* Toggle switch click — called by addEventListener below */
function toggleAnnouncerSwitch() {
  _annEnabled = !_annEnabled;
  _updateToggleUI();
}

function saveAnnouncer() {
  const text = document.getElementById('ann-text')?.value?.trim() || '';
  const style = document.getElementById('ann-style')?.value || 'urgent';
  if (!text) { toast('Please enter announcement text before saving.', 'error'); return; }
  const s = DB.getSettings();
  s.announcer_on   = _annEnabled;
  s.announcer_text = text;
  s.ticker_style   = style;
  DB.setSettings(s);
  toast('Announcement saved! Homepage will update in ~3 seconds.', 'success');
}

/* ==========================================
   SETTINGS PANEL
========================================== */
function renderSettings() {
  const s = DB.getSettings();
  document.getElementById('set-admin-user').value         = s.admin_user;
  document.getElementById('set-admin-pass').value         = s.admin_pass;
  document.getElementById('set-req-title').value          = s.req_section_title;
  document.getElementById('set-req-subtitle').value       = s.req_section_subtitle;
  document.getElementById('set-contact-email').value      = s.contact_email;
  document.getElementById('set-contact-phone').value      = s.contact_phone;
}

function saveSettings() {
  const s = DB.getSettings();
  s.admin_user         = document.getElementById('set-admin-user').value.trim() || s.admin_user;
  s.admin_pass         = document.getElementById('set-admin-pass').value.trim() || s.admin_pass;
  s.req_section_title  = document.getElementById('set-req-title').value.trim();
  s.req_section_subtitle = document.getElementById('set-req-subtitle').value.trim();
  s.contact_email      = document.getElementById('set-contact-email').value.trim();
  s.contact_phone      = document.getElementById('set-contact-phone').value.trim();
  DB.setSettings(s);
  syncHomepageAnnouncer();
  toast('Settings saved successfully!');
}

function exportData() {
  const data = { requirements: DB.getReqs(), applications: DB.getApps(), settings: DB.getSettings(), exported: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`manojassociates_backup_${Date.now()}.json`; a.click();
  URL.revokeObjectURL(url);
  toast('Data backup exported.', 'success');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const d = JSON.parse(ev.target.result);
      if (d.requirements) DB.setReqs(d.requirements);
      if (d.applications) DB.setApps(d.applications);
      if (d.settings)     DB.setSettings(d.settings);
      toast('Data imported successfully!');
      refreshCurrentPanel();
    } catch { toast('Invalid backup file.', 'error'); }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirmAction('RESET ALL DATA? This permanently deletes all requirements, applications, and settings. This cannot be undone.')) return;
  localStorage.removeItem(DB.KEYS.REQS);
  localStorage.removeItem(DB.KEYS.APPS);
  localStorage.removeItem(DB.KEYS.SETTINGS);
  initDB();
  toast('All data reset to defaults.', 'info');
  refreshCurrentPanel();
}

/* ==========================================
   SYNC: push settings to homepage (localStorage)
========================================== */
function syncHomepageAnnouncer() {
  // The homepage script.js reads this key to render the announcement bar
  localStorage.setItem('ma_hp_sync', Date.now().toString());
}

/* ==========================================
   MODAL HELPERS
========================================== */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ==========================================
   PROJECTS PANEL (CRUD + Photo Uploads)
========================================== */
let currentProjFilter = 'all';
let currentProjSearch = '';
let currentProjEditId = null;
let currentProjPhotos = []; // array of image strings (dataURLs or paths)

function renderProjects(filter = 'all', search = '') {
  let projs = DB.getProjs();
  if (filter !== 'all') projs = projs.filter(p => p.sector === filter);
  if (search) {
    const q = search.toLowerCase();
    projs = projs.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.client || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q)
    );
  }

  const grid = document.getElementById('proj-grid');
  if (!grid) return;

  if (!projs.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-folder-open"></i><h3>No Projects Found</h3><p>Click "Add Project" to upload a new project with photos.</p></div>`;
    return;
  }

  grid.innerHTML = projs.map(p => {
    const photoList = Array.isArray(p.photos) ? p.photos : (p.photos ? p.photos.split(',').map(s=>s.trim()) : []);
    const mainThumb = photoList[0] || 'pune metro/1th.png';
    const sectorMap = { metro: 'Metro', road: 'Highway', airport: 'Airport', transport: 'Transport', urban: 'Urban' };

    return `
      <div class="proj-admin-card ${p.active ? '' : 'inactive'}" id="pcard-${p.id}">
        <div class="proj-card-thumb">
          <img src="${mainThumb}" alt="${p.title}" onerror="this.src='homeSlider/9th.png'">
          <span class="proj-card-badge">${sectorMap[p.sector] || p.sector}</span>
          <span class="proj-photo-count-badge"><i class="fa-solid fa-images"></i> ${photoList.length} Photos</span>
        </div>
        <div class="proj-card-content">
          <div class="proj-card-title">${p.title}</div>
          <div class="proj-card-meta">
            <span><i class="fa-solid fa-building-user"></i> ${p.client || 'Client: Direct'}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${p.location || 'Pan-India'}</span>
            <span><i class="fa-solid fa-circle-check"></i> Status: ${p.status || 'Completed'}</span>
          </div>
          <p style="font-size:0.8rem;color:#6B7280;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:12px;">
            ${p.desc || 'No description provided.'}
          </p>
          <div class="proj-card-footer">
            <label class="status-toggle-pill" onclick="toggleProjStatus('${p.id}')">
              <div class="toggle-switch ${p.active ? 'on' : ''}"></div>
              <span style="font-size:0.75rem;color:#6B7280;">${p.active ? 'Live' : 'Hidden'}</span>
            </label>
            <div class="req-actions">
              <button class="btn btn-ghost btn-sm btn-icon" title="Edit Project" onclick="openEditProjModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-danger btn-sm btn-icon" title="Delete Project" onclick="deleteProj('${p.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleProjStatus(id) {
  const projs = DB.getProjs();
  const idx = projs.findIndex(p => p.id === id);
  if (idx < 0) return;
  projs[idx].active = !projs[idx].active;
  DB.setProjs(projs);
  renderProjects(currentProjFilter, currentProjSearch);
  toast(`Project ${projs[idx].active ? 'activated' : 'hidden'} successfully.`);
}

function deleteProj(id) {
  if (!confirmAction('Delete this project and its photos? This cannot be undone.')) return;
  const projs = DB.getProjs().filter(p => p.id !== id);
  DB.setProjs(projs);
  renderProjects(currentProjFilter, currentProjSearch);
  toast('Project deleted.', 'info');
}

/* ── Add / Edit Project Modal & Photo Management ── */
function openAddProjModal() {
  currentProjEditId = null;
  currentProjPhotos = [];
  document.getElementById('proj-modal-title').textContent = 'Add New Project';
  document.getElementById('proj-form').reset();
  document.getElementById('proj-active').checked = true;
  renderProjPhotosPreview();
  openModal('proj-modal');
}

function openEditProjModal(id) {
  const p = DB.getProjs().find(item => item.id === id);
  if (!p) return;
  currentProjEditId = id;
  currentProjPhotos = Array.isArray(p.photos) ? [...p.photos] : (p.photos ? p.photos.split(',').map(s=>s.trim()) : []);
  
  document.getElementById('proj-modal-title').textContent = 'Edit Project & Photos';
  document.getElementById('proj-title').value    = p.title || '';
  document.getElementById('proj-sector').value   = p.sector || 'metro';
  document.getElementById('proj-status').value   = p.status || 'Completed';
  document.getElementById('proj-client').value   = p.client || '';
  document.getElementById('proj-location').value = p.location || '';
  document.getElementById('proj-desc').value     = p.desc || '';
  document.getElementById('proj-active').checked = p.active !== false;

  renderProjPhotosPreview();
  openModal('proj-modal');
}

function renderProjPhotosPreview() {
  const container = document.getElementById('proj-photos-preview');
  if (!container) return;

  if (!currentProjPhotos.length) {
    container.innerHTML = '<p style="font-size:0.75rem;color:#9CA3AF;grid-column:1/-1;text-align:center;padding:10px;">No photos added yet. Select photos above to upload.</p>';
    return;
  }

  container.innerHTML = currentProjPhotos.map((src, index) => `
    <div class="photo-preview-item ${index === 0 ? 'primary' : ''}" title="${index === 0 ? 'Primary Cover Photo' : 'Click to make cover photo'}" onclick="makePhotoPrimary(${index})">
      <img src="${src}" alt="Photo ${index + 1}">
      <button type="button" class="photo-del-btn" title="Remove photo" onclick="event.stopPropagation(); removePhoto(${index});">&times;</button>
      ${index === 0 ? '<span class="photo-primary-badge">Cover</span>' : ''}
    </div>
  `).join('');
}

function makePhotoPrimary(index) {
  if (index === 0 || index >= currentProjPhotos.length) return;
  const chosen = currentProjPhotos.splice(index, 1)[0];
  currentProjPhotos.unshift(chosen);
  renderProjPhotosPreview();
  toast('Cover photo updated.', 'info');
}

function removePhoto(index) {
  currentProjPhotos.splice(index, 1);
  renderProjPhotosPreview();
}

// Client-side image compression (converts file to compact JPEG base64 DataURL ~50KB)
function compressImage(file, maxWidth = 1000, maxHeight = 750, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

async function handlePhotoFiles(files) {
  if (!files || !files.length) return;
  toast(`Processing and compressing ${files.length} photo(s)…`, 'info');
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    try {
      const compressedDataUrl = await compressImage(file);
      currentProjPhotos.push(compressedDataUrl);
    } catch (e) {
      console.error("Image compression error:", e);
    }
  }
  renderProjPhotosPreview();
  toast('Photos attached successfully!');
}

function saveProject() {
  const title    = document.getElementById('proj-title').value.trim();
  const sector   = document.getElementById('proj-sector').value;
  const status   = document.getElementById('proj-status').value;
  const client   = document.getElementById('proj-client').value.trim();
  const location = document.getElementById('proj-location').value.trim();
  const desc     = document.getElementById('proj-desc').value.trim();
  const active   = document.getElementById('proj-active').checked;

  if (!title || !location) {
    toast('Please enter at least the Project Title and Location.', 'error');
    return;
  }
  if (!currentProjPhotos.length) {
    toast('Please add at least one photo for the project.', 'warning');
    return;
  }

  const projs = DB.getProjs();
  const city = location.split(',')[0].trim().toLowerCase();

  if (currentProjEditId) {
    const idx = projs.findIndex(p => p.id === currentProjEditId);
    if (idx >= 0) {
      projs[idx] = {
        ...projs[idx],
        title, sector, status, client, location, city, desc,
        photos: [...currentProjPhotos],
        active
      };
    }
    toast('Project updated successfully.');
  } else {
    projs.unshift({
      id: 'proj_' + Date.now(),
      title, sector, status, client, location, city, desc,
      photos: [...currentProjPhotos],
      active,
      created: new Date().toISOString()
    });
    toast('New project added successfully.');
  }

  DB.setProjs(projs);
  closeModal('proj-modal');
  renderProjects(currentProjFilter, currentProjSearch);
}

/* ==========================================
   PANEL NAVIGATION
========================================== */
let currentPanel = 'dashboard';
let currentReqFilter = 'all';
let currentReqSearch = '';
let currentAppFilter = 'all';
let currentAppSearch = '';

function switchPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));

  const panel = document.getElementById(`panel-${name}`);
  if (panel) panel.classList.add('active');
  const navItem = document.querySelector(`.sidebar-item[data-panel="${name}"]`);
  if (navItem) navItem.classList.add('active');

  document.getElementById('page-title').textContent = ({
    dashboard:    'Dashboard',
    requirements: 'Manage Requirements',
    projects:     'Landmark Projects Portfolio',
    applications: 'Applications & Inquiries',
    announcer:    'Announcement Banner',
    settings:     'Settings',
  })[name] || name;

  currentPanel = name;
  refreshCurrentPanel();

  // Mobile: close sidebar
  document.querySelector('.sidebar')?.classList.remove('mobile-open');
  document.querySelector('.sidebar-backdrop')?.classList.remove('show');
}

function refreshCurrentPanel() {
  if (currentPanel === 'dashboard')    renderDashboard();
  if (currentPanel === 'requirements') renderRequirements(currentReqFilter, currentReqSearch);
  if (currentPanel === 'projects')     renderProjects(currentProjFilter, currentProjSearch);
  if (currentPanel === 'applications') renderApplications(currentAppFilter, currentAppSearch);
  if (currentPanel === 'announcer')    renderAnnouncerPanel();
  if (currentPanel === 'settings')     renderSettings();
}

/* ==========================================
   BOOTSTRAP
========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initDB();

  /* ── Login flow ── */
  const overlay  = document.getElementById('login-overlay');
  const adminApp = document.getElementById('admin-app');

  if (isLoggedIn()) {
    overlay.style.display = 'none';
    adminApp.style.display = 'flex';
    switchPanel('dashboard');
  } else {
    overlay.style.display = 'flex';
    adminApp.style.display = 'none';
  }

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    if (login(user, pass)) {
      doLogin();
      overlay.style.display = 'none';
      adminApp.style.display = 'flex';
      switchPanel('dashboard');
    } else {
      const err = document.getElementById('login-error');
      err.style.display = 'block';
      err.textContent = 'Incorrect username or password.';
      setTimeout(() => { err.style.display = 'none'; }, 3000);
    }
  });

  /* ── Logout ── */
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirmAction('Are you sure you want to log out?')) doLogout();
  });

  /* ── Sidebar nav ── */
  document.querySelectorAll('.sidebar-item[data-panel]').forEach(item => {
    item.addEventListener('click', () => switchPanel(item.dataset.panel));
  });

  /* ── Mobile sidebar toggle ── */
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('mobile-open');
    document.querySelector('.sidebar-backdrop').classList.toggle('show');
  });
  document.querySelector('.sidebar-backdrop').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('mobile-open');
    document.querySelector('.sidebar-backdrop').classList.remove('show');
  });

  /* ── Requirements panel events ── */
  document.getElementById('btn-add-req').addEventListener('click', openAddModal);
  document.getElementById('btn-save-req').addEventListener('click', saveRequirement);
  document.getElementById('close-req-modal')?.addEventListener('click', () => closeModal('req-modal'));
  document.getElementById('req-modal')?.addEventListener('click', (e) => { if (e.target === document.getElementById('req-modal')) closeModal('req-modal'); });

  document.getElementById('req-search').addEventListener('input', (e) => {
    currentReqSearch = e.target.value;
    renderRequirements(currentReqFilter, currentReqSearch);
  });
  document.getElementById('req-filter-cat').addEventListener('change', (e) => {
    currentReqFilter = e.target.value;
    renderRequirements(currentReqFilter, currentReqSearch);
  });

  /* ── Projects panel events ── */
  document.getElementById('btn-add-proj')?.addEventListener('click', openAddProjModal);
  document.getElementById('btn-save-proj')?.addEventListener('click', saveProject);
  document.getElementById('proj-modal')?.addEventListener('click', (e) => { if (e.target === document.getElementById('proj-modal')) closeModal('proj-modal'); });

  document.getElementById('proj-search')?.addEventListener('input', (e) => {
    currentProjSearch = e.target.value;
    renderProjects(currentProjFilter, currentProjSearch);
  });
  document.getElementById('proj-filter-cat')?.addEventListener('change', (e) => {
    currentProjFilter = e.target.value;
    renderProjects(currentProjFilter, currentProjSearch);
  });

  // Photo drop zone & upload events
  const dropZone = document.getElementById('photo-drop-zone');
  const fileInput = document.getElementById('proj-file-input');

  dropZone?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    handlePhotoFiles(e.target.files);
    e.target.value = ''; // reset so same files can be re-selected if needed
  });

  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(200, 164, 93, 0.15)';
  });
  dropZone?.addEventListener('dragleave', () => {
    dropZone.style.background = '';
  });
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = '';
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handlePhotoFiles(e.dataTransfer.files);
    }
  });

  // Add Photo URL button
  document.getElementById('btn-add-photo-url')?.addEventListener('click', () => {
    const input = document.getElementById('proj-photo-url');
    const url = input?.value?.trim();
    if (!url) { toast('Please enter an image URL.', 'warning'); return; }
    currentProjPhotos.push(url);
    input.value = '';
    renderProjPhotosPreview();
    toast('Photo URL added.');
  });

  /* ── Applications events ── */
  document.getElementById('app-search').addEventListener('input', (e) => {
    currentAppSearch = e.target.value;
    renderApplications(currentAppFilter, currentAppSearch);
  });
  document.getElementById('app-filter-status').addEventListener('change', (e) => {
    currentAppFilter = e.target.value;
    renderApplications(currentAppFilter, currentAppSearch);
  });
  document.getElementById('btn-export-apps').addEventListener('click', exportApps);

  /* ── Announcer events ── */
  document.getElementById('ann-text').addEventListener('input', _updateAnnouncerPreview);
  document.getElementById('ann-style').addEventListener('change', _updateAnnouncerPreview);
  document.getElementById('btn-save-ann').addEventListener('click', saveAnnouncer);
  document.getElementById('ann-toggle-wrap').addEventListener('click', toggleAnnouncerSwitch);

  /* ── Settings events ── */
  document.getElementById('btn-save-settings').addEventListener('click', saveSettings);
  document.getElementById('btn-export-data').addEventListener('click', exportData);
  document.getElementById('btn-import-trigger').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', importData);
  document.getElementById('btn-reset-data').addEventListener('click', resetData);

  /* ── Quick action buttons ── */
  document.getElementById('qa-add-req')?.addEventListener('click', () => { switchPanel('requirements'); setTimeout(openAddModal, 100); });
  document.getElementById('qa-announcer')?.addEventListener('click', () => switchPanel('announcer'));
  document.getElementById('qa-apps')?.addEventListener('click', () => switchPanel('applications'));
  document.getElementById('qa-settings')?.addEventListener('click', () => switchPanel('settings'));
  document.getElementById('qa-homepage')?.addEventListener('click', () => window.open('index.html', '_blank'));

});
