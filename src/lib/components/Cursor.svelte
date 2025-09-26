<script lang="ts">
  import { onMount } from 'svelte';
  import { loadCursor } from '$lib/cursor';

  let cursorRef: HTMLDivElement;

  onMount(() => {
    if (!cursorRef) {
      return;
    }

    return loadCursor(cursorRef);
  });
</script>

<div
  bind:this={cursorRef}
  class="hidden md:flex items-center justify-center fixed w-[30px] h-[30px] opacity-0 rounded-full pointer-events-none mix-blend-difference transition-[opacity,transform,background] z-50"
>
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="overflow-visible opacity-0 w-[35px] h-[35px] transition-opacity animate-cursor"
  >
    <path
      id="curve"
      d="M30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15Z"
      fill="transparent"
    />

  </svg>
</div>

<style>
  :global([data-hover-type="link"]) {
    transform: scale(1.9);
    border: none !important;
  }

  :global([data-hover-type="link"] > svg) {
    display: unset;
    opacity: 1;
  }

  :global([data-hover-type="link"] > svg text) {
    fill: white;
  }

  :global([data-hover-type=""]) {
    transform: scale(1);
    background: transparent;
  }

  @keyframes cursor {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  :global(.animate-cursor) {
    animation: cursor 6s linear infinite;
  }

  
</style>

