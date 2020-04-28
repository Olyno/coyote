<script>

    export let title;
    export let active = false;
    export let backgroundColor;

</script>

<div class="modal" class:is-active={active}>
    <div class="modal-background" on:click={() => active = false}></div>
    <div class="modal-card" style="background-color: {backgroundColor}">
        <header class="modal-card-head">
            <p class="modal-card-title">{title}</p>
            <button class="delete" on:click={() => active = false}></button>
        </header>
        <section class="modal-card-body">
            <slot></slot>
        </section>
        <footer class="modal-card-foot">
            <slot name="footer"></slot>
        </footer>
    </div>
</div>