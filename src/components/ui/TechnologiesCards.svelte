<script lang="ts">
  import Astro from "@/assets/icons/Astro.svelte";
  import Bash from "@/assets/icons/Bash.svelte";
  import Css from "@/assets/icons/Css.svelte";
  import Docker from "@/assets/icons/Docker.svelte";
  import Git from "@/assets/icons/Git.svelte";
  import Gitlab from "@/assets/icons/Gitlab.svelte";
  import Java from "@/assets/icons/Java.svelte";
  import Javascript from "@/assets/icons/Javascript.svelte";
  import Kotlin from "@/assets/icons/Kotlin.svelte";
  import Mongodb from "@/assets/icons/Mongodb.svelte";
  import Mysql from "@/assets/icons/Mysql.svelte";
  import Nodejs from "@/assets/icons/Nodejs.svelte";
  import Php from "@/assets/icons/Php.svelte";
  import Postgresql from "@/assets/icons/Postgresql.svelte";
  import Python from "@/assets/icons/Python.svelte";
  import React from "@/assets/icons/React.svelte";
  import Supabase from "@/assets/icons/Supabase.svelte";
  import Svelte from "@/assets/icons/Svelte.svelte";
  import Tailwindcss from "@/assets/icons/Tailwindcss.svelte";
  import Typescript from "@/assets/icons/Typescript.svelte";
  import Vercel from "@/assets/icons/Vercel.svelte";
  import Vscode from "@/assets/icons/Vscode.svelte";
  import { onMount } from "svelte";

  interface Technology {
    name: string;
    category: string;
    level?: string;
    icon: string;
  }
  export let technologies: Technology[] = [];
  export let filter = "all";

  function handleFilterChange(event: any) {
    filter = event.detail;
  }

  onMount(() => {
    window.addEventListener("filter-change", handleFilterChange);
    return () =>
      window.removeEventListener("filter-change", handleFilterChange);
  });

  const techIcons: Record<string, any> = {
    astro: Astro,
    svelte: Svelte,
    java: Java,
    vscode: Vscode,
    javascript: Javascript,
    nodejs: Nodejs,
    docker: Docker,
    css: Css,
    git: Git,
    gitlab: Gitlab,
    kotlin: Kotlin,
    react: React,
    tailwindcss: Tailwindcss,
    php: Php,
    bash: Bash,
    mongodb: Mongodb,
    mysql: Mysql,
    python: Python,
    supabase: Supabase,
    typescript: Typescript,
    vercel: Vercel,
    postgresql: Postgresql,
  };

  type GroupedTechnologies = Record<string, Technology[]>;

  $: grouped = technologies
    .filter((t) => filter === "all" || t.category.includes(filter))
    .reduce((acc: GroupedTechnologies, tech: Technology) => {
      const cat = tech.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tech);
      return acc;
    }, {} as GroupedTechnologies);
</script>

<ul class="flex gap-4 flex-wrap justify-center max-w-[1280px] mt-10">
  {#each Object.entries(grouped) as [category, techs]}
    <!-- <h2 class="capitalize font-semibold text-xl">{category}</h2> -->
    {#each techs as tech}
      <li>
        <article
          class="flex flex-col gap-1 items-center justify-center p-2 rounded bg-secondary aspect-square w-40 select-none"
        >
          <svelte:component
            this={techIcons[tech.icon]}
            className="size-12 aspect-square object-contain"
          />

          <h1 class="font-medium">{tech.name}</h1>
          <div class="flex justify-center space-x-1 mt-1">
            {#each Array(5) as _, i}
              <div
                class={`skill-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  Number(i) < Number(tech.level)
                    ? "bg-primary group-hover:bg-primary-light group-hover:scale-110"
                    : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                }`}
                style="animation-delay: {i * 50}ms;"
              ></div>
            {/each}
          </div>
          <p class="text-xs text-primary font-semibold">{tech.level} / 5</p>
        </article>
      </li>
    {/each}
  {/each}
</ul>
