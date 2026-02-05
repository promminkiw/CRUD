<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { api } from './lib/api';
import type { CreateUserPayload, UpdateUserPayload, User } from './types/user';

// --- State ---
const loading = ref(false);
const error = ref<string | null>(null);
const users = ref<User[]>([]);

// Modal Controls
const showAdd = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);

const selected = ref<User | null>(null);

// Forms
const addForm = reactive<CreateUserPayload>({
  email: '',
  displayName: '',
  role: 'user',
  isActive: true,
});

const editForm = reactive<UpdateUserPayload>({
  email: '',
  displayName: '',
  role: 'user',
  isActive: true,
});

// --- Computed Stats ---
const totalUsers = computed(() => users.value.length);
const activeUsers = computed(() => users.value.filter(u => u.isActive).length);
const adminUsers = computed(() => users.value.filter(u => u.role === 'admin').length);
const deleteName = computed(() => selected.value?.displayName ?? '');

// --- Helpers ---
function getAvatarColor(name: string = '?') {
  const colors = [
    '#2563EB', '#059669', '#D97706', '#DC2626', 
    '#7C3AED', '#DB2777', '#0891B2'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string = '') {
  const cleanName = name.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]/g, '');
  return (cleanName[0] ?? '?').toUpperCase();
}

// --- API Actions ---
async function fetchUsers() {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await api.get<User[]>('/users');
    users.value = data;
  } catch (e: any) {
    error.value = e?.message ?? 'Unable to fetch data';
  } finally {
    loading.value = false;
  }
}

function openAdd() {
  addForm.email = '';
  addForm.displayName = '';
  addForm.role = 'user';
  addForm.isActive = true;
  showAdd.value = true;
}

function openEdit(u: User) {
  selected.value = u;
  editForm.email = u.email;
  editForm.displayName = u.displayName;
  editForm.role = u.role;
  editForm.isActive = u.isActive;
  showEdit.value = true;
}

function openDelete(u: User) {
  selected.value = u;
  showDelete.value = true;
}

async function createUser() {
  error.value = null;
  try {
    await api.post('/users', addForm);
    showAdd.value = false;
    await fetchUsers();
  } catch (e: any) {
    error.value = e?.response?.data?.message?.toString?.() ?? e?.message ?? 'Creation failed';
  }
}

async function updateUser() {
  if (!selected.value) return;
  error.value = null;
  try {
    await api.patch(`/users/${selected.value.id}`, editForm);
    showEdit.value = false;
    selected.value = null;
    await fetchUsers();
  } catch (e: any) {
    error.value = e?.response?.data?.message?.toString?.() ?? e?.message ?? 'Update failed';
  }
}

async function deleteUser() {
  if (!selected.value) return;
  error.value = null;
  try {
    await api.delete(`/users/${selected.value.id}`);
    showDelete.value = false;
    selected.value = null;
    await fetchUsers();
  } catch (e: any) {
    error.value = e?.response?.data?.message?.toString?.() ?? e?.message ?? 'Deletion failed';
  }
}

onMounted(fetchUsers);
</script>

<template>
  <div class="app-wrapper">
    <header class="top-nav">
      <div class="nav-content">
        <div class="brand">
          <div class="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <div class="brand-text">
            <h1>Admin Portal</h1>
            <p>Management</p>
          </div>
        </div>
        <div class="nav-actions">
          <button class="btn btn-white icon-only-mobile" @click="fetchUsers" :disabled="loading" title="Refresh">
            <svg :class="{ 'spin': loading }" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span class="btn-label">Sync</span>
          </button>
          <button class="btn btn-primary icon-only-mobile" @click="openAdd">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="btn-label">New Member</span>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <Transition name="slide-fade">
        <div v-if="error" class="alert-banner">
          <div class="alert-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ error }}</span>
          </div>
          <button class="icon-btn-ghost" @click="error = null">✕</button>
        </div>
      </Transition>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Members</span>
            <span class="stat-value">{{ totalUsers }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Active Now</span>
            <span class="stat-value">{{ activeUsers }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Administrators</span>
            <span class="stat-value">{{ adminUsers }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Member List</h3>
          <span class="badge-count">{{ users.length }}</span>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td>
                  <div class="user-cell">
                    <div class="avatar" :style="{ backgroundColor: getAvatarColor(u.displayName) }">
                      {{ getInitials(u.displayName) }}
                    </div>
                    <span class="font-medium">{{ u.displayName }}</span>
                  </div>
                </td>
                <td class="text-muted">{{ u.email }}</td>
                <td>
                  <span class="role-badge" :class="u.role">{{ u.role }}</span>
                </td>
                <td>
                  <div class="status-pill" :class="{ active: u.isActive }">
                    <span class="status-dot"></span>
                    {{ u.isActive ? 'Active' : 'Inactive' }}
                  </div>
                </td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button class="icon-btn" @click="openEdit(u)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button class="icon-btn danger" @click="openDelete(u)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!loading && users.length === 0">
                <td colspan="5" class="empty-state">
                  <p>No members found.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <Transition name="fade">
      <div v-if="showAdd || showEdit || showDelete" class="modal-backdrop">
        <div v-if="showAdd || showEdit" class="modal-card">
          <div class="modal-header">
            <h3>{{ showAdd ? 'New Member' : 'Edit Profile' }}</h3>
            <button class="close-btn" @click="showAdd = showEdit = false">✕</button>
          </div>
          <div class="modal-scroll-area">
            <div class="modal-body">
              <div class="input-group">
                <label>Full Name</label>
                <input v-model="(showAdd ? addForm : editForm).displayName" type="text" placeholder="e.g. Somchai Jai-dee" class="form-input" />
              </div>
              <div class="input-group">
                <label>Email Address</label>
                <input v-model="(showAdd ? addForm : editForm).email" type="email" placeholder="email@company.com" class="form-input" />
              </div>
              <div class="grid-2">
                <div class="input-group">
                  <label>Role</label>
                  <select v-model="(showAdd ? addForm : editForm).role" class="form-select">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div class="input-group toggle-group">
                  <label>Status</label>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="(showAdd ? addForm : editForm).isActive" />
                    <span class="slider"></span>
                    <span class="toggle-label">{{ (showAdd ? addForm : editForm).isActive ? 'Active' : 'Inactive' }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="showAdd = showEdit = false">Cancel</button>
              <button class="btn btn-primary" @click="showAdd ? createUser() : updateUser()">
                {{ showAdd ? 'Save' : 'Update' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="showDelete" class="modal-card danger">
          <div class="modal-body text-center p-large">
            <div class="danger-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>Delete User?</h3>
            <p>Confirm deletion of <strong>{{ deleteName }}</strong>?</p>
            <div class="modal-actions-center">
              <button class="btn btn-ghost" @click="showDelete = false">Cancel</button>
              <button class="btn btn-danger" @click="deleteUser">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Reset */
:global(body) { margin: 0; padding: 0; background-color: #F1F5F9; font-family: 'Inter', sans-serif; }
:host, .app-wrapper {
  --primary: #2563EB; --primary-hover: #1D4ED8; --bg-page: #F1F5F9; --bg-surface: #FFFFFF;
  --text-main: #1E293B; --text-muted: #64748B; --border: #E2E8F0; --success: #10B981; --danger: #EF4444;
  color: var(--text-main); min-height: 100vh;
}

.app-wrapper { display: flex; flex-direction: column; }
.main-content { padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }

/* Header Responsive */
.top-nav { background: var(--bg-surface); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 50; }
.nav-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.brand { display: flex; align-items: center; gap: 1rem; }
.brand-logo { width: 40px; height: 40px; background: var(--primary); color: white; border-radius: 8px; display: grid; place-items: center; flex-shrink: 0; }
.brand-text h1 { font-size: 1.125rem; font-weight: 700; margin: 0; }
.brand-text p { font-size: 0.813rem; color: var(--text-muted); margin: 0; }
.nav-actions { display: flex; gap: 0.75rem; }

/* Stats Grid Responsive */
.stats-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
/* Tablet: 2 cols */
@media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
/* Desktop: 3 cols */
@media (min-width: 1024px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }

.stat-card { background: var(--bg-surface); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; }
.stat-icon { width: 48px; height: 48px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0; }
.stat-icon.blue { background: #DBEAFE; color: #2563EB; }
.stat-icon.green { background: #D1FAE5; color: #059669; }
.stat-icon.purple { background: #EDE9FE; color: #7C3AED; }
.stat-info { display: flex; flex-direction: column; }
.stat-label { font-size: 0.875rem; color: var(--text-muted); }
.stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }

/* Buttons */
.btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: 1px solid transparent; white-space: nowrap; }
.btn-primary { background: var(--primary); color: white; }
.btn-white { background: white; border-color: var(--border); color: var(--text-main); }
.btn-ghost { background: transparent; color: var(--text-muted); }
.btn-danger { background: var(--danger); color: white; width: 100%; justify-content: center; }
.icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); background: white; display: grid; place-items: center; cursor: pointer; color: var(--text-muted); }
.icon-btn:hover { border-color: var(--primary); color: var(--primary); }
.icon-btn.danger:hover { border-color: var(--danger); color: var(--danger); }
.icon-btn-ghost { background: transparent; border: none; cursor: pointer; color: white; opacity: 0.8; }

/* Table */
.card { background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
.card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.card-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
.badge-count { background: #F1F5F9; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table { width: 100%; border-collapse: collapse; min-width: 650px; /* Prevent squash on mobile */ }
.data-table th { text-align: left; padding: 0.75rem 1.5rem; background: #F8FAFC; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
.data-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
.user-cell { display: flex; align-items: center; gap: 0.75rem; }
.avatar { width: 36px; height: 36px; border-radius: 50%; color: white; display: grid; place-items: center; font-size: 0.875rem; font-weight: 600; flex-shrink: 0; }
.font-medium { font-weight: 500; }
.text-muted { color: var(--text-muted); font-size: 0.875rem; }
.text-right { text-align: right; }

.role-badge { padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.role-badge.admin { background: #FEF3C7; color: #B45309; }
.role-badge.user { background: #E2E8F0; color: #475569; }
.status-pill { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-muted); }
.status-pill.active { color: var(--success); font-weight: 500; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #CBD5E1; }
.status-pill.active .status-dot { background: var(--success); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); animation: pulse 2s infinite; }
@keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
.action-buttons { display: flex; justify-content: flex-end; gap: 0.5rem; }
.empty-state { text-align: center; padding: 3rem !important; color: var(--text-muted); }

/* Modals */
.modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
.modal-card { background: white; width: 100%; max-width: 450px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; /* Keyboard safety */ }
.modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.modal-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
.close-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1.2rem; }
.modal-scroll-area { overflow-y: auto; }
.modal-body { padding: 1.5rem; }
.modal-footer { padding: 1rem 1.5rem; background: #F8FAFC; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.75rem; }

.input-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.375rem; }
.input-group label { font-size: 0.875rem; font-weight: 500; color: #334155; }
.form-input, .form-select { padding: 0.625rem 0.875rem; border-radius: 8px; border: 1px solid var(--border); font-size: 0.938rem; width: 100%; box-sizing: border-box; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.toggle-switch { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; margin-top: auto; height: 42px; }
.toggle-switch input { display: none; }
.slider { width: 44px; height: 24px; background: #CBD5E1; border-radius: 24px; position: relative; transition: 0.3s; }
.slider::before { content: ''; position: absolute; width: 18px; height: 18px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: 0.3s; }
input:checked + .slider { background: var(--success); }
input:checked + .slider::before { transform: translateX(20px); }

.danger-icon { width: 64px; height: 64px; background: #FEF2F2; color: var(--danger); border-radius: 50%; display: grid; place-items: center; margin: 0 auto 1rem; }
.modal-actions-center { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
.alert-banner { position: fixed; top: 1rem; right: 1rem; left: 1rem; max-width: 400px; margin: 0 auto; z-index: 150; background: #1E293B; color: white; padding: 0.75rem 1rem; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.alert-content { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* Mobile Specific Tweaks */
@media (max-width: 640px) {
  .main-content { padding: 1rem; }
  .top-nav { padding: 0.75rem 1rem; }
  /* ซ่อน text ในปุ่มเมื่อจอเล็กมากๆ */
  .btn-label { display: none; }
  .btn { padding: 0.5rem; } /* ปุ่มเล็กลง */
  
  .brand-text { display: none; } /* ซ่อนชื่อแอพเหลือแต่โลโก้ถ้าจอแคบ */
  .grid-2 { grid-template-columns: 1fr; }
  .modal-actions-center { grid-template-columns: 1fr; }
}

/* Tablet (แสดงชื่อปุ่มกลับมา) */
@media (min-width: 480px) {
  .btn-label { display: inline; }
  .btn { padding: 0.5rem 1rem; }
  .brand-text { display: block; }
}
</style>