<script lang="ts">
  import { X } from 'lucide-svelte';

  interface Props {
    open?: boolean;
    title?: string;
    onclose?: () => void;
    children?: any;
    footer?: any;
    class?: string;
  }

  const {
    open = false,
    title = '',
    onclose,
    children,
    footer,
    class: className = '',
  }: Props = $props();

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onclose?.();
    }
  };

  const handleClose = () => {
    onclose?.();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onclose?.();
    }
  };
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="0"
  >
    <!-- Dialog -->
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden {className}"
      role="document"
    >
      <!-- Header with close button if no title -->
      {#if title}
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onclick={handleClose}
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      {:else}
        <div class="absolute top-4 right-4 z-10">
          <button
            type="button"
            onclick={handleClose}
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      {/if}

      <!-- Content -->
      <div class="p-6 overflow-y-auto">
        {@render children?.()}
      </div>

      <!-- Footer -->
      {#if footer}
        <div class="flex justify-end gap-3 p-6 border-t bg-gray-50">
          {@render footer?.()}
        </div>
      {/if}
    </div>
  </div>
{/if}
