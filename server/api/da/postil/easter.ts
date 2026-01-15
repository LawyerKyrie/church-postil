// List of sermons in Luther's Church Postil
const postil4 = [
  // { label: '1. EasterPostil', type: 'label' },

  { id: 1011, postil: 'Easter', tag: 'Epistel', label: '1. Søndag', bible: '1 Joh 5: 4-12', value: '/da/easter/epistle01' },
  { id: 1012, postil: 'Easter', tag: 'Evangelium', label: '1. Søndag', bible: 'Joh 20: 19-31', value: '/da/easter/gospel01' },
  { id: 1021, postil: 'Easter', tag: 'Epistel', label: '2. Søndag', bible: '1 Pet 2: 20-25', value: '/da/easter/epistle02' },
  { id: 1022, postil: 'Easter', tag: 'Evangelium', label: '2. Søndag', bible: 'Joh 10: 11-16', value: '/da/easter/gospel02' },
  { id: 1031, postil: 'Easter', tag: 'Epistel', label: '3. Søndag', bible: '1 Pet 2: 11-20', value: '/da/easter/epistle03' },
  { id: 1032, postil: 'Easter', tag: 'Evangelium', label: '3. Søndag', bible: 'Joh 16: 16-23', value: '/da/easter/gospel03' },
  { id: 1041, postil: 'Easter', tag: 'Epistel', label: '4. Søndag', bible: 'Jak 1: 16-21', value: '/da/easter/epistle04' },
  { id: 1042, postil: 'Easter', tag: 'Evangelium', label: '4. Søndag', bible: 'Joh 16: 5-15', value: '/da/easter/gospel04' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return postil4
})

// All bible book references need be like the one in Mdc/TableComponent.vue
