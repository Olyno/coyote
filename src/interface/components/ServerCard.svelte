<script>

    import { lang, created_servers, logs } from '../stores';

    export let server;

    $: statusColor = server.running.process ? 'green' : 'gray';

    const serverUtils = require(__dirname + '/../src/serverUtils');

    function startServer() {
        server.running.logs = [];
        server.running.process = serverUtils.startServer(server);
        if (!server.running.process.error) {
            server.running.process.stdout.on('data', (data) => {
                server.running.logs.push(data);
            });
            logs.logSuccess('Server \'' + server.name + '\' started');
        } else {
            server.running.process = undefined;   
        }
    }

    function stopServer() {
        serverUtils.stopServer(server);
        server.running.process = undefined;
    }

    function reloadServer() {
        stopServer();
        startServer();
        logs.logSuccess('Server \'' + server.name + '\' reloaded');
    }

    console.log(server)

</script>

<style>
    .card {
        margin-top: 25px;
    }
    .status {
        border-radius: 100%;
        width: 10px;
        height: 10px;
    }
</style>

<div class="card">
    <header class="card-header">
        <p class="card-header-title">{server.name}</p>
        <a href="#!" class="card-header-icon">
        <span class="icon">
            <div class="status" style="background-color: {statusColor}"></div>
        </span>
        </a>
    </header>
    <footer class="card-footer">
        <div class="buttons card-footer-item">
            <button class="button is-success" on:click={startServer}>{$lang.buttons.start}</button>
            <button class="button is-danger" on:click={stopServer}>{$lang.buttons.stop}</button>
            <button class="button is-info" on:click={reloadServer}>{$lang.buttons.reload}</button>
        </div>
    </footer>
</div>