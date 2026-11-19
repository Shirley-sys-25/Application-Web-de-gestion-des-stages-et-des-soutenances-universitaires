(() => {
  'use strict';

  /* =====================================================================
     Constantes et état
     ===================================================================== */

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const STATUSES = ['BROUILLON', 'SOUMISE', 'VALIDEE', 'REFUSEE'];
  const STATUS_LABELS = {
    BROUILLON: 'Brouillon',
    SOUMISE: 'Soumise',
    VALIDEE: 'Validée',
    REFUSEE: 'Refusée',
  };
  const STATUS_CLASSES = {
    BROUILLON: 'badge--brouillon',
    SOUMISE: 'badge--soumise',
    VALIDEE: 'badge--validee',
    REFUSEE: 'badge--refusee',
  };
  const ROLE_LABELS = {
    ETUDIANT: 'Étudiant',
    RESPONSABLE: 'Responsable pédagogique',
    ADMINISTRATEUR: 'Administrateur',
    DEVELOPPEUR: 'Développeur',
  };
  const SESSION_LABEL = 'Année universitaire 2026–2027';

  const state = {
    user: null,
    lastDecision: null,
    routeToken: 0,
    toastTimer: null,
  };

  const app = document.getElementById('app');
  const toastRegion = document.getElementById('toast-region');

  /* =====================================================================
     Icônes SVG locales (aucune police externe)
     ===================================================================== */

  const ICONS = {
    cap: '<path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 9v6"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>',
    plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4"/>',
    logout: '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    building: '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M8 7h3M8 11h3M8 15h3M2 21h20"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
    alert: '<path d="M10.3 3.7L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    lock: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    spark: '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 6.2A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a17.6 17.6 0 0 1-3.1 3.7"/><path d="M6.6 6.6C3.6 8.4 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    arrowUpRight: '<path d="M7 17L17 7M7 7h10v10"/>',
  };

  function iconEl(name, className = 'icon') {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.innerHTML = ICONS[name] || '';
    return svg;
  }

  /* =====================================================================
     Utilitaires DOM et texte
     ===================================================================== */

  function appendChildren(node, children) {
    children.flat(Infinity).forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      if (Array.isArray(child)) {
        appendChildren(node, child);
        return;
      }
      if (child instanceof Node) {
        node.append(child);
      } else {
        node.append(document.createTextNode(String(child)));
      }
    });
  }

  function h(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(props || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;

      if (key === 'class') {
        node.className = value;
      } else if (key === 'text') {
        node.textContent = value;
      } else if (key === 'dataset') {
        Object.assign(node.dataset, value);
      } else if (key === 'on') {
        Object.entries(value).forEach(([eventName, handler]) => {
          node.addEventListener(eventName, handler);
        });
      } else if (key === 'attrs') {
        Object.entries(value).forEach(([attr, attrValue]) => {
          if (attrValue !== null && attrValue !== undefined && attrValue !== false) {
            node.setAttribute(attr, String(attrValue));
          }
        });
      } else if (key === 'checked' || key === 'selected' || key === 'disabled' || key === 'readOnly' || key === 'required' || key === 'hidden') {
        node[key] = Boolean(value);
      } else {
        node.setAttribute(key, String(value));
      }
    });
    appendChildren(node, children);
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function normalizeText(value) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function fullName(person) {
    if (!person) return '—';
    const nom = person.nom ? String(person.nom) : '';
    const prenom = person.prenom ? String(person.prenom) : '';
    return [nom, prenom].filter(Boolean).join(' ') || '—';
  }

  function displayName(person) {
    if (!person) return '—';
    const full = fullName(person);
    if (full !== '—') return full;
    if (person.email) return String(person.email);
    return roleLabel(person.role);
  }

  function initials(person) {
    const nom = person && person.nom ? String(person.nom).trim() : '';
    const prenom = person && person.prenom ? String(person.prenom).trim() : '';
    const fromName = [nom, prenom].filter(Boolean).map((part) => part[0]).join('');
    const fromEmail = person && person.email
      ? String(person.email).split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 2)
      : '';
    return (fromName || fromEmail || 'US').slice(0, 2).toUpperCase();
  }

  function roleLabel(role) {
    return ROLE_LABELS[role] || role;
  }

  function statusLabel(statut) {
    return STATUS_LABELS[statut] || statut || '—';
  }

  function statusBadge(statut) {
    return h('span', { class: `badge ${STATUS_CLASSES[statut] || 'badge--neutral'}` },
      h('span', { class: 'dot', attrs: { 'aria-hidden': 'true' } }),
      h('span', { text: statusLabel(statut) }),
    );
  }

  function formatDateShort(value) {
    const date = parseDate(value);
    if (!date) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  function formatDateLong(value) {
    const date = parseDate(value);
    if (!date) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  function formatDateTime(value) {
    const date = parseDate(value);
    if (!date) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    const date = new Date(String(value).replace(' ', 'T'));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function countStatuses(demandes) {
    const counts = { BROUILLON: 0, SOUMISE: 0, VALIDEE: 0, REFUSEE: 0, TOTAL: 0 };
    demandes.forEach((demande) => {
      if (Object.prototype.hasOwnProperty.call(counts, demande.statut)) {
        counts[demande.statut] += 1;
      }
      counts.TOTAL += 1;
    });
    return counts;
  }

  function latestDecisionDate(demandes) {
    const dates = demandes
      .filter((demande) => demande.statut === 'VALIDEE')
      .map((demande) => parseDate(demande.date_decision))
      .filter(Boolean)
      .sort((a, b) => b.getTime() - a.getTime());
    return dates.length ? dates[0] : null;
  }

  function firstRefusalMotif(demandes) {
    const refused = demandes.find((demande) => demande.statut === 'REFUSEE' && demande.motif_refus);
    return refused ? String(refused.motif_refus) : null;
  }

  function plural(count, singular, pluralForm) {
    return `${count} ${count > 1 ? pluralForm : singular}`;
  }

  function setDocumentTitle(title) {
    document.title = title ? `${title} — UniStage` : 'UniStage — Portail des stages et soutenances';
  }

  function focusMain(main) {
    window.requestAnimationFrame(() => {
      try {
        main.focus({ preventScroll: true });
      } catch (_) {
        main.focus();
      }
    });
  }

  function setBusy(button, busy, busyLabel) {
    if (!button) return;
    button.disabled = busy;
    button.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (busy) {
      if (!button.dataset.originalHtml) {
        button.dataset.originalHtml = button.innerHTML;
      }
      clear(button);
      button.append(h('span', { class: 'spinner', attrs: { 'aria-hidden': 'true' } }));
      button.append(document.createTextNode(busyLabel || 'Traitement…'));
    } else if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
      delete button.dataset.originalHtml;
    }
  }

  function showInlineAlert(container, message, variant = 'error') {
    if (!container) return;
    container.hidden = false;
    container.className = `alert alert-${variant}`;
    clear(container);
    container.append(iconEl(variant === 'success' ? 'checkCircle' : variant === 'warning' ? 'alert' : 'alert'));
    container.append(h('div', { text: message }));
    container.setAttribute('tabindex', '-1');
    container.focus({ preventScroll: true });
  }

  function hideInlineAlert(container) {
    if (!container) return;
    container.hidden = true;
    clear(container);
  }

  /* =====================================================================
     Toast
     ===================================================================== */

  function showToast(message, variant = 'success') {
    if (!toastRegion) return;
    clearTimeout(state.toastTimer);
    clear(toastRegion);

    const toast = h('div', { class: `toast${variant === 'error' ? ' toast--error' : ''}`, attrs: { role: 'status' } },
      iconEl(variant === 'error' ? 'alert' : 'checkCircle'),
      h('span', { text: message }),
      h('button', {
        class: 'toast-close',
        type: 'button',
        attrs: { 'aria-label': 'Fermer la notification' },
        on: { click: () => clear(toastRegion) },
      }, iconEl('x', 'icon icon-sm')),
    );
    toastRegion.append(toast);
    state.toastTimer = window.setTimeout(() => clear(toastRegion), 5000);
  }

  /* =====================================================================
     API
     ===================================================================== */

  class ApiError extends Error {
    constructor(message, status, data) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  }

  async function api(path, options = {}) {
    const method = options.method || 'GET';
    const headers = {
      Accept: 'application/json',
      ...(options.headers || {}),
    };
    const fetchOptions = {
      method,
      credentials: 'same-origin',
      headers,
    };

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(options.body);
    }

    let response;
    try {
      response = await fetch(path, fetchOptions);
    } catch (_) {
      throw new ApiError('Impossible de contacter le serveur. Vérifiez votre connexion puis réessayez.', 0, null);
    }

    const raw = await response.text();
    let data = null;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (_) {
        data = null;
      }
    }

    if (!response.ok) {
      const message = data && typeof data.erreur === 'string'
        ? data.erreur
        : `Erreur HTTP ${response.status}.`;
      throw new ApiError(message, response.status, data);
    }

    return data;
  }

  function errorText(error) {
    if (error instanceof ApiError) return error.message;
    if (error && error.message) return error.message;
    return 'Une erreur inattendue est survenue. Réessayez.';
  }

  function handleSessionExpired() {
    state.user = null;
    state.lastDecision = null;
    if (currentPath() !== '/connexion') {
      navigate('/connexion');
    }
    showToast('Votre session a expiré. Reconnectez-vous.', 'error');
  }

  /* =====================================================================
     Routes
     ===================================================================== */

  function homeForRole(user) {
    if (!user) return '/connexion';
    if (user.role === 'ETUDIANT') return '/etudiant/demandes';
    if (user.role === 'RESPONSABLE' || user.role === 'ADMINISTRATEUR') return '/responsable/demandes';
    return '/acces-refuse';
  }

  function currentPath() {
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw) return '/';
    return raw.startsWith('/') ? raw : `/${raw}`;
  }

  function navigate(path) {
    const target = `#${path.startsWith('/') ? path : `/${path}`}`;
    if (window.location.hash === target) {
      route();
      return;
    }
    window.location.hash = target;
  }

  async function bootstrap() {
    try {
      const data = await api('/api/moi');
      state.user = data && data.utilisateur ? data.utilisateur : null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        state.user = null;
      } else {
        state.user = null;
      }
    }

    if (!window.location.hash) {
      const start = state.user ? homeForRole(state.user) : '/connexion';
      window.history.replaceState(null, '', `#${start}`);
    }

    window.addEventListener('hashchange', route);
    route();
  }

  async function route() {
    const token = ++state.routeToken;
    const path = currentPath();

    if (!state.user) {
      if (path !== '/connexion') {
        navigate('/connexion');
        return;
      }
      renderLogin(token);
      return;
    }

    if (path === '/connexion' || path === '/' || path === '') {
      navigate(homeForRole(state.user));
      return;
    }

    if (path === '/acces-refuse') {
      renderAccessDenied();
      return;
    }

    const isStudent = state.user.role === 'ETUDIANT';
    const isResponsable = state.user.role === 'RESPONSABLE' || state.user.role === 'ADMINISTRATEUR';

    if (path.startsWith('/etudiant/') && !isStudent) {
      showToast('Cet espace est réservé aux étudiants.', 'error');
      navigate(homeForRole(state.user));
      return;
    }

    if (path.startsWith('/responsable/') && !isResponsable) {
      showToast('Cet espace est réservé au responsable pédagogique.', 'error');
      navigate(homeForRole(state.user));
      return;
    }

    if (path === '/etudiant/demandes') {
      renderStudentDemandes(token);
      return;
    }

    if (path === '/etudiant/nouvelle-demande') {
      renderNewDemande(token);
      return;
    }

    const detailMatch = path.match(/^\/etudiant\/demandes\/(\d+)$/);
    if (detailMatch) {
      renderStudentDetail(Number(detailMatch[1]), token);
      return;
    }

    if (path === '/responsable/demandes') {
      renderResponsableDemandes(token);
      return;
    }

    const decisionMatch = path.match(/^\/responsable\/demandes\/(\d+)\/decision$/);
    if (decisionMatch) {
      renderDecision(Number(decisionMatch[1]), token);
      return;
    }

    if (path === '/responsable/confirmation') {
      renderConfirmation();
      return;
    }

    renderNotFound();
  }

  /* =====================================================================
     Connexion
     ===================================================================== */

  function renderLogin() {
    setDocumentTitle('Connexion');
    state.lastDecision = null;

    const emailInput = h('input', {
      class: 'input',
      id: 'login-email',
      name: 'email',
      type: 'email',
      autocomplete: 'email',
      placeholder: 'prenom.nom@univ.test',
      required: true,
      attrs: { 'aria-describedby': 'login-email-hint' },
    });

    const passwordInput = h('input', {
      class: 'input',
      id: 'login-password',
      name: 'mot_de_passe',
      type: 'password',
      autocomplete: 'current-password',
      placeholder: 'Votre mot de passe',
      required: true,
    });

    const errorBox = h('div', {
      class: 'alert alert-error',
      id: 'login-error',
      role: 'alert',
      hidden: true,
    });

    const togglePassword = h('button', {
      class: 'icon-btn',
      type: 'button',
      id: 'toggle-password',
      attrs: { 'aria-label': 'Afficher le mot de passe', 'aria-pressed': 'false' },
    }, iconEl('eye'));

    togglePassword.addEventListener('click', () => {
      const showing = passwordInput.type === 'text';
      passwordInput.type = showing ? 'password' : 'text';
      togglePassword.setAttribute('aria-label', showing ? 'Afficher le mot de passe' : 'Masquer le mot de passe');
      togglePassword.setAttribute('aria-pressed', showing ? 'false' : 'true');
      clear(togglePassword);
      togglePassword.append(iconEl(showing ? 'eye' : 'eyeOff'));
    });

    const submitButton = h('button', {
      class: 'btn btn-primary btn-block',
      type: 'submit',
      id: 'login-submit',
    }, h('span', { text: 'Se connecter' }), iconEl('arrowRight'));

    const form = h('form', {
      class: 'login-form',
      id: 'login-form',
      novalidate: '',
      on: {
        submit: async (event) => {
          event.preventDefault();
          hideInlineAlert(errorBox);
          emailInput.removeAttribute('aria-invalid');
          passwordInput.removeAttribute('aria-invalid');

          const email = emailInput.value.trim();
          const password = passwordInput.value;

          if (!email) {
            emailInput.setAttribute('aria-invalid', 'true');
            showInlineAlert(errorBox, 'Le champ email est obligatoire.');
            emailInput.focus();
            return;
          }

          if (!email.includes('@')) {
            emailInput.setAttribute('aria-invalid', 'true');
            showInlineAlert(errorBox, 'Adresse email invalide.');
            emailInput.focus();
            return;
          }

          if (!password) {
            passwordInput.setAttribute('aria-invalid', 'true');
            showInlineAlert(errorBox, 'Le champ mot de passe est obligatoire.');
            passwordInput.focus();
            return;
          }

          setBusy(submitButton, true, 'Connexion…');
          try {
            const data = await api('/api/connexion', {
              method: 'POST',
              body: { email, mot_de_passe: password },
            });
            state.user = data.utilisateur;
            showToast(`Bienvenue ${displayName(state.user)}.`, 'success');
            navigate(homeForRole(state.user));
          } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
              emailInput.setAttribute('aria-invalid', 'true');
              passwordInput.setAttribute('aria-invalid', 'true');
              showInlineAlert(errorBox, 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.');
            } else {
              showInlineAlert(errorBox, errorText(error));
            }
          } finally {
            setBusy(submitButton, false);
          }
        },
      },
    },
      h('div', { class: 'field' },
        h('label', { for: 'login-email' },
          h('span', {}, 'Adresse email universitaire ', h('span', { class: 'required', text: '*' })),
          h('span', { class: 'field-hint', id: 'login-email-hint', text: 'Format : @univ.test' }),
        ),
        emailInput,
      ),
      h('div', { class: 'field' },
        h('label', { for: 'login-password' },
          h('span', {}, 'Mot de passe ', h('span', { class: 'required', text: '*' })),
        ),
        h('div', { class: 'relative-field' }, passwordInput, togglePassword),
      ),
      errorBox,
      submitButton,
    );

    const demoStudent = h('button', {
      class: 'demo-card',
      type: 'button',
      on: {
        click: () => {
          emailInput.value = 'etudiant1@univ.test';
          passwordInput.value = 'etudiant123';
          hideInlineAlert(errorBox);
          passwordInput.focus();
        },
      },
    },
      h('span', { class: 'demo-role', text: 'Étudiant' }),
      h('strong', { text: 'ADJOVI Koffi' }),
      h('span', { text: 'etudiant1@univ.test' }),
      h('span', { text: 'MDP : etudiant123' }),
    );

    const demoResponsable = h('button', {
      class: 'demo-card',
      type: 'button',
      on: {
        click: () => {
          emailInput.value = 'responsable@univ.test';
          passwordInput.value = 'responsable123';
          hideInlineAlert(errorBox);
          passwordInput.focus();
        },
      },
    },
      h('span', { class: 'demo-role', text: 'Resp. pédagogique' }),
      h('strong', { text: 'Responsable pédagogique' }),
      h('span', { text: 'responsable@univ.test' }),
      h('span', { text: 'MDP : responsable123' }),
    );

    const page = h('div', { class: 'login-page' },
      h('section', { class: 'login-brand', attrs: { 'aria-labelledby': 'login-brand-title' } },
        h('div', {},
          h('div', { class: 'brand-lockup' },
            h('span', { class: 'brand-logo' }, iconEl('cap', 'icon')),
            h('span', {},
              h('span', { class: 'brand-name', text: 'UniStage' }),
              h('span', { class: 'brand-kicker', text: 'Portail officiel des Stages & Soutenances' }),
            ),
          ),
          h('div', { class: 'session-pill' }, h('span', { class: 'dot', attrs: { 'aria-hidden': 'true' } }), 'Session académique 2026-2027'),
        ),
        h('div', { class: 'login-copy' },
          h('h1', { id: 'login-brand-title', text: 'Déposez et suivez votre demande de stage en toute simplicité.' }),
          h('p', { text: 'Plateforme centralisée pour la soumission et le suivi des demandes de stage, avec validation pédagogique.' }),
          h('ul', { class: 'feature-list' },
            featureItem('spark', 'Dépôt rapide en quelques clics', 'Formulaire simplifié avec pré-remplissage des informations étudiant.'),
            featureItem('clock', 'Suivi du statut en temps réel', 'Suivi du statut : soumise, validée ou refusée.'),
            featureItem('shield', 'Validation officielle par votre responsable SIL', 'Décision enregistrée par le responsable pédagogique.'),
          ),
        ),
        h('div', { class: 'login-brand-footer' },
          h('span', { text: 'Département Informatique & Génie Logiciel' }),
          h('span', { text: '© 2026 UniStage' }),
        ),
      ),
      h('section', { class: 'login-panel', attrs: { 'aria-labelledby': 'login-title' } },
        h('div', { class: 'login-card' },
          h('p', { class: 'eyebrow' }, iconEl('lock', 'icon icon-sm'), ' Espace sécurisé'),
          h('h2', { id: 'login-title', text: 'Connexion à votre espace' }),
          h('p', { class: 'muted', text: 'Accédez à votre dossier de stage.' }),
          form,
          h('div', { class: 'demo-accounts' },
            h('div', { class: 'demo-accounts-head' },
              h('span', { text: 'Comptes de démonstration' }),
              h('span', { text: 'Cliquez pour tester' }),
            ),
            h('div', { class: 'demo-grid' }, demoStudent, demoResponsable),
          ),
          h('p', { class: 'login-footnote', text: 'Données fictives • Projet universitaire L3 SIL • Université de Démonstration' }),
        ),
      ),
    );

    app.replaceChildren(page);
    focusMain(page.querySelector('.login-card'));
    emailInput.focus({ preventScroll: true });
  }

  function featureItem(iconName, title, text) {
    return h('li', { class: 'feature-item' },
      h('span', { class: 'icon-box' }, iconEl(iconName, 'icon icon-sm')),
      h('span', {},
        h('strong', { text: title }),
        h('span', { text }),
      ),
    );
  }

  /* =====================================================================
     Coque de l'application
     ===================================================================== */

  function createShell({ user, active, breadcrumb, head }) {
    const navItems = user.role === 'ETUDIANT'
      ? [
          { key: 'demandes', label: 'Mes demandes', href: '#/etudiant/demandes', icon: 'folder' },
          { key: 'nouvelle', label: 'Nouvelle demande', href: '#/etudiant/nouvelle-demande', icon: 'plus' },
        ]
      : [
          { key: 'demandes', label: 'Demandes à traiter', href: '#/responsable/demandes', icon: 'clipboard' },
        ];

    const navList = h('ul', { class: 'nav-list' },
      navItems.map((item) => h('li', {},
        h('a', {
          class: 'nav-link',
          href: item.href,
          attrs: item.key === active ? { 'aria-current': 'page' } : {},
        }, iconEl(item.icon), h('span', { text: item.label })),
      )),
    );

    const sidebar = h('aside', { class: 'sidebar', attrs: { 'aria-label': 'Navigation principale' } },
      h('a', { class: 'brand-lockup', href: homeForRole(user) },
        h('span', { class: 'brand-logo' }, iconEl('cap', 'icon')),
        h('span', {},
          h('span', { class: 'brand-name', text: 'UniStage' }),
          h('span', { class: 'brand-kicker', text: 'Portail Stages & Soutenances' }),
        ),
      ),
      h('nav', { class: 'nav', attrs: { 'aria-labelledby': 'nav-label' } },
        h('p', { class: 'nav-label', id: 'nav-label', text: 'Menu principal' }),
        navList,
      ),
      h('div', { class: 'sidebar-footer' },
        h('div', { class: 'user-mini' },
          h('span', { class: `avatar${user.role === 'ETUDIANT' ? '' : ' avatar--green'}`, text: initials(user) }),
          h('span', { class: 'user-mini-text' },
            h('strong', { text: displayName(user) }),
            h('span', { text: roleLabel(user.role) }),
          ),
          h('button', {
            class: 'icon-btn',
            type: 'button',
            attrs: { 'aria-label': 'Se déconnecter', 'data-logout': 'true' },
            on: { click: logout },
          }, iconEl('logout')),
        ),
      ),
    );

    const breadcrumbNav = h('nav', { class: 'breadcrumb', attrs: { 'aria-label': 'Fil d’Ariane' } },
      breadcrumb.map((item, index) => {
        const nodes = [];
        if (index > 0) nodes.push(h('span', { class: 'sep', attrs: { 'aria-hidden': 'true' }, text: '/' }));
        if (item.href) {
          nodes.push(h('a', { href: item.href, text: item.label }));
        } else {
          nodes.push(h('span', { class: 'current', attrs: { 'aria-current': 'page' }, text: item.label }));
        }
        return nodes;
      }),
    );

    const topbar = h('header', { class: 'topbar' },
      breadcrumbNav,
      h('div', { class: 'topbar-user' },
        h('span', { class: `avatar${user.role === 'ETUDIANT' ? '' : ' avatar--green'}`, text: initials(user) }),
        h('div', { class: 'topbar-user-text' },
          h('strong', { text: displayName(user) }),
          h('span', { text: roleLabel(user.role) }),
        ),
        h('button', {
          class: 'icon-btn',
          type: 'button',
          attrs: { 'aria-label': 'Se déconnecter', 'data-logout': 'true' },
          on: { click: logout },
        }, iconEl('logout')),
      ),
    );

    const main = h('main', {
      class: 'main',
      id: 'contenu',
      tabindex: '-1',
    }, head);

    if (head && head.querySelector && head.querySelector('#page-title')) {
      main.setAttribute('aria-labelledby', 'page-title');
    }

    const workspace = h('div', { class: 'workspace' }, topbar, main);
    const root = h('div', { class: 'app-shell' }, sidebar, workspace);
    app.replaceChildren(root);
    focusMain(main);
    return { root, main };
  }

  function pageHead({ context, eyebrow, title, subtitle, actions }) {
    const text = h('div', {},
      context && context.length ? h('div', { class: 'page-context' }, context.map((item) => (
        item instanceof Node ? item : h('span', { class: 'context-pill', text: item })
      ))) : null,
      eyebrow ? h('p', { class: 'eyebrow', text: eyebrow }) : null,
      h('h1', { id: 'page-title', tabindex: '-1', text: title }),
      subtitle ? h('p', { class: 'page-subtitle', text: subtitle }) : null,
    );

    return h('div', { class: 'page-head' },
      text,
      actions ? h('div', { class: 'page-actions' }, actions) : null,
    );
  }

  async function logout() {
    try {
      await api('/api/deconnexion', { method: 'POST' });
    } catch (_) {
      // La session est considérée fermée côté client même si le serveur est indisponible.
    }
    state.user = null;
    state.lastDecision = null;
    navigate('/connexion');
    showToast('Vous êtes déconnecté.', 'success');
  }

  function renderAccessDenied() {
    setDocumentTitle('Accès refusé');
    const page = h('div', { class: 'login-page login-page--denied' },
      h('section', { class: 'login-panel' },
        h('div', { class: 'login-card login-card--centered' },
          h('span', { class: 'icon-box icon-box--red' }, iconEl('lock')),
          h('h2', { text: 'Accès métier indisponible' }),
          h('p', { class: 'muted', text: 'Ce compte n’a pas accès aux espaces étudiant ou responsable du TP7.' }),
          h('button', { class: 'btn btn-primary btn-block', type: 'button', on: { click: logout } }, 'Se déconnecter'),
        ),
      ),
    );
    app.replaceChildren(page);
  }

  /* =====================================================================
     Étudiant — mes demandes
     ===================================================================== */

  async function renderStudentDemandes(token) {
    const numeroPill = h('span', { class: 'context-pill context-pill--primary', text: 'Étudiant' });
    const head = pageHead({
      context: [numeroPill, h('span', { class: 'context-pill', text: SESSION_LABEL })],
      title: `Bonjour ${state.user.prenom || ''} 👋`.trim(),
      subtitle: 'Voici l’état de vos demandes de stage pour l’année universitaire 2026-2027.',
      actions: h('a', { class: 'btn btn-primary', href: '#/etudiant/nouvelle-demande' }, iconEl('plus'), 'Nouvelle demande'),
    });

    const shell = createShell({
      user: state.user,
      active: 'demandes',
      breadcrumb: [{ label: 'Mes demandes', href: '#/etudiant/demandes' }, { label: 'Suivi des dossiers' }],
      head,
    });

    const content = h('div', { class: 'stack' });
    shell.main.append(content);
    content.append(loadingCard('Chargement de vos demandes…'));
    setDocumentTitle('Mes demandes');

    try {
      const demandes = await api('/api/demandes/mes-demandes');
      if (token !== state.routeToken) return;

      const numero = demandes.find((demande) => demande.etudiant && demande.etudiant.numero_etudiant);
      if (numero) {
        numeroPill.textContent = `${numero.etudiant.numero_etudiant} • Étudiant`;
      }

      content.replaceChildren(...buildStudentDemandesContent(demandes));
    } catch (error) {
      if (token !== state.routeToken) return;
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }
      content.replaceChildren(errorCard(errorText(error), () => renderStudentDemandes(++state.routeToken)));
    }
  }

  function buildStudentDemandesContent(demandes) {
    const counts = countStatuses(demandes);
    const nodes = [];

    const kpiGrid = h('div', { class: 'kpi-grid' },
      kpiCard({
        variant: 'muted',
        icon: 'file',
        label: 'Brouillon',
        value: counts.BROUILLON,
        sub: counts.BROUILLON > 1 ? 'dossiers en cours de saisie' : counts.BROUILLON === 1 ? 'dossier en cours de saisie' : 'aucun brouillon',
        foot: 'Dossier non soumis',
      }),
      kpiCard({
        variant: 'primary',
        icon: 'send',
        label: 'Soumise',
        value: counts.SOUMISE,
        sub: counts.SOUMISE > 1 ? 'demandes en cours d’instruction' : counts.SOUMISE === 1 ? 'demande en cours d’instruction' : 'aucune demande en cours',
        foot: 'Responsable pédagogique',
      }),
      kpiCard({
        variant: 'green',
        icon: 'checkCircle',
        label: 'Validée',
        value: counts.VALIDEE,
        sub: counts.VALIDEE > 1 ? 'demandes validées' : counts.VALIDEE === 1 ? 'demande validée' : 'aucune demande validée',
        foot: counts.VALIDEE > 0 ? 'Décision enregistrée' : 'Aucune décision',
      }),
      kpiCard({
        variant: 'red',
        icon: 'xCircle',
        label: 'Refusée',
        value: counts.REFUSEE,
        sub: counts.REFUSEE > 1 ? 'dossiers refusés' : counts.REFUSEE === 1 ? 'dossier refusé' : 'aucun refus',
        foot: firstRefusalMotif(demandes) || 'Aucun motif enregistré',
      }),
    );
    nodes.push(kpiGrid);

    const rows = demandes.map((demande) => studentRow(demande));
    const table = h('table', { class: 'data-table' },
      h('caption', { class: 'sr-only', text: 'Liste de vos demandes de stage' }),
      h('thead', {},
        h('tr', {},
          h('th', { scope: 'col', text: 'Entreprise' }),
          h('th', { scope: 'col', text: 'Ville' }),
          h('th', { scope: 'col', text: 'Date de dépôt' }),
          h('th', { scope: 'col', text: 'Statut' }),
          h('th', { scope: 'col', class: 'action-cell', text: 'Actions' }),
        ),
      ),
      h('tbody', {}, rows),
    );

    const empty = h('div', { class: 'empty-state', hidden: demandes.length > 0 },
      h('span', { class: 'icon-box' }, iconEl('folder')),
      h('h3', { text: 'Aucune demande pour le moment' }),
      h('p', { text: 'Vous n’avez encore déposé aucune demande de stage. Créez votre première demande en quelques clics.' }),
      h('a', { class: 'btn btn-primary btn-sm', href: '#/etudiant/nouvelle-demande' }, iconEl('plus'), 'Nouvelle demande'),
    );

    const tableCard = h('section', { class: 'glass-card table-card', attrs: { 'aria-labelledby': 'student-table-title' } },
      h('h2', { class: 'sr-only', id: 'student-table-title', text: 'Tableau de vos demandes' }),
      h('div', { class: 'toolbar' },
        h('div', { class: 'field search-field' },
          h('label', { class: 'sr-only', for: 'student-search', text: 'Rechercher une demande' }),
          iconEl('search'),
          h('input', {
            class: 'input',
            id: 'student-search',
            type: 'search',
            placeholder: 'Rechercher une entreprise, une ville…',
            autocomplete: 'off',
          }),
        ),
        h('div', { class: 'filter-tabs', attrs: { role: 'group', 'aria-label': 'Filtrer par statut' } }),
      ),
      h('div', { class: 'table-card-head' },
        h('span', { id: 'student-results-count', text: plural(demandes.length, 'demande', 'demandes') }),
        h('span', { text: 'Cliquez sur « Voir » pour ouvrir le détail.' }),
      ),
      h('div', { class: 'table-wrap' }, table),
      empty,
    );

    const tabs = tableCard.querySelector('.filter-tabs');
    let activeStatus = 'ALL';
    let query = '';

    const filterButtons = [
      ['ALL', 'Tous les statuts'],
      ['BROUILLON', 'Brouillon'],
      ['SOUMISE', 'Soumise'],
      ['VALIDEE', 'Validée'],
      ['REFUSEE', 'Refusée'],
    ].map(([value, label]) => h('button', {
      class: 'filter-tab',
      type: 'button',
      attrs: { 'aria-pressed': value === activeStatus ? 'true' : 'false', 'data-status': value },
      on: {
        click: () => {
          activeStatus = value;
          filterButtons.forEach((button) => {
            button.setAttribute('aria-pressed', button.dataset.status === value ? 'true' : 'false');
          });
          applyFilter();
        },
      },
    }, label));

    tabs.append(...filterButtons);

    const searchInput = tableCard.querySelector('#student-search');
    const resultsCount = tableCard.querySelector('#student-results-count');
    const emptyTitle = empty.querySelector('h3');
    const emptyText = empty.querySelector('p');

    function applyFilter() {
      const normalizedQuery = normalizeText(query);
      let visible = 0;
      rows.forEach((row) => {
        const matchesStatus = activeStatus === 'ALL' || row.dataset.status === activeStatus;
        const matchesQuery = !normalizedQuery || row.dataset.search.includes(normalizedQuery);
        const show = matchesStatus && matchesQuery;
        row.hidden = !show;
        if (show) visible += 1;
      });

      resultsCount.textContent = plural(visible, 'demande', 'demandes');
      table.hidden = visible === 0;
      empty.hidden = visible > 0;

      if (demandes.length === 0) {
        emptyTitle.textContent = 'Aucune demande pour le moment';
        emptyText.textContent = 'Vous n’avez encore déposé aucune demande de stage. Créez votre première demande en quelques clics.';
      } else if (visible === 0) {
        emptyTitle.textContent = 'Aucun résultat';
        emptyText.textContent = 'Aucune demande ne correspond à votre recherche ou au filtre sélectionné.';
      }
    }

    searchInput.addEventListener('input', () => {
      query = searchInput.value;
      applyFilter();
    });

    applyFilter();

    nodes.push(tableCard);
    nodes.push(h('section', { class: 'glass-card support-card' },
      h('div', { class: 'cell-strong' },
        h('span', { class: 'icon-box' }, iconEl('book')),
        h('div', {},
          h('h2', { text: 'Besoin de déposer une autre demande ?' }),
          h('p', { text: 'Vous pouvez créer une nouvelle demande de stage pour une autre entreprise.' }),
        ),
      ),
      h('a', { class: 'btn btn-secondary', href: '#/etudiant/nouvelle-demande' }, 'Nouvelle demande'),
    ));

    return nodes;
  }

  function studentRow(demande) {
    const search = normalizeText([
      demande.id,
      demande.entreprise && demande.entreprise.nom,
      demande.entreprise && demande.entreprise.ville,
      demande.statut,
      demande.motif_refus,
    ].join(' '));

    const statusCell = h('div', { class: 'status-cell' }, statusBadge(demande.statut));
    if (demande.motif_refus) {
      statusCell.append(h('span', { class: 'motif', text: demande.motif_refus }));
    }

    return h('tr', {
      dataset: { status: demande.statut, search },
    },
      h('td', {},
        h('div', { class: 'cell-strong' },
          h('span', { class: 'icon-box' }, iconEl('building')),
          h('div', { class: 'cell-stack' },
            h('strong', { text: demande.entreprise ? demande.entreprise.nom : '—' }),
            h('span', { text: `Demande #${demande.id}` }),
          ),
        ),
      ),
      h('td', {},
        h('span', { class: 'cell-stack' },
          h('span', { text: demande.entreprise ? demande.entreprise.ville : '—' }),
        ),
      ),
      h('td', { text: formatDateShort(demande.date_depot) }),
      h('td', {}, statusCell),
      h('td', { class: 'action-cell' },
        h('a', { class: 'btn btn-secondary btn-sm', href: `#/etudiant/demandes/${demande.id}` }, 'Voir', iconEl('arrowRight', 'icon icon-sm')),
      ),
    );
  }

  /* =====================================================================
     Étudiant — détail d'une demande
     ===================================================================== */

  async function renderStudentDetail(id, token) {
    const head = pageHead({
      context: [h('span', { class: 'context-pill context-pill--primary', text: `Demande #${id}` }), h('span', { class: 'context-pill', text: SESSION_LABEL })],
      title: 'Détail de la demande',
      subtitle: 'Récapitulatif des informations enregistrées pour votre demande.',
      actions: h('a', { class: 'btn btn-secondary', href: '#/etudiant/demandes' }, iconEl('arrowLeft'), 'Retour à mes demandes'),
    });

    const shell = createShell({
      user: state.user,
      active: 'demandes',
      breadcrumb: [{ label: 'Mes demandes', href: '#/etudiant/demandes' }, { label: `Demande #${id}` }],
      head,
    });

    const content = h('div', { class: 'stack' });
    shell.main.append(content);
    content.append(loadingCard('Chargement du dossier…'));
    setDocumentTitle(`Demande #${id}`);

    try {
      const demandes = await api('/api/demandes/mes-demandes');
      if (token !== state.routeToken) return;

      const demande = demandes.find((item) => Number(item.id) === Number(id));
      if (!demande) {
        content.replaceChildren(errorCard('Cette demande est introuvable ou ne vous appartient pas.', () => navigate('/etudiant/demandes')));
        return;
      }

      content.replaceChildren(...buildStudentDetailContent(demande));
    } catch (error) {
      if (token !== state.routeToken) return;
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }
      content.replaceChildren(errorCard(errorText(error), () => renderStudentDetail(id, ++state.routeToken)));
    }
  }

  function buildStudentDetailContent(demande) {
    const next = nextStepFor(demande);
    const motif = demande.motif_refus ? String(demande.motif_refus) : null;

    const head = h('div', { class: 'glass-card detail-head' },
      h('div', { class: 'detail-title' },
        h('h2', { text: `Demande de stage #${demande.id}` }),
        statusBadge(demande.statut),
      ),
      h('div', { class: 'status-box' },
        h('span', { class: 'icon-box' }, iconEl('clipboard')),
        h('div', {},
          h('span', { class: 'status-label', text: 'Statut administratif' }),
          h('strong', { text: next.statusText }),
        ),
      ),
    );

    const recap = h('section', { class: 'glass-card card-pad', attrs: { 'aria-labelledby': 'recap-title' } },
      h('div', { class: 'card-heading' },
        h('div', {},
          h('h2', { id: 'recap-title', text: 'Récapitulatif du dossier' }),
          h('p', { text: 'Données enregistrées pour votre demande de stage.' }),
        ),
        h('span', { class: 'context-pill', text: `Dossier #${demande.id}` }),
      ),
      h('div', { class: 'detail-grid' },
        metaCard('building', 'Entreprise d’accueil', demande.entreprise ? demande.entreprise.nom : '—', demande.entreprise ? demande.entreprise.ville : ''),
        metaCard('calendar', 'Date de dépôt', formatDateLong(demande.date_depot), 'Date enregistrée par le serveur'),
        metaCard('user', 'Étudiant demandeur', fullName(demande.etudiant), demande.etudiant && demande.etudiant.numero_etudiant ? `N° ${demande.etudiant.numero_etudiant}` : ''),
        metaCard('user', 'Encadreur pédagogique', demande.encadreur ? fullName(demande.encadreur) : 'Non assigné', demande.encadreur ? (demande.encadreur.grade || '') : 'Aucun encadreur assigné'),
        metaCard('checkCircle', 'Statut', statusLabel(demande.statut), next.statusText),
        metaCard('calendar', 'Date de décision', demande.date_decision ? formatDateLong(demande.date_decision) : 'En attente', demande.date_decision ? 'Décision enregistrée' : 'Aucune décision enregistrée'),
      ),
    );

    const nodes = [head, recap];

    if (motif) {
      nodes.push(h('div', { class: 'alert alert-error', attrs: { role: 'status' } },
        iconEl('alert'),
        h('div', {},
          h('strong', { text: 'Motif du refus' }),
          h('p', { text: motif }),
        ),
      ));
    }

    nodes.push(h('section', { class: `callout callout--${next.variant}`, attrs: { role: 'status' } },
      h('span', { class: 'icon-box' }, iconEl(next.icon)),
      h('div', {},
        h('h2', { text: next.title }),
        h('p', { text: next.text }),
        next.action ? h('p', { class: 'next-action' }, h('a', { class: 'btn btn-secondary btn-sm', href: next.action.href }, next.action.label)) : null,
      ),
    ));

    return nodes;
  }

  function nextStepFor(demande) {
    if (demande.statut === 'VALIDEE') {
      return {
        statusText: 'Demande validée',
        title: 'Demande validée',
        text: 'Votre demande de stage a été validée par le responsable pédagogique.',
        variant: 'green',
        icon: 'checkCircle',
      };
    }

    if (demande.statut === 'REFUSEE') {
      return {
        statusText: 'Demande refusée',
        title: 'Demande refusée',
        text: demande.motif_refus
          ? `Motif enregistré : ${demande.motif_refus}`
          : 'Aucun motif n’a été renseigné.',
        variant: 'red',
        icon: 'xCircle',
        action: { href: '#/etudiant/nouvelle-demande', label: 'Déposer une nouvelle demande' },
      };
    }

    if (demande.statut === 'BROUILLON') {
      return {
        statusText: 'Dossier non soumis',
        title: 'Dossier non soumis',
        text: 'Cette demande n’a pas été soumise. Vous pouvez déposer une nouvelle demande pour la transmettre.',
        variant: 'muted',
        icon: 'file',
        action: { href: '#/etudiant/nouvelle-demande', label: 'Déposer une demande' },
      };
    }

    return {
      statusText: 'En attente de décision',
      title: 'Statut : Examen en cours',
      text: 'Le responsable pédagogique examine votre dossier. Vous serez informé dès qu’une décision sera enregistrée.',
      variant: 'primary',
      icon: 'clock',
    };
  }

  /* =====================================================================
     Étudiant — nouvelle demande
     ===================================================================== */

  async function renderNewDemande(token) {
    const head = pageHead({
      context: [h('span', { class: 'context-pill context-pill--primary', text: 'Étudiant' }), h('span', { class: 'context-pill', text: SESSION_LABEL })],
      title: 'Nouvelle demande de stage',
      subtitle: 'Renseignez l’entreprise d’accueil pour soumettre votre demande.',
      actions: h('a', { class: 'btn btn-secondary', href: '#/etudiant/demandes' }, iconEl('arrowLeft'), 'Retour à mes demandes'),
    });

    const shell = createShell({
      user: state.user,
      active: 'nouvelle',
      breadcrumb: [{ label: 'Mes demandes', href: '#/etudiant/demandes' }, { label: 'Nouvelle demande' }],
      head,
    });

    const content = h('div', { class: 'stack' });
    shell.main.append(content);
    content.append(loadingCard('Chargement des entreprises partenaires…'));
    setDocumentTitle('Nouvelle demande');

    try {
      const entreprises = await api('/api/entreprises');
      if (token !== state.routeToken) return;
      content.replaceChildren(...buildNewDemandeContent(entreprises));
    } catch (error) {
      if (token !== state.routeToken) return;
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }
      content.replaceChildren(errorCard(errorText(error), () => renderNewDemande(++state.routeToken)));
    }
  }

  function buildNewDemandeContent(entreprises) {
    const errorBox = h('div', { class: 'alert alert-error', role: 'alert', hidden: true });
    const select = h('select', {
      class: 'select',
      id: 'entreprise-id',
      name: 'entreprise_id',
      required: true,
      attrs: { 'aria-describedby': 'entreprise-hint' },
    },
      h('option', { value: '', text: 'Choisir une entreprise partenaire…' }),
      entreprises.map((entreprise) => h('option', {
        value: String(entreprise.id),
        text: `${entreprise.nom} — ${entreprise.ville}`,
      })),
    );

    const cityInput = h('input', {
      class: 'input',
      id: 'ville-stage',
      type: 'text',
      value: '',
      placeholder: 'Automatique',
      readOnly: true,
      attrs: { 'aria-describedby': 'ville-hint' },
    });

    const submitButton = h('button', {
      class: 'btn btn-primary',
      type: 'submit',
      id: 'new-demande-submit',
    }, h('span', { text: 'Soumettre ma demande' }), iconEl('arrowRight'));

    function updateCity() {
      const selected = entreprises.find((entreprise) => String(entreprise.id) === select.value);
      cityInput.value = selected ? selected.ville : '';
    }

    select.addEventListener('change', () => {
      select.removeAttribute('aria-invalid');
      updateCity();
    });

    const form = h('form', {
      class: 'stack-sm',
      id: 'new-demande-form',
      novalidate: '',
      on: {
        submit: async (event) => {
          event.preventDefault();
          hideInlineAlert(errorBox);
          select.removeAttribute('aria-invalid');

          if (!select.value) {
            select.setAttribute('aria-invalid', 'true');
            showInlineAlert(errorBox, 'Veuillez sélectionner une entreprise d’accueil.');
            select.focus();
            return;
          }

          setBusy(submitButton, true, 'Envoi…');
          try {
            const result = await api('/api/demandes', {
              method: 'POST',
              body: { entreprise_id: Number(select.value) },
            });
            showToast(`Demande #${result.id} soumise avec succès.`, 'success');
            navigate(`/etudiant/demandes/${result.id}`);
          } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
              handleSessionExpired();
              return;
            }
            showInlineAlert(errorBox, errorText(error));
            if (error instanceof ApiError && error.status === 400) {
              select.setAttribute('aria-invalid', 'true');
              select.focus();
            }
          } finally {
            setBusy(submitButton, false);
          }
        },
      },
    },
      h('div', { class: 'field-grid' },
        h('div', { class: 'field' },
          h('label', { for: 'entreprise-id' },
            h('span', {}, 'Entreprise d’accueil ', h('span', { class: 'required', text: '*' })),
          ),
          select,
          h('p', { class: 'field-hint', id: 'entreprise-hint', text: 'Sélectionnez l’entreprise qui vous accueille.' }),
        ),
        h('div', { class: 'field' },
          h('label', { for: 'ville-stage', text: 'Ville de stage' }),
          cityInput,
          h('p', { class: 'field-hint', id: 'ville-hint', text: 'Attribuée automatiquement selon l’entreprise.' }),
        ),
      ),
      errorBox,
      h('div', { class: 'alert alert-info', attrs: { role: 'status' } },
        iconEl('info'),
        h('div', {},
          h('strong', { text: 'Transmission immédiate — Statut : Soumise' }),
          h('p', { text: 'Votre demande sera créée avec le statut Soumise et transmise au responsable pédagogique pour décision.' }),
        ),
      ),
      h('div', { class: 'form-actions' },
        h('a', { class: 'btn btn-secondary', href: '#/etudiant/demandes' }, 'Annuler'),
        submitButton,
      ),
    );

    const studentCard = h('section', { class: 'glass-card form-card', attrs: { 'aria-labelledby': 'student-info-title' } },
      h('div', { class: 'card-heading' },
        h('div', {},
          h('h2', { id: 'student-info-title', text: 'Informations de l’étudiant' }),
          h('p', { text: 'Ces informations proviennent de votre session.' }),
        ),
        h('span', { class: 'readonly-note' }, iconEl('lock', 'icon icon-sm'), ' Lecture seule'),
      ),
      h('div', { class: 'field-grid field-grid--3' },
        readonlyField('student-name', 'Nom complet', displayName(state.user)),
        readonlyField('student-role', 'Rôle', roleLabel(state.user.role)),
        readonlyField('student-email', 'Email institutionnel', state.user.email || '—'),
      ),
    );

    const formCard = h('section', { class: 'glass-card form-card', attrs: { 'aria-labelledby': 'entreprise-form-title' } },
      h('div', { class: 'card-heading' },
        h('div', {},
          h('h2', { id: 'entreprise-form-title', text: 'Entreprise d’accueil & stage' }),
          h('p', { text: 'Choisissez l’entreprise qui vous accueillera pendant votre stage.' }),
        ),
      ),
      form,
    );

    const stepsCard = h('section', { class: 'glass-card form-card', attrs: { 'aria-labelledby': 'steps-title' } },
      h('div', { class: 'card-heading' },
        h('div', {},
          h('h2', { id: 'steps-title', text: 'Ce qui se passe ensuite' }),
          h('p', { text: 'Processus de traitement de votre demande.' }),
        ),
      ),
      h('div', { class: 'steps' },
        step(1, 'Dépôt de la demande', 'À venir', 'Votre demande sera enregistrée avec les informations de l’entreprise d’accueil.'),
        step(2, 'Examen par le responsable', 'Instruction', 'Le responsable pédagogique vérifiera les informations de votre demande.'),
        step(3, 'Décision & Validation', '', 'Le responsable enregistrera sa décision : validation ou refus motivé.'),
      ),
    );

    return [
      studentCard,
      h('div', { class: 'form-layout' }, formCard, stepsCard),
    ];
  }

  function readonlyField(id, label, value) {
    return h('div', { class: 'field' },
      h('label', { for: id, text: label }),
      h('input', {
        class: 'input',
        id,
        type: 'text',
        value: value || '',
        readOnly: true,
      }),
    );
  }

  function step(number, title, badge, text) {
    return h('div', { class: 'step' },
      h('span', { class: 'step-number', attrs: { 'aria-hidden': 'true' }, text: String(number) }),
      h('div', { class: 'step-title' },
        h('span', { text: title }),
        badge ? h('span', { class: 'mini-pill', text: badge }) : null,
      ),
      h('p', { text }),
    );
  }

  /* =====================================================================
     Responsable — demandes
     ===================================================================== */

  async function renderResponsableDemandes(token) {
    const head = pageHead({
      context: [h('span', { class: 'context-pill context-pill--primary', text: 'Pôle pédagogique SIL' }), h('span', { class: 'context-pill', text: SESSION_LABEL })],
      title: 'Demandes à traiter',
      subtitle: 'Consultez les demandes déposées et traitez celles en attente d’une décision.',
    });

    const shell = createShell({
      user: state.user,
      active: 'demandes',
      breadcrumb: [{ label: 'Espace Responsable' }, { label: 'Demandes à traiter' }],
      head,
    });

    const content = h('div', { class: 'stack' });
    shell.main.append(content);
    content.append(loadingCard('Chargement des demandes…'));
    setDocumentTitle('Demandes à traiter');

    try {
      const demandes = await api('/api/demandes');
      if (token !== state.routeToken) return;
      content.replaceChildren(...buildResponsableDemandesContent(demandes));
    } catch (error) {
      if (token !== state.routeToken) return;
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }
      content.replaceChildren(errorCard(errorText(error), () => renderResponsableDemandes(++state.routeToken)));
    }
  }

  function buildResponsableDemandesContent(demandes) {
    const counts = countStatuses(demandes);
    const lastDecision = latestDecisionDate(demandes);
    const lastRefusal = firstRefusalMotif(demandes);
    const nodes = [];

    nodes.push(h('div', { class: 'kpi-grid' },
      kpiCard({
        variant: 'primary',
        icon: 'clock',
        label: 'À traiter',
        value: counts.SOUMISE,
        sub: counts.SOUMISE > 1 ? 'dossiers en attente' : counts.SOUMISE === 1 ? 'dossier en attente' : 'aucun dossier en attente',
        foot: counts.SOUMISE > 0 ? 'Action requise' : 'File à jour',
      }),
      kpiCard({
        variant: 'green',
        icon: 'checkCircle',
        label: 'Validées',
        value: counts.VALIDEE,
        sub: counts.VALIDEE > 1 ? 'demandes validées' : counts.VALIDEE === 1 ? 'demande validée' : 'aucune validation',
        foot: lastDecision ? `Dernière : ${formatDateShort(lastDecision)}` : 'Aucune décision',
      }),
      kpiCard({
        variant: 'red',
        icon: 'xCircle',
        label: 'Refusées',
        value: counts.REFUSEE,
        sub: counts.REFUSEE > 1 ? 'demandes refusées' : counts.REFUSEE === 1 ? 'demande refusée' : 'aucun refus',
        foot: lastRefusal || 'Aucun motif envoyé',
      }),
      kpiCard({
        variant: 'muted',
        icon: 'folder',
        label: 'Total dossiers',
        value: counts.TOTAL,
        sub: counts.TOTAL > 1 ? 'demandes enregistrées' : 'demande enregistrée',
        foot: 'Toutes les demandes',
      }),
    ));

    const rows = demandes.map((demande) => responsableRow(demande));
    const empty = h('div', { class: 'empty-state', hidden: demandes.length > 0 },
      h('span', { class: 'icon-box' }, iconEl('checkCircle')),
      h('h3', { text: 'File d’attente à jour !' }),
      h('p', { text: 'Aucune demande ne correspond aux critères sélectionnés.' }),
    );

    const table = h('table', { class: 'data-table' },
      h('caption', { class: 'sr-only', text: 'Liste des demandes de stage' }),
      h('thead', {},
        h('tr', {},
          h('th', { scope: 'col', text: 'Étudiant' }),
          h('th', { scope: 'col', text: 'Entreprise d’accueil' }),
          h('th', { scope: 'col', text: 'Ville' }),
          h('th', { scope: 'col', text: 'Dépôt' }),
          h('th', { scope: 'col', text: 'Statut' }),
          h('th', { scope: 'col', class: 'action-cell', text: 'Action' }),
        ),
      ),
      h('tbody', {}, rows),
    );

    const toolbar = h('div', { class: 'toolbar' },
      h('div', { class: 'filter-tabs', attrs: { role: 'group', 'aria-label': 'Filtrer les demandes' } }),
      h('div', { class: 'field search-field' },
        h('label', { class: 'sr-only', for: 'responsable-search', text: 'Rechercher une demande' }),
        iconEl('search'),
        h('input', {
          class: 'input',
          id: 'responsable-search',
          type: 'search',
          placeholder: 'Rechercher un étudiant, un numéro…',
          autocomplete: 'off',
        }),
      ),
      h('div', { class: 'field toolbar-status' },
        h('label', { class: 'sr-only', for: 'responsable-status', text: 'Filtrer par statut' }),
        h('select', { class: 'select', id: 'responsable-status' },
          h('option', { value: 'ALL', text: 'Statut : Tous' }),
          h('option', { value: 'BROUILLON', text: 'Brouillon' }),
          h('option', { value: 'SOUMISE', text: 'Soumise' }),
          h('option', { value: 'VALIDEE', text: 'Validée' }),
          h('option', { value: 'REFUSEE', text: 'Refusée' }),
        ),
      ),
    );

    const tableCard = h('section', { class: 'glass-card table-card', attrs: { 'aria-labelledby': 'responsable-table-title' } },
      h('h2', { class: 'sr-only', id: 'responsable-table-title', text: 'Tableau des demandes de stage' }),
      toolbar,
      h('div', { class: 'table-card-head' },
        h('span', { id: 'responsable-results-count' }),
        h('span', { text: SESSION_LABEL }),
      ),
      h('div', { class: 'table-wrap' }, table),
      empty,
    );

    nodes.push(tableCard);

    const tabs = toolbar.querySelector('.filter-tabs');
    const searchInput = toolbar.querySelector('#responsable-search');
    const statusSelect = toolbar.querySelector('#responsable-status');
    const resultsCount = tableCard.querySelector('#responsable-results-count');
    let activeStatus = 'ALL';
    let query = '';

    const tabPending = h('button', {
      class: 'filter-tab',
      type: 'button',
      attrs: { 'aria-pressed': 'false', 'data-status': 'SOUMISE' },
      on: { click: () => setStatus('SOUMISE') },
    }, 'À traiter', h('span', { class: 'count', text: String(counts.SOUMISE) }));

    const tabAll = h('button', {
      class: 'filter-tab',
      type: 'button',
      attrs: { 'aria-pressed': 'true', 'data-status': 'ALL' },
      on: { click: () => setStatus('ALL') },
    }, 'Toutes les demandes', h('span', { class: 'count', text: String(counts.TOTAL) }));

    tabs.append(tabPending, tabAll);

    function syncTabs() {
      tabPending.setAttribute('aria-pressed', activeStatus === 'SOUMISE' ? 'true' : 'false');
      tabAll.setAttribute('aria-pressed', activeStatus === 'ALL' ? 'true' : 'false');
      statusSelect.value = activeStatus;
    }

    function setStatus(status) {
      activeStatus = status;
      syncTabs();
      applyFilter();
    }

    function applyFilter() {
      const normalizedQuery = normalizeText(query);
      let visible = 0;
      rows.forEach((row) => {
        const matchesStatus = activeStatus === 'ALL' || row.dataset.status === activeStatus;
        const matchesQuery = !normalizedQuery || row.dataset.search.includes(normalizedQuery);
        const show = matchesStatus && matchesQuery;
        row.hidden = !show;
        if (show) visible += 1;
      });

      resultsCount.textContent = `Affichage : ${visible} ${visible > 1 ? 'dossiers trouvés' : 'dossier trouvé'}`;
      table.hidden = visible === 0;
      empty.hidden = visible > 0;
    }

    searchInput.addEventListener('input', () => {
      query = searchInput.value;
      applyFilter();
    });

    statusSelect.addEventListener('change', () => {
      setStatus(statusSelect.value);
    });

    syncTabs();
    applyFilter();

    return nodes;
  }

  function responsableRow(demande) {
    const student = demande.etudiant || {};
    const search = normalizeText([
      demande.id,
      student.nom,
      student.prenom,
      student.numero_etudiant,
      demande.entreprise && demande.entreprise.nom,
      demande.entreprise && demande.entreprise.ville,
      demande.statut,
      demande.motif_refus,
    ].join(' '));

    const statusCell = h('div', { class: 'status-cell' }, statusBadge(demande.statut));
    if (demande.motif_refus) {
      statusCell.append(h('span', { class: 'motif', text: demande.motif_refus }));
    }

    const dateCell = h('div', { class: 'cell-stack' },
      h('strong', { text: formatDateShort(demande.date_depot) }),
      h('span', { text: decisionSubtext(demande) }),
    );

    const action = demande.statut === 'SOUMISE'
      ? h('a', { class: 'btn btn-primary btn-sm', href: `#/responsable/demandes/${demande.id}/decision` }, iconEl('check'), 'Traiter', iconEl('arrowRight', 'icon icon-sm'))
      : h('span', { class: 'action-empty' },
          h('span', { class: 'sr-only', text: 'Aucune action disponible' }),
          h('span', { class: 'muted', attrs: { 'aria-hidden': 'true' }, text: '—' }),
        );

    return h('tr', { dataset: { status: demande.statut, search } },
      h('td', {},
        h('div', { class: 'cell-strong' },
          h('span', { class: 'avatar', text: initials(student) }),
          h('div', { class: 'cell-stack' },
            h('strong', { text: fullName(student) }),
            h('span', { text: student.numero_etudiant || '—' }),
          ),
        ),
      ),
      h('td', {},
        h('div', { class: 'cell-strong' },
          h('span', { class: 'icon-box' }, iconEl('building')),
          h('div', { class: 'cell-stack' },
            h('strong', { text: demande.entreprise ? demande.entreprise.nom : '—' }),
            h('span', { text: `Demande #${demande.id}` }),
          ),
        ),
      ),
      h('td', { text: demande.entreprise ? demande.entreprise.ville : '—' }),
      h('td', {}, dateCell),
      h('td', {}, statusCell),
      h('td', { class: 'action-cell' }, action),
    );
  }

  function decisionSubtext(demande) {
    if (demande.date_decision) {
      return demande.statut === 'REFUSEE'
        ? `Refusée le ${formatDateShort(demande.date_decision)}`
        : `Décision le ${formatDateShort(demande.date_decision)}`;
    }
    if (demande.statut === 'BROUILLON') return 'En cours de rédaction';
    if (demande.statut === 'SOUMISE') return 'En attente de décision';
    return '—';
  }

  /* =====================================================================
     Responsable — décision
     ===================================================================== */

  async function renderDecision(id, token) {
    const head = pageHead({
      context: [h('span', { class: 'context-pill context-pill--primary', text: `Demande #${id}` }), h('span', { class: 'context-pill', text: SESSION_LABEL })],
      title: `Décision — Demande #${id}`,
      subtitle: 'Évaluation pédagogique de la demande de stage.',
      actions: h('a', { class: 'btn btn-secondary', href: '#/responsable/demandes' }, iconEl('arrowLeft'), 'Retour aux demandes'),
    });

    const shell = createShell({
      user: state.user,
      active: 'demandes',
      breadcrumb: [{ label: 'Évaluation' }, { label: `Décision — Demande #${id}` }],
      head,
    });

    const content = h('div', { class: 'stack' });
    shell.main.append(content);
    content.append(loadingCard('Chargement du dossier…'));
    setDocumentTitle(`Décision — Demande #${id}`);

    try {
      const demandes = await api('/api/demandes');
      if (token !== state.routeToken) return;

      const demande = demandes.find((item) => Number(item.id) === Number(id));
      if (!demande) {
        content.replaceChildren(errorCard('Cette demande est introuvable.', () => navigate('/responsable/demandes')));
        return;
      }

      if (demande.statut !== 'SOUMISE') {
        content.replaceChildren(
          h('section', { class: 'glass-card card-pad' },
            h('div', { class: 'empty-state' },
              h('span', { class: 'icon-box icon-box--muted' }, iconEl('checkCircle')),
              h('h3', { text: 'Cette demande n’est plus à traiter' }),
              h('p', { text: `Elle est actuellement au statut « ${statusLabel(demande.statut)} ».` }),
              h('a', { class: 'btn btn-secondary btn-sm', href: '#/responsable/demandes' }, iconEl('arrowLeft'), 'Retour aux demandes'),
            ),
          ),
        );
        return;
      }

      content.replaceChildren(...buildDecisionContent(demande));
    } catch (error) {
      if (token !== state.routeToken) return;
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }
      content.replaceChildren(errorCard(errorText(error), () => renderDecision(id, ++state.routeToken)));
    }
  }

  function buildDecisionContent(demande) {
    const student = demande.etudiant || {};
    const errorBox = h('div', { class: 'alert alert-error', role: 'alert', hidden: true });

    const motifField = h('div', { class: 'field motif-field', hidden: true },
      h('label', { for: 'decision-motif' },
        h('span', {}, 'Motif du refus ', h('span', { class: 'required', text: '*' })),
        h('span', { class: 'field-hint', text: '255 caractères maximum' }),
      ),
      h('textarea', {
        class: 'textarea',
        id: 'decision-motif',
        name: 'motif',
        maxlength: '255',
        placeholder: 'Expliquez clairement le motif du refus à l’étudiant…',
        attrs: { 'aria-describedby': 'decision-motif-hint' },
      }),
      h('p', { class: 'field-hint', id: 'decision-motif-hint', text: 'Ce motif sera visible par l’étudiant dans le détail de sa demande.' }),
    );

    const submitButton = h('button', {
      class: 'btn btn-primary',
      type: 'submit',
      id: 'decision-submit',
    }, iconEl('checkCircle'), h('span', { id: 'decision-submit-label', text: 'Confirmer la validation' }));

    const form = h('form', {
      class: 'decision-card glass-card',
      id: 'decision-form',
      novalidate: '',
      on: {
        submit: async (event) => {
          event.preventDefault();
          hideInlineAlert(errorBox);
          const selected = form.querySelector('input[name="decision"]:checked');
          const decision = selected ? selected.value : 'VALIDEE';
          const motif = form.querySelector('#decision-motif');
          motif.removeAttribute('aria-invalid');

          if (decision === 'REFUSEE' && !motif.value.trim()) {
            motif.setAttribute('aria-invalid', 'true');
            showInlineAlert(errorBox, 'Le motif est obligatoire pour un refus.');
            motif.focus();
            return;
          }

          setBusy(submitButton, true, 'Enregistrement…');
          try {
            const result = await api(`/api/demandes/${demande.id}/statut`, {
              method: 'PATCH',
              body: decision === 'REFUSEE'
                ? { decision, motif: motif.value.trim() }
                : { decision },
            });

            state.lastDecision = {
              demande,
              result,
              user: state.user,
            };
            showToast('Décision enregistrée avec succès.', 'success');
            navigate('/responsable/confirmation');
          } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
              handleSessionExpired();
              return;
            }
            showInlineAlert(errorBox, errorText(error));
          } finally {
            setBusy(submitButton, false);
          }
        },
      },
    },
      h('h2', { text: 'Votre décision pédagogique' }),
      h('p', { class: 'decision-sub', text: `Étudiant : ${fullName(student)} • ${student.numero_etudiant || '—'}` }),
      h('fieldset', { class: 'decision-options' },
        h('legend', { text: 'Nature de l’avis émis *' }),
        h('div', { class: 'radio-card' },
          h('input', {
            type: 'radio',
            name: 'decision',
            id: 'decision-valider',
            value: 'VALIDEE',
            checked: true,
            on: { change: () => updateDecisionMode() },
          }),
          h('label', { for: 'decision-valider' }, iconEl('checkCircle'), 'Valider'),
        ),
        h('div', { class: 'radio-card' },
          h('input', {
            type: 'radio',
            name: 'decision',
            id: 'decision-refuser',
            value: 'REFUSEE',
            on: { change: () => updateDecisionMode() },
          }),
          h('label', { for: 'decision-refuser' }, iconEl('xCircle'), 'Refuser la demande'),
        ),
      ),
      motifField,
      errorBox,
      h('div', { class: 'alert alert-warning', attrs: { role: 'status' } },
        iconEl('shield'),
        h('div', {},
          h('strong', { text: 'Traçabilité de la décision' }),
          h('p', { text: 'La décision sera enregistrée dans l’historique des demandes.' }),
        ),
      ),
      h('div', { class: 'decision-actions' },
        h('a', { class: 'btn btn-secondary', href: '#/responsable/demandes' }, 'Annuler'),
        submitButton,
      ),
    );

    function updateDecisionMode() {
      const selected = form.querySelector('input[name="decision"]:checked');
      const refusing = selected && selected.value === 'REFUSEE';
      motifField.hidden = !refusing;
      form.classList.toggle('is-refuse', refusing);
      const label = form.querySelector('#decision-submit-label');
      if (label) label.textContent = refusing ? 'Confirmer le refus' : 'Confirmer la validation';
      submitButton.classList.toggle('btn-danger', refusing);
      submitButton.classList.toggle('btn-primary', !refusing);
      if (refusing) {
        const motif = form.querySelector('#decision-motif');
        motif.focus();
      }
    }

    const leftCard = h('section', { class: 'glass-card decision-dossier', attrs: { 'aria-labelledby': 'dossier-title' } },
      h('div', { class: 'dossier-head' },
        h('div', { class: 'dossier-person' },
          h('span', { class: 'avatar', text: initials(student) }),
          h('div', {},
            h('span', { class: 'eyebrow', text: 'Dossier académique' }),
            h('h2', { id: 'dossier-title', text: fullName(student) }),
            h('p', { text: `${student.numero_etudiant || '—'} • Demande #${demande.id}` }),
          ),
        ),
        h('div', { class: 'cell-stack decision-date' },
          h('span', { class: 'muted small', text: 'Date de dépôt' }),
          h('strong', { text: formatDateShort(demande.date_depot) }),
        ),
      ),
      h('div', { class: 'dossier-enterprise' },
        h('div', { class: 'meta-card' },
          h('span', { class: 'meta-label' }, iconEl('building'), ' Organisme d’accueil'),
          h('span', { class: 'meta-value', text: demande.entreprise ? demande.entreprise.nom : '—' }),
          h('span', { class: 'meta-sub', text: 'Entreprise d’accueil' }),
        ),
        h('div', { class: 'meta-card' },
          h('span', { class: 'meta-label' }, iconEl('pin'), ' Lieu'),
          h('span', { class: 'meta-value', text: demande.entreprise ? demande.entreprise.ville : '—' }),
          h('span', { class: 'meta-sub', text: 'Ville de stage' }),
        ),
      ),
      h('div', { class: 'alert alert-info decision-info' },
        iconEl('info'),
        h('div', {},
          h('strong', { text: 'Statut : Soumise' }),
          h('p', { text: 'Cette demande attend une validation ou un refus motivé.' }),
        ),
      ),
    );

    return [h('div', { class: 'decision-layout' }, leftCard, form)];
  }

  /* =====================================================================
     Responsable — confirmation
     ===================================================================== */

  function renderConfirmation() {
    setDocumentTitle('Confirmation');
    const decision = state.lastDecision;

    if (!decision || !decision.result) {
      navigate('/responsable/demandes');
      return;
    }

    const { demande, result, user } = decision;
    const student = demande.etudiant || {};
    const refused = result.statut === 'REFUSEE';

    const head = pageHead({
      context: [h('span', { class: 'context-pill context-pill--primary', text: 'Confirmation' }), h('span', { class: 'context-pill', text: SESSION_LABEL })],
      title: 'Confirmation de la décision',
      subtitle: 'La décision a été enregistrée dans le dossier de l’étudiant.',
    });

    const shell = createShell({
      user: state.user,
      active: 'demandes',
      breadcrumb: [{ label: 'Traitement' }, { label: 'Confirmation' }],
      head,
    });

    const summary = h('section', { class: 'summary-card' },
      h('div', { class: 'summary-head' },
        h('h2', { text: 'Synthèse de la décision' }),
        statusBadge(result.statut),
      ),
      h('div', { class: 'summary-grid' },
        summaryItem('Étudiant', fullName(student), student.numero_etudiant || ''),
        summaryItem('Entreprise d’accueil', demande.entreprise ? demande.entreprise.nom : '—', demande.entreprise ? demande.entreprise.ville : ''),
        summaryItem('Date de la décision', formatDateTime(result.date_decision), ''),
        summaryItem('Décision rendue par', displayName(user), roleLabel(user.role)),
      ),
      refused && result.motif_refus ? h('div', { class: 'summary-motif' },
        h('strong', { text: 'Motif du refus' }),
        h('span', { text: result.motif_refus }),
      ) : null,
    );

    const card = h('div', { class: `success-card${refused ? ' is-refuse' : ''}` },
      h('span', { class: `success-icon${refused ? ' success-icon--red' : ''}` }, iconEl(refused ? 'x' : 'check', 'icon')),
      h('h2', { text: refused ? `Demande #${result.id} refusée` : `Demande #${result.id} validée avec succès` }),
      h('p', {
        text: refused
          ? 'La demande de stage a été refusée. Le motif a été enregistré et sera visible par l’étudiant.'
          : 'La demande de stage a été officiellement validée pour l’année universitaire 2026-2027.',
      }),
      summary,
      h('div', { class: 'form-actions form-actions--center' },
        h('a', { class: 'btn btn-primary', href: '#/responsable/demandes' }, iconEl('arrowLeft'), 'Retour aux demandes à traiter'),
      ),
    );

    const content = h('div', { class: 'success-wrap' }, card);
    shell.main.append(content);
    focusMain(shell.main);
  }

  function summaryItem(label, value, sub) {
    return h('div', { class: 'summary-item' },
      h('span', { class: 'meta-label', text: label }),
      h('span', { class: 'meta-value', text: value }),
      sub ? h('span', { class: 'meta-sub', text: sub }) : null,
    );
  }

  /* =====================================================================
     Composants réutilisables
     ===================================================================== */

  function kpiCard({ variant, icon, label, value, sub, foot }) {
    return h('div', { class: `kpi-card kpi-card--${variant}` },
      h('div', { class: 'kpi-top' },
        h('span', { class: 'kpi-label', text: label }),
        h('span', { class: 'icon-box' }, iconEl(icon)),
      ),
      h('div', { class: 'kpi-value' },
        h('strong', { text: String(value) }),
        h('span', { text: sub }),
      ),
      h('div', { class: 'kpi-sub' },
        h('span', { class: 'icon', attrs: { 'aria-hidden': 'true' } }, iconEl('info', 'icon icon-sm')),
        h('span', { text: foot }),
      ),
    );
  }

  function metaCard(iconName, label, value, sub) {
    return h('div', { class: 'meta-card' },
      h('span', { class: 'meta-label' }, iconEl(iconName, 'icon icon-sm'), ` ${label}`),
      h('span', { class: 'meta-value', text: value || '—' }),
      sub ? h('span', { class: 'meta-sub', text: sub }) : null,
    );
  }

  function loadingCard(message) {
    return h('div', { class: 'glass-card loading-card', attrs: { role: 'status', 'aria-live': 'polite' } },
      h('span', { class: 'spinner', attrs: { 'aria-hidden': 'true' } }),
      h('span', { text: message }),
    );
  }

  function errorCard(message, retry) {
    return h('div', { class: 'glass-card error-page', attrs: { role: 'alert' } },
      h('span', { class: 'icon-box icon-box--red' }, iconEl('alert')),
      h('h2', { text: 'Impossible de charger les données' }),
      h('p', { text: message }),
      h('div', { class: 'page-actions' },
        retry ? h('button', { class: 'btn btn-primary', type: 'button', on: { click: retry } }, iconEl('refresh'), 'Réessayer') : null,
        h('a', { class: 'btn btn-secondary', href: `#${homeForRole(state.user)}` }, 'Retour'),
      ),
    );
  }

  function renderNotFound() {
    setDocumentTitle('Page introuvable');
    const shell = createShell({
      user: state.user,
      active: '',
      breadcrumb: [{ label: 'Page introuvable' }],
      head: pageHead({
        title: 'Page introuvable',
        subtitle: 'La page demandée n’existe pas ou a été déplacée.',
      }),
    });
    shell.main.append(
      h('div', { class: 'glass-card error-page' },
        h('span', { class: 'icon-box icon-box--muted' }, iconEl('search')),
        h('h2', { text: 'Cette page n’existe pas' }),
        h('p', { text: 'Utilisez le menu pour revenir à votre espace.' }),
        h('a', { class: 'btn btn-primary', href: `#${homeForRole(state.user)}` }, 'Retour à mon espace'),
      ),
    );
  }

  /* =====================================================================
     Démarrage
     ===================================================================== */

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
