<script>

    import { workingServer, logs, lang, created_servers, available_servers } from '../stores';

    import ServerCard from '../components/ServerCard.svelte';
    import Modal from '../components/Modal.svelte';

    const serverUtils = require(__dirname + '/../src/serverUtils');
    const { ipcRenderer } = require('electron');

    const states = {
        openDropdown: false,
        openModal: false,
        newServer: {
            openDropdown: false,
            isCreating: false,
            data: {
                name: '',
                version: undefined,
                eula: false
            }
        }
    }

    function updateServer(newServer) {
        $workingServer = newServer;
        logs.logSuccess('Server \'' + newServer.name + '\' selected');
    }

    function openMinecraftEula() {
        window.open('https://account.mojang.com/documents/minecraft_eula', '_blank', 'nodeIntegration=no');
        logs.logSuccess('Opened Minecraft EULA');
    }

    function createServer() {
        const { data } = states.newServer;
        if (/[\W]+/g.test(data.name)) {
            logs.logError('Can\'t create server \'' + states.newServer.data.name + '\': name incorrect');
        } else {
            data.name = data.name.replace(/\s/g, '_').replace(/\./g, '_')
            serverUtils.createServer(data)
                .then(result => {
                    states.newServer.isCreating = false;
                    states.openModal = false;
                    $created_servers = [...$created_servers, result];
                    logs.logSuccess('Server \'' + data.name + '\' created')
                })
                .catch(err => logs.logError(err));
        }
    }

    console.log($created_servers);

</script>

<style>
    .newServerName {
        color: black !important;
        caret-color: black !important;
    }
</style>

<div class="columns">

    <div class="column is-4">

        <h1 class="title">{$lang.titles.server_list}</h1>
        <div class="near-items">
            
            <div class="dropdown item" class:is-active={states.openDropdown} on:click={() => states.openDropdown = !states.openDropdown}>
                <div class="dropdown-trigger">
                    <button class="button">
                        <span>{$workingServer.name}</span>
                        <span class="icon is-small">
                            <i class="fas fa-angle-down"></i>
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu">
                    <div class="dropdown-content">
                        {#each $created_servers as server}
                            <a href="#!" class="dropdown-item" on:click={() => updateServer(server)}>{server.name}</a>
                        {/each}
                    </div>
                </div>
            </div>

            <button class="button item" on:click={() => states.openModal = true}>
                <span class="icon">
                    <i class="fas fa-plus-circle"></i>
                </span>
            </button>

        </div>

    </div>

    <div class="column">

        <h1 class="title">{$lang.titles.created_servers}</h1>
        <div class="columns is-multiline">
            {#each $created_servers as server}
               <div class="column">
                    <ServerCard {server} />
               </div>
            {/each}
        </div>

    </div>

</div>

<Modal title={$lang.titles.create_server} bind:active={states.openModal}>

    <div class="field">
        <label class="label">{$lang.titles.new_server_name}</label>
        <div class="control">
            <input class="input newServerName" type="text" bind:value={states.newServer.data.name}>
        </div>
    </div>

    <div class="field">
        <label class="label">{$lang.titles.new_server_version}</label>
        <div class="control">
            <div class="dropdown" class:is-active={states.newServer.openDropdown} on:click={() => states.newServer.openDropdown = !states.newServer.openDropdown}>
                <div class="dropdown-trigger">
                    <button class="button">
                        {#if states.newServer.data.version}
                            <span>{states.newServer.data.version.version} {states.newServer.data.version.type}</span>
                        {:else}
                            <span>undefined</span>
                        {/if}
                        <span class="icon is-small">
                            <i class="fas fa-angle-down"></i>
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu">
                    <div class="dropdown-content">
                        {#each $available_servers as server}
                            <a href="#!" class="dropdown-item" on:click|preventDefault={() => states.newServer.data.version = server}>{server.version} {server.type}</a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="field">
        <div class="control">
            <label class="checkbox">
                <input type="checkbox" bind:checked={states.newServer.data.eula}>
                {$lang.buttons.new_server_eula} <a href="#!" on:click|preventDefault={openMinecraftEula}>Minecraft eula</a>
            </label>
        </div>
    </div>

    <div slot="footer">
        <button
            class="footer-item button is-success"
            disabled={!states.newServer.data.eula}
            class:is-loading={states.newServer.isCreating}
            on:click={createServer}
        >{$lang.buttons.new_server_create}</button>
        <button class="footer-item button is-danger" on:click={() => states.openModal = false}>{$lang.buttons.new_server_cancel}</button>
    </div>

</Modal>