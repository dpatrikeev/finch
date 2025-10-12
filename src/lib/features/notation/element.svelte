<script lang="ts">
  type Props = {
    readonly attributes: {
      [key: string]: string;
    };
    readonly innerHTML: string;
  };

  let { attributes, innerHTML }: Props = $props();
</script>

<g {...attributes}>
  {@html innerHTML}
</g>
