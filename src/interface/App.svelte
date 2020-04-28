<script>

    import { config, lang, logs } from './stores';

    import Sidebar from './components/Sidebar.svelte';

    import Terminal from './pages/terminal.svelte';
    import Servers from './pages/servers.svelte';
    import Settings from './pages/settings.svelte';

    let page = 'terminal';

</script>

<style>
    .columns {
        height: 100%;
    }
</style>

<svelte:head>
    <link rel='stylesheet' href='./styles/themes/{$config.theme || 'light'}.css'>
</svelte:head>

<div class="columns">
    <div class="column is-1 is-hidden-mobile">
        <Sidebar bind:page={page} />
    </div>
    <div class="column">
        <section class="section">

            {#if page === 'terminal'}
                <Terminal />
            {:else if page === 'servers'}
                <Servers />
            {:else if page === 'settings'}
                <Settings />
            {/if}

        </section>
    </div>
</div>