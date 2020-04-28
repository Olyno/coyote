<script>

    import { onMount } from 'svelte';
    import { workingServer, logs, lang } from '../stores';

    const serverUtils = require(__dirname + '/../src/serverUtils');

    const states = {
        command: ''
    }

    function startServer() {
        if (Object.keys($workingServer).length > 0) {
            $workingServer.running.logs = [];
            document.querySelector('.logs p').innerHTML = '';
            $workingServer.running.process = serverUtils.startServer($workingServer);
            if (!$workingServer.running.process.error) {
                $workingServer.running.process.stdout.on('data', (data) => {
                    $workingServer.running.logs.push(data);
                    if (document.body.contains(document.querySelector('.logs p'))) {
                        document.querySelector('.logs p').innerHTML += '<br>' + data;
                        document.querySelector('.logs').scrollTop = document.querySelector('.logs').scrollHeight;
                    }
                });
                logs.logSuccess('Server \'' + $workingServer.name + '\' started');
            } else {
                document.querySelector('.logs p').innerHTML = $lang.titles.start_server_error + ': ' + $workingServer.process.error;
                $workingServer.running.process = undefined;   
            }
        } else {
            document.querySelector('.logs p').innerHTML = $lang.messages.errors.no_server_selected;
        }
    }

    function stopServer() {
        serverUtils.stopServer($workingServer);
        $workingServer.running.process = undefined;
    }

    function forceStopServer() {
        serverUtils.forceStopServer($workingServer);
        $workingServer.running.process = undefined;
    }

     function reloadServer() {
        stopServer();
        startServer();
        logs.logSuccess('Server \'' + $workingServer.name + '\' reloaded');
    }

    function executeCommand() {
        if ($workingServer.running.process) {
            serverUtils.executeCommand(states.command, $workingServer);
            states.command = '';
        }
    }

    function copyLogs() {
        navigator.clipboard.writeText($workingServer.logs.join(''));
        logs.logSuccess('Logs of server \'' + newServer.name + '\' copied');
    }

    onMount(() => {
        if (Object.keys($workingServer).length > 0 && $workingServer.running.process) {
            document.querySelector('.logs p').innerHTML = $workingServer.running.logs.join('<br>');
        }
    })

</script>

<style>
    .logs {
        border: solid 2px white;
        color: white;
        height: 45vh;
        overflow-y: scroll;
    }
    .buttons button {
        text-transform: uppercase
    }
</style>

<section>
    <h1 class="title">{$lang.titles.actions}</h1>
    <div class="level">
        <div class="level-left">
            <div class="buttons">
                <button class="button is-success" on:click={startServer}>{$lang.buttons.start}</button>
                <button class="button is-danger" on:click={stopServer}>{$lang.buttons.stop}</button>
                <button class="button is-danger" on:click={forceStopServer}>{$lang.buttons.force_stop}</button>
                <button class="button is-info" on:click={reloadServer}>{$lang.buttons.reload}</button>
            </div>
        </div>
        <div class="level-right">
            <div class="dropdown is-hoverable" class:is-active={states.openDropdown} on:click={() => states.openDropdown = !states.openDropdown}>
                <div class="dropdown-trigger">
                    <button class="button">
                        <span>{$lang.buttons.utils}</span>
                        <span class="icon is-small">
                            <i class="fas fa-angle-down"></i>
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu">
                    <div class="dropdown-content">
                        <a href="#!" class="dropdown-item" on:click|preventDefault={copyLogs}>{$lang.buttons.copy_logs}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="small-section">
    <h1 class="title">{$lang.titles.logs}</h1>
    <div class="logs is-dark">
        <p></p>
    </div>
    <form on:submit|preventDefault={executeCommand}>
        <input type="text" class="input" placeholder="Command" bind:value={states.command}>
    </form>
</section>