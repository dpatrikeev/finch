<script lang="ts">
  type Props = {
    readonly attributes: {
      [key: string]: string;
    };
    readonly innerHTML: string;
  };

  const { attributes, innerHTML }: Props = $props();
</script>

<text {...attributes}>
  {@html innerHTML}
</text>
