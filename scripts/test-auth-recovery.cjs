const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync('SINAGBASA/dist/auth.js', 'utf8')
  .replace('initializeAuth().catch((error) => authForm(error.message || au().authError));', '');

async function scenario({ hash = '', search = '', pending = false, session = true, event, updateError } = {}) {
  const storage = new Map(pending ? [['sinagbasa-password-recovery', 'pending']] : []);
  const screens = [], timers = [], calls = [];
  let listener;
  const user = { id: 'student', email_confirmed_at: 'confirmed' };
  const auth = {
    onAuthStateChange(fn) { listener = fn; },
    async getSession() {
      if (event) listener(event, { user });
      return { data: { session: session ? { user } : null }, error: null };
    },
    async getUser() { return { data: { user }, error: null }; },
    async updateUser(values) { calls.push(values); return { error: updateError }; },
    async resetPasswordForEmail(email, options) { calls.push({ email, ...options }); return { error: null }; },
  };
  const context = vm.createContext({
    URL, URLSearchParams, CustomEvent:class{constructor(type){this.type=type;}}, console, state: { lang: 'en' }, header() {}, bind() {},
    location: { hash, origin: 'https://example.test', pathname: '/', search, href: `https://example.test/${search}${hash}` },
    history: { replaceState() { calls.push('clean-url'); } },
    localStorage: { removeItem() {} },
    sessionStorage: {
      getItem: key => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
    document: { body: { classList: { remove() {} } }, getElementById: () => ({ textContent: '' }) },
    setTimeout: fn => timers.push(fn),
    window: {
      dispatchEvent:event=>calls.push(event.type),
      SINAGBASA_SUPABASE: { url: 'https://example.test', publishableKey: 'test' },
      supabase: { createClient: () => ({ auth }) },
    },
    screens,
  });
  vm.runInContext(source, context);
  vm.runInContext(`authForm = (message = '') => screens.push({ mode: authMode, message });
    landingPage = () => screens.push({ mode: 'landing' });`, context);
  await vm.runInContext('initializeAuth()', context);
  for (const timer of timers.splice(0)) await timer();
  return { context, screens, storage, calls, listener };
}

(async () => {
  // Both callback and startup session handling must preserve the reset screen.
  for (const event of ['PASSWORD_RECOVERY', 'SIGNED_IN', undefined]) {
    const result = await scenario({ hash: '#access_token=test&type=recovery', event });
    assert(result.screens.length > 0);
    assert(result.screens.every(screen => screen.mode === 'reset'));
    assert.equal(result.storage.get('sinagbasa-password-recovery'), 'pending');
  }
  const refreshed = await scenario({ pending: true });
  assert.equal(refreshed.screens.at(-1).mode, 'reset');
  const explicit = await scenario({ search: '?auth=reset-password', event: 'SIGNED_IN' });
  assert(explicit.screens.every(screen => screen.mode === 'reset'));
  for (const options of [{ hash: '#type=recovery', session: false },
    { hash: '#error=access_denied&error_code=otp_expired' }, { pending: true, session: false },
    { search: '?auth=reset-password', session: false }]) {
    const result = await scenario(options);
    assert.equal(result.screens.at(-1).mode, 'forgot');
    assert.match(result.screens.at(-1).message, /expired/);
    assert.equal(result.storage.size, 0);
  }
  const normal = await scenario({ session: false });
  assert.equal(normal.screens.at(-1).mode, 'landing');
  vm.runInContext('window.sinagUser={id:"teacher"};window.sinagProfile={role:"teacher"};activeUserId="teacher";',normal.context);
  normal.listener('SIGNED_OUT',null);
  assert.equal(vm.runInContext('window.sinagUser',normal.context),null);
  assert.equal(vm.runInContext('window.sinagProfile',normal.context),null);
  assert(normal.calls.includes('sinagbasa:signed-out'));
  vm.runInContext(`authMode = 'forgot'; validateAuthForm = () => ({ email: 'student@example.test' });`, normal.context);
  await vm.runInContext(`handleAuthSubmit({ preventDefault() {}, currentTarget: { querySelector: () => ({ disabled: false }) } })`, normal.context);
  assert.equal(normal.calls.at(-1).redirectTo, 'https://example.test/?auth=reset-password');
  for (const updateError of [null, { message: 'Update failed' }]) {
    const result = await scenario({ hash: '#type=recovery', updateError });
    vm.runInContext(`validateAuthForm = () => ({ password: 'NewPassword1!' });`, result.context);
    await vm.runInContext(`handleAuthSubmit({ preventDefault() {}, currentTarget: { querySelector: () => ({ disabled: false }) } })`, result.context);
    assert.equal(result.calls[0].password, 'NewPassword1!');
    assert.equal(result.storage.has('sinagbasa-password-recovery'), Boolean(updateError));
    assert.equal(result.screens.at(-1).mode, updateError ? 'reset' : 'login');
  }
  console.log('Auth recovery checks passed: callback races, refresh, expired links, normal startup, and password updates.');
})().catch(error => { console.error(error); process.exitCode = 1; });
