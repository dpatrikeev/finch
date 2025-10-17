<script lang="ts">
  import logo from '$lib/assets/logo.png';
</script>

<a href="/" class="logo">
  <img
    class="h-10 w-10 object-cover"
    src={logo}
    alt="Logo Finch"
    width="40"
    height="40"
  />
  <span>Finch</span>
</a>

<style lang="postcss">
  @reference "app.css";

  .logo {
    @apply flex
      items-center
      gap-2
      self-center
      font-medium
      text-xl
      text-foreground
      hover:text-foreground/80
      transition-colors;
  }
</style>
