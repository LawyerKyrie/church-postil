<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import type { Column, Row } from '@tanstack/vue-table'
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

const columns: TableColumn<RowCells>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, '#'),
    cell: ({ row }) => `${row.getValue('id')}`
  },
  {
    accessorKey: 'postil',
    header: ({ column }) => getHeader(column, 'Postil'),
    cell: ({ row }) => `${row.getValue('postil')}`
  },
  {
    accessorKey: 'tag',
    header: ({ column }) => getHeader(column, 'Gospel?'),
    cell: ({ row }) => `${row.getValue('tag')}`
  },
  {
    accessorKey: 'label',
    header: ({ column }) => getHeader(column, 'Label'),
    cell: ({ row }) => row.original.label
  },
  {
    accessorKey: 'value',
    header: ({ column }) => getHeader(column, 'Value'),
    cell: ({ row }) => row.original.value
  },
  {
    accessorKey: 'bible',
    header: ({ column }) => getHeader(column, 'Bible'),
    cell: ({ row }) => `${row.getValue('bible')}`
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

function getHeader(column: Column<RowCells>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      'content': {
        align: 'start'
      },
      'aria-label': 'Actions dropdown',
      'items': [
        {
          label: 'Asc',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          }
        },
        {
          label: 'Desc',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          }
        }
      ]
    },
    () =>
      h(UButton, {
        'color': 'neutral',
        'variant': 'ghost',
        label,
        'icon': isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        'class': '-mx-2.5 data-[state=open]:bg-elevated',
        'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`
      })
  )
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

function getRowItems(row: Row<RowCells>) {
  return [
    {
      type: 'label',
      label: 'Open Page'
    },
    {
      type: 'separator'
    },
    {
      label: 'Same Tab',
      onSelect() {
        navigateTo(`${row.original.value}`, {
          external: false
        })
      }
    },
    {
      label: 'New Tab',
      onSelect() {
        navigateTo(`${row.original.value}`, {
          external: true,
          open: {
            target: '_blank'
          }
        })
      }
    },
    {
      label: 'New Window',
      onSelect() {
        navigateTo(`${row.original.value}`, {
          external: true,
          open: {
            target: '_blank',
            windowFeatures: { width: 800, height: 600 }
          }
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Copy Link',
      onSelect() {
        copy(row.original.value)

        toast.add({
          title: 'Link Copied!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    }
  ]
}
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
