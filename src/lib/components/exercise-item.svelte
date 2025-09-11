<script lang="ts">
  interface Exercise {
    id: string;
    title: string;
    description: string;
  }

  let { exercise }: { exercise: Exercise } = $props();
</script>

<li
  class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
>
  <a
    href="/{exercise.id}"
    class="text-blue-600 hover:text-blue-800 font-medium text-lg"
  >
    {exercise.title}
  </a>
  <p class="text-gray-600 mt-2 text-sm">
    {exercise.description}
  </p>
</li>
