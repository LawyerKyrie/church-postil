// List of sermons in Luther's Church Postil
const postil1 = [
  // { label: '1. Advent Postil', type: 'label' },

  { id: 11, postil: 'Advent', tag: 'Epistel', label: '1. Søndag', bible: 'Rom 13: 11-14', value: '/da/advent/epistle1' },
  { id: 12, postil: 'Advent', tag: 'Evangelium', label: '1. Søndag', bible: 'Matt 21: 1-9', value: '/da/advent/gospel1' },
  { id: 21, postil: 'Advent', tag: 'Epistel', label: '2. Søndag', bible: 'Rom 15: 4-13', value: '/da/advent/epistle2' },
  { id: 22, postil: 'Advent', tag: 'Evangelium', label: '2. Søndag', bible: 'Luk 21: 25-36', value: '/da/advent/gospel2' },
  { id: 31, postil: 'Advent', tag: 'Epistel', label: '3. Søndag', bible: '1 Kor 4: 1-5', value: '/da/advent/epistle3' },
  { id: 32, postil: 'Advent', tag: 'Evangelium', label: '3. Søndag', bible: 'Matt 11: 2-10', value: '/da/advent/gospel3' },
  { id: 41, postil: 'Advent', tag: 'Epistel', label: '4. Søndag', bible: 'Filem 4: 4-7', value: '/da/advent/epistle4' },
  { id: 42, postil: 'Advent', tag: 'Evangelium', label: '4. Søndag', bible: 'Joh 1: 19-28', value: '/da/advent/gospel4' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return postil1
})

// All bible book references need be like the one in Mdc/TableComponent.vue
