<script lang="ts" setup>
// source: https://gemini.google.com/share/3592a80da6a0
const props = withDefaults(defineProps<{ title?: string, description?: string, headline?: string, sectionId?: string, parents?: string }>(), {
  // title: 'title',
  // description: 'description'
})

const headline = computed(() => (props.headline || '').slice(0, 60))

const title = computed(() => (props.title || '').slice(0, 60))
const description = computed(() => {
  const quotation = props.description as string
  /*
  if (quotation.length > 300) {
    quotation = quotation.slice(0, 300)
    quotation += '...»'
  }
  */
  return quotation
})

/* Creating the section header name if there is a sectionId */
const displayDescription = computed(() => {
  // 1. If there is no sectionId, fall back to the standard page description
  if (!props.sectionId) return props.description

  // 2. Transform "my-second-header" -> "My Second Header"
  return props.sectionId
    .split('-') // Split by hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ') // Join with spaces
})

const beautify = (slug: string) => {
  if (!slug) return ''
  return slug
    .replace(/^\d+/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const parentList = computed(() => {
  if (!props.parents) return []
  return props.parents.split(' > ')
})

const displaySection = computed(() => beautify(props.sectionId || ''))

// Logic for the final section (The Child)
// It should be more indented than the last parent
const finalIndex = computed(() => parentList.value.length)
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center bg-[#020420] relative overflow-hidden">
    <svg
      class="absolute right-0 top-0"
      width="629"
      height="593"
      viewBox="0 0 629 593"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_199_94966)">
        <path
          d="M628.5 -578L639.334 -94.4223L806.598 -548.281L659.827 -87.387L965.396 -462.344L676.925 -74.0787L1087.69 -329.501L688.776 -55.9396L1160.22 -164.149L694.095 -34.9354L1175.13 15.7948L692.306 -13.3422L1130.8 190.83L683.602 6.50012L1032.04 341.989L668.927 22.4412L889.557 452.891L649.872 32.7537L718.78 511.519L628.5 36.32L538.22 511.519L607.128 32.7537L367.443 452.891L588.073 22.4412L224.955 341.989L573.398 6.50012L126.198 190.83L564.694 -13.3422L81.8734 15.7948L562.905 -34.9354L96.7839 -164.149L568.224 -55.9396L169.314 -329.501L580.075 -74.0787L291.604 -462.344L597.173 -87.387L450.402 -548.281L617.666 -94.4223L628.5 -578Z"
          fill="#00DC82"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_199_94966"
          x="0.873535"
          y="-659"
          width="1255.25"
          height="1251.52"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood
            flood-opacity="0"
            result="BackgroundImageFix"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40.5"
            result="effect1_foregroundBlur_199_94966"
          />
        </filter>
      </defs>
    </svg>
    <div class="absolute -right-6 top-10 opacity-[0.07] text-[#00DC82]">
      <svg
        width="480"
        height="600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11 2h2v5h5v2h-5v13h-2V9H6V7h5V2z" />
      </svg>
    </div>

    <div class="pl-[100px] relative z-10">
      <p
        v-if="headline"
        class="uppercase text-[24px] text-[#00DC82] mb-2 font-semibold"
      >
        {{ headline }}
      </p>
      <h1
        v-if="title"
        class="ml-5 text-[32px] mb-6 text-white"
        :style="{
          opacity: `${sectionId ? 0.6 : 1}`
        }"
      >
        <!-- text-[50px] font-bold mb-8 -->
        {{ title }}
      </h1>

      <div
        v-if="sectionId"
        class="flex flex-col gap-3"
      >
        <div
          v-for="(parent, index) in parentList"
          :key="index"
          class="text-[#E4E4E7] leading-tight"
          :style="{
            marginLeft: `${60 + (index * 20)}px`,
            borderLeft: `${Math.max(1, 6 - index)}px solid #00DC82`,
            paddingLeft: '16px',
            fontSize: `${32 - (index * 2)}px`,
            opacity: `${(100 - (index *10)) / 100}`
          }"
        >
          {{ parent }}
        </div>

        <div
          class="mt-2 text-white font-bold leading-tight"
          :style="{
            marginLeft: `${60 + (finalIndex * 20)}px`,
            borderLeft: '2px solid #00DC82',
            paddingLeft: '16px',
            fontSize: '32px',
            maxWidth: '500px'
          }"
        >
          {{ displaySection }}

          <div class="h-1 w-20 bg-[#00DC82] mt-4 opacity-50" />
        </div>
      </div>

      <p
        v-else-if="description"
        class="text-[32px] text-[#E4E4E7] ml-[80px] border-l-4 border-[#00DC82] pl-[12px] leading-tight max-w-[600px]"
      >
        {{ displayDescription }}
      </p>
    </div>
  </div>
</template>
