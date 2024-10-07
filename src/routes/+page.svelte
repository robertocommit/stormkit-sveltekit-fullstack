<script>
  import { onMount } from 'svelte';
  import LoginModal from '$lib/LoginModal.svelte';

  let showLoginModal = false;
  let isLoggedIn = false;
  let username = '';
  let helloMessage = '';

  function checkLoginStatus() {
    console.log('Checking login status');
    const token = localStorage.getItem('token');
    isLoggedIn = !!token;
    if (isLoggedIn) {
      username = JSON.parse(atob(token.split('.')[1])).username;
      console.log('User is logged in:', username);
    } else {
      console.log('User is not logged in');
    }
  }

  function logout() {
    console.log('Logging out');
    localStorage.removeItem('token');
    isLoggedIn = false;
    username = '';
  }

  async function testHelloEndpoint() {
    try {
      const response = await fetch('/api/hello');
      console.log('Hello endpoint response status:', response.status);
      const responseText = await response.text();
      console.log('Hello endpoint raw response:', responseText);
      const data = JSON.parse(responseText);
      helloMessage = data.message;
    } catch (error) {
      console.error('Error fetching hello endpoint:', error);
      helloMessage = 'Error: ' + error.message;
    }
  }

  onMount(() => {
    console.log('Component mounted');
    checkLoginStatus();
  });
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

  <div class="mb-4">
    <button on:click={testHelloEndpoint} class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
      Test Hello Endpoint
    </button>
    {#if helloMessage}
      <p class="mt-2">{helloMessage}</p>
    {/if}
  </div>

  {#if showLoginModal}
    <LoginModal on:login={() => { showLoginModal = false; checkLoginStatus(); }} />
  {/if}
</div>