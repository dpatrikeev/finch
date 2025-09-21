<script lang="ts">
  import type { Attributes } from '../types/notation.types';

  type Props = {
    readonly attributes: Attributes;
    readonly innerHTML: string;
    readonly noteheads: {
      attributes: Attributes;
      innerHTML: string;
      rectAttributes: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }[];
  };

  const { attributes, innerHTML, noteheads }: Props = $props();
</script>

<g {...attributes}>
  {@html innerHTML}
  {#each noteheads as { attributes, innerHTML }}
    <g {...attributes}>
      {@html innerHTML}
    </g>
  {/each}
</g>
