<script lang="ts">
	import { auth, signIn, signOut } from '#lib/store.svelte';

	let open = $state(false);
	let username = $state('');
	let password = $state('');

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const register = (e.submitter as HTMLButtonElement | null)?.value === 'register';
		await signIn(username.trim(), password, register);
		if (auth.user) { open = false; password = ''; }
	}
</script>

<div class="account">
{#if auth.user}
	<span class="who pill" title="Saved to your account">{auth.user}</span>
	<button class="link" onclick={signOut}>Sign out</button>
{:else if !auth.offline}
	<button class="btn ghost" aria-expanded={open} aria-controls="account-form" onclick={() => (open = !open)}>Sign in</button>
{/if}

{#if open && !auth.user}
	<form id="account-form" class="card" onsubmit={submit} aria-label="Sign in or create an account">
		<label>Username<input bind:value={username} autocomplete="username" required /></label>
		<label>Password<input type="password" bind:value={password} autocomplete="current-password" required /></label>
		<div class="actions">
			<button class="btn" type="submit" value="login" disabled={auth.busy}>Sign in</button>
			<button class="link" type="submit" value="register" disabled={auth.busy}>Create account</button>
			<button class="link" type="button" onclick={() => (open = false)}>Cancel</button>
		</div>
		{#if auth.error}<p class="err small" role="alert">{auth.error}</p>{/if}
		<p class="small">Signed in, your statements and rules are saved to your account and follow you between devices.</p>
	</form>
{/if}
</div>

<style>
	.account { position: relative; display: flex; align-items: center; gap: 12px; }
	.who { font-weight: 600; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
	form { position: absolute; bottom: calc(100% + 8px); left: 0; z-index: 2; width: min(400px, calc(100vw - 28px)); display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px 20px; }
	label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600; color: var(--ink-2); }
	.actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 16px; }
	.err { color: var(--danger); grid-column: 1 / -1; margin: 0; }
	form .small:last-child { grid-column: 1 / -1; margin: 0; }
	@media (max-width: 900px) { form { top: calc(100% + 8px); bottom: auto; left: auto; right: 0; } }
	@media (max-width: 640px) { form { grid-template-columns: 1fr; } }
</style>
