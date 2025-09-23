<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils/cn';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    size = 'default',
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> & {
    size?: 'sm' | 'default' | 'lg';
  } = $props();

  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
</script>

<div
  bind:this={ref}
  class={cn(
    'animate-spin rounded-full border-2 border-transparent border-t-primary',
    sizeClasses[size],
    className
  )}
  {...restProps}
  role="status"
  aria-label="Loading"
>
  <span class="sr-only">Loading...</span>
</div>
