<script>

    import { logs } from '../stores';

    export let page;

    const pages = [{
        name: 'terminal',
        icon: 'fas fa-terminal'
    }, {
        name: 'servers',
        icon: 'fas fa-server'
    }, {
        name: 'settings',
        icon: 'fas fa-cog'
    }]

    function switchPage(newPage) {
        page = newPage.name;
        logs.logSuccess('Switch view to ' + page);
    }

</script>

<style>
    .sidebar {
        position: fixed;
        height: 100%;
        width: 8%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        background-color: #27496d;
    }
    .sidebar-item {
        margin-top: 25px;
        color: white;
        background-color: #142850;
    }
</style>

<div class="sidebar">
    {#each pages as p}
        <button class="button is-rounded sidebar-item" on:click={() => switchPage(p)}>
            <span class="icon"><i class="{p.icon}"></i></span>
        </button>
    {/each}
</div>