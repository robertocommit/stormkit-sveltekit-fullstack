<script>
  import { onMount } from 'svelte';
  import LoginModal from '$lib/LoginModal.svelte';

  let showLoginModal = false;
  let isLoggedIn = false;
  let username = '';

  function checkLoginStatus() {
    const token = localStorage.getItem('token');
    isLoggedIn = !!token;
    if (isLoggedIn) {
      username = JSON.parse(atob(token.split('.')[1])).username;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    isLoggedIn = false;
    username = '';
  }

  onMount(checkLoginStatus);
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-light text-gray-700 mb-4">Basic Auth Demo</h1>

  <div class="mb-4">
    {#if isLoggedIn}
      <p class="mb-2">Welcome, {username}!</p>
      <button on:click={logout} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    {:else}
      <button on:click={() => showLoginModal = true} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Login / Register
      </button>
    {/if}
  </div>

  {#if showLoginModal}
    <LoginModal on:login={() => { showLoginModal = false; checkLoginStatus(); }} />
  {/if}
</div>