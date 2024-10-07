<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let username = '';
    let password = '';
    let isRegistering = false;
    let error = '';

    async function handleSubmit() {
        console.log(`Attempting to ${isRegistering ? 'register' : 'login'}`);
        const endpoint = isRegistering ? '/api/register' : '/api/auth';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                if (!isRegistering) {
                    localStorage.setItem('token', data.token);
                    console.log('Token stored in localStorage');
                }
                dispatch('login');
            } else {
                error = data.error;
                console.error('Error:', error);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            error = 'An unexpected error occurred';
        }
    }

    function toggleMode() {
        console.log(`Switching to ${isRegistering ? 'login' : 'register'} mode`);
        isRegistering = !isRegistering;
        error = '';
    }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" style="z-index: 1000;">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 class="text-xl font-bold mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
        <form on:submit|preventDefault={handleSubmit}>
            <input
                type="text"
                bind:value={username}
                placeholder="Username"
                class="w-full p-2 mb-4 border rounded"
            />
            <input
                type="password"
                bind:value={password}
                placeholder="Password"
                class="w-full p-2 mb-4 border rounded"
            />
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">
                {isRegistering ? 'Register' : 'Login'}
            </button>
        </form>
        {#if error}
            <p class="text-red-500 mt-2">{error}</p>
        {/if}
        <button on:click={toggleMode} class="mt-4 text-blue-500">
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
    </div>
</div>