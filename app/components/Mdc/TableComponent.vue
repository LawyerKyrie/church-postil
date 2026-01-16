<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import type { Column, Row, SortingFn } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'

const props = defineProps({
  apiFile: String
})

type RowCells = {
  id: string
  postil: string
  tag: string
  label: string
  bible: string
  value: string
  type: never
  description: string
}

const { data } = await useFetch<RowCells[]>(
  `/api/${props.apiFile}`,
  {
    key: 'da-christmas-sermons',
    transform: (data /* : {}[] */) => {
      return data?.map(row => ({
        ...row,
        id: row.id === undefined ? '' : row.id,
        postil: row.postil === undefined ? '' : row.postil,
        tag: row.tag === undefined ? '' : row.tag,
        label: row.label === undefined ? '' : row.label,
        bible: row.bible === undefined ? '' : row.bible,
        value: row.value === undefined ? '' : row.value
      })) || []
    }
    // lazy: true
  }
)

/* Adding custom sort function for bible column */
// https://gemini.google.com/share/e49b936b49a0
const BOOK_ORDER: Record<string, number> = {
  'ecclus': 2, '2 Mos': 2,
  'isaiah': 23, 'es': 23, 'sirach': 0, 'sirak': 0, 'sir': 0,
  'matt': 40, 'mark': 41, 'luke': 42, 'luk': 42, 'john': 43, 'joh': 43,
  'acts': 44, 'apg': 44, 'rom': 45, '1 cor': 46, '1 kor': 46, '2 cor': 47, '2 kor': 47,
  'gal': 48, 'eph': 49, 'ef': 49, 'phil': 50, 'fil': 50, 'col': 53, 'kol': 51, '1 thess': 52, '2 thess': 53,
  '1 tim': 54, '2 tim': 55, 'titus': 56, 'tit': 56, 'philem': 57, 'filem': 57, 'hebr': 58, 'heb': 58, 'james': 59, 'jak': 59, '1 pet': 60, '2 pet': 61,
  '1 john': 62, '2 john': 63, '3 john': 64, 'jude': 65, 'jud': 65, 'rev': 66, 'åb': 66
}

type BibleBook = keyof typeof BOOK_ORDER

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tanstackBibleSort: SortingFn<any> = (rowA, rowB, colName) => {
  const matchObjVal = (raw) => {
    const str = String(raw || '').toLowerCase().trim()
    // This regex looks for: (Book Name) (Chapter):(Verse)
    const regex = /^((?:[1-5] )?\w+).? (\d+)[,:]\s?(\d+)(?=$| ?-.*)/ // https://regex101.com/r/hYxBM7/1
    const match = str.match(regex)
    if (!match) return { book: str, chapter: 0, verse: 0 }

    return {
      book: match[1],
      chapter: parseInt(match[2], 10) || 0,
      verse: parseInt(match[3], 10) || 0
    }
  }

  const a = matchObjVal(rowA.getValue(colName))
  const b = matchObjVal(rowB.getValue(colName))

  // 1. Compare Book Rank
  const rankA = BOOK_ORDER[a.book as BibleBook] || 999
  const rankB = BOOK_ORDER[b.book as BibleBook] || 999

  if (rankA !== rankB) return rankA - rankB

  // 2. Compare Chapter (Tie-breaker 1)
  if (a.chapter !== b.chapter) return a.chapter - b.chapter

  // 3. Compare Verse (Tie-breaker 2)
  return a.verse - b.verse
}

const columns: TableColumn<RowCells>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => getTableHeader(column, '#'),
    cell: ({ row }) => `${row.getValue('id')}`
  },
  {
    accessorKey: 'postil',
    header: ({ column }) => getTableHeader(column, 'Postil'),
    cell: ({ row }) => `${row.getValue('postil')}`

  },
  {
    accessorKey: 'tag',
    header: ({ column }) => getTableHeader(column, 'Tag'),
    cell: ({ row }) => `${row.getValue('tag')}`
  },
  {
    accessorKey: 'label',
    header: ({ column }) => getTableHeader(column, 'Label'),
    cell: ({ row }) => row.original.label
  },
  {
    accessorKey: 'bible',
    sortingFn: tanstackBibleSort,
    header: ({ column }) => getTableHeader(column, 'Bible'),
    cell: ({ row }) => `${row.getValue('bible')}`
  },
  {
    accessorKey: 'value',
    header: ({ column }) => getTableHeader(column, 'Value'),
    cell: ({ row }) => row.original.value
  },
  {
    id: 'menu',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            'content': {
              align: 'end'
            },
            'items': getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              'icon': 'i-lucide-ellipsis-vertical',
              'title': 'Open Sermon Menu',
              'color': 'neutral',
              'variant': 'ghost',
              'class': 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

/* // global filter input field for searching */
const globalFilter = ref('') // Start with this filter

/*   VISIBILITY  */
const table = useTemplateRef('table')

const columnVisibility = ref({
  id: false,
  postil: false,
  tag: false,
  label: true,
  bible: true,
  value: false,
  menu: true
})

/* Sorting */
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

function getTableHeader(column: Column<RowCells>, label: string) {
  const isSorted = column.getIsSorted()

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label: label,
    icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
    class: '-mx-2.5',
    onClick: () => column.toggleSorting() // column.toggleSorting(column.getIsSorted() === 'asc')
  })
}

const sorting = ref([
  {
    id: 'id',
    desc: false
  }
])

/* Get Row Actions */

const toast = useToast()
const { copy } = useClipboard()
const currentOrigin = ref('')

function getRowItems(row: Row<RowCells>) {
  return [
    {
      type: 'label',
      label: 'Open/Link'
    },
    {
      type: 'separator'
    },
    {
      label: 'Open Page',
      onSelect() {
        navigateTo(`${row.original.value}`, {
          external: false
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Copy Link',
      onSelect() {
        copy(currentOrigin.value + row.original.value)

        toast.add({
          title: 'Link Copied!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    }
  ]
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    currentOrigin.value = window.location.origin
  }
})
</script>

<template>
  <div>
    <div class="flex justify-between">
      <!-- globalFilter -->
      <div class="px-4 py-3.5 border-b border-accented">
        <UInput
          v-model="globalFilter"
          icon="i-lucide-search"
          class="max-w-md"
          placeholder="Filter Sermons..."
        />
      </div>
      <div class="w-5/16 px-4 py-3.5 justify-end border-b border-accented">
        <!-- columnVisibility -->
        <UDropdownMenu
          :items="
            table?.tableApi
              ?.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => ({
                label: upperFirst(column.id),
                type: 'checkbox' as const,
                checked: column.getIsVisible(),
                onUpdateChecked(checked: boolean) {
                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                },
                onSelect(e: Event) {
                  e.preventDefault()
                }
              }))
          "
          :content="{ align: 'end' }"
        >
          <UButton
            label="View"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
      </div>
    </div>
    <UTable
      ref="table"
      v-model:column-visibility="columnVisibility"
      v-model:sorting="sorting"
      v-model:global-filter="globalFilter"
      :data="data"
      :columns="columns"
      class="flex-1 whitespace-normal"
      :ui="{ td: 'whitespace-normal' }"
    />
  </div>
</template>
