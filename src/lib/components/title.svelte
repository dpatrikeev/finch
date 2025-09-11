<script lang="ts">
  function parseHarmonicFunctions(text: string): {
    before: string;
    numbers: string;
    after: string;
  } {
    const regex = /\(([TDSKtТДСКт])\s*(\d*)\)/g;
    let before = '';
    let numbers = '';
    let after = '';

    const match = regex.exec(text);
    if (match) {
      before = text.substring(0, match.index) + '(' + match[1];
      numbers = match[2] || '';
      after = ')' + text.substring(match.index + match[0].length);
    } else {
      before = text;
    }

    return { before, numbers, after };
  }

  type Props = {
    readonly title: string;
  };

  const { title }: Props = $props();
  const { before, numbers, after } = parseHarmonicFunctions(title);
</script>

<h3 class="title">
  {before}<span class="numbers">{numbers}</span>{after}
</h3>

<style>
  .title {
    font-weight: 500;
  }

  .numbers {
    font-size: 0.7em;
  }
</style>
