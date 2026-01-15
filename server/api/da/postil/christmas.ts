// List of danish christmas sermons in Luther's Church Postil
const postil2 = [
  // { label: 'JulePostil', type: 'label' },

  { id: 241, postil: 'Jul', tag: 'Epistel', label: 'Juleaften', bible: 'Tit 2: 11-15', value: '/da/christmas/epistle-juleaften' },
  { id: 242, postil: 'Jul', tag: 'Evangelium', label: 'Juleaften', bible: 'Luk 2: 1-14', value: '/da/christmas/gospel-juleaften' },
  { id: 251, postil: 'Jul', tag: 'Epistel', label: '1. Juledag', bible: 'Tit 3: 4-7', value: '/da/christmas/1.epistle-juledag' },
  { id: 252, postil: 'Jul', tag: 'Evangelium', label: '1. Juledag', bible: 'Luk 2: 15-20', value: '/da/christmas/1.gospel-juledag' },
  { id: 253, postil: 'Jul', tag: 'Epistel', label: '1. Juledag', bible: 'Hebr 1: 1-12', value: '/da/christmas/2.epistle-juledag' },
  { id: 254, postil: 'Jul', tag: 'Evangelium', label: '1. Juledag', bible: 'Joh 1: 1-14', value: '/da/christmas/2.gospel-juledag' },
  { id: 261, postil: 'Jul', tag: 'Epistel', label: '2. Juledag', bible: 'ApG 6: 8-14 & 7:54-60', value: '/da/christmas/epistle-2.juledag' },
  { id: 262, postil: 'Jul', tag: 'Evangelium', label: '2. Juledag', bible: 'Matt 23: 34-39', value: '/da/christmas/gospel-2.juledag' },
  { id: 271, postil: 'Jul', tag: 'Epistel', label: '3. Juledag', bible: 'Sir 15: 1-8', value: '/da/christmas/epistle-3.juledag' },
  { id: 272, postil: 'Jul', tag: 'Evangelium', label: '3. Juledag', bible: 'Joh 21: 19-24', value: '/da/christmas#/gospel-3.juledag' },
  { id: 291, postil: 'Jul', tag: 'Epistel', label: 'Julesøndag', bible: 'Gal 4: 1-7', value: '/da/christmas/epistle-julesondag' },
  { id: 292, postil: 'Jul', tag: 'Evangelium', label: 'Julesøndag', bible: 'Luk 2: 33-40', value: '/da/christmas/gospel-julesondag' },
  { id: 321, postil: 'Jul', tag: 'Epistel', label: 'Nyårsdag', bible: 'Gal 3: 23-29', value: '/da/christmas/epistle-nyaarsdag' },
  { id: 322, postil: 'Jul', tag: 'Evangelium', label: 'Nyårsdag', bible: 'Luk 2: 21', value: '/da/christmas/gospel-nyaarsdag' },
  { id: 331, postil: 'Jul', tag: 'Epistel', label: 'Tre Konger', bible: 'Es 60: 1-6', value: '/da/christmas/epistle-helligtrekonger' },
  { id: 332, postil: 'Jul', tag: 'Evangelium', label: 'Tre Konger', bible: 'Matt 2: 1-12', value: '/da/christmas/gospel-helligtrekonger' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return postil2
})

// All bible book references need be like the one in Mdc/TableComponent.vue
