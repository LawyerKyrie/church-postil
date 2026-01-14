// OpenHeaderMenu Select Menu & Ctrl k (movable menu)
const daSelectMenu = [
  { label: 'Advents Postil - Advent til Jul', type: 'label' },

  { label: '1. Søndag', bible: 'Rom 13: 11-14', value: '/da/advent/epistle1' },
  { label: '1. Søndag', bible: 'Matt 21: 1-9', value: '/da/advent/gospel1' },
  { label: '2. Søndag', bible: 'Rom 15: 4-13', value: '/da/advent/epistle2' },
  { label: '2. Søndag', bible: 'Luke 21: 25-36', value: '/da/advent/gospel2' },
  { label: '3. Søndag', bible: '1 Cor 4: 1-5', value: '/da/advent/epistle3' },
  { label: '3. Søndag', bible: 'Matt 11: 2-10', value: '/da/advent/gospel3' },
  { label: '4. Søndag', bible: 'Phil 4: 4-7', value: '/da/advent/epistle4' },
  { label: '4. Søndag', bible: 'John 1: 19-28', value: '/da/advent/gospel4' },

  { label: 'Jule Postil - Juleaften - Helligtrekongersdag', type: 'label' },

  { id: 241, postil: 'Jul', tag: 'Epistel', label: 'Juleaften', bible: 'Titus 2: 11-15', value: '/da/christmas/epistle-juleaften' },
  { id: 242, postil: 'Jul', tag: 'Evangelium', label: 'Juleaften', bible: 'Luke 2: 1-14', value: '/da/christmas/gospel-juleaften' },
  { id: 251, postil: 'Jul', tag: 'Epistel', label: '1. Juledag', bible: 'Tit 3: 4-7', value: '/da/christmas/1.epistle-juledag' },
  { id: 252, postil: 'Jul', tag: 'Evangelium', label: '1. Juledag', bible: 'Luk 2: 15-20', value: '/da/christmas/1.gospel-juledag' },
  { id: 253, postil: 'Jul', tag: 'Epistel', label: '1. Juledag', bible: 'Hebr 1: 1-12', value: '/da/christmas/2.epistle-juledag' },
  { id: 254, postil: 'Jul', tag: 'Evangelium', label: '1. Juledag', bible: 'Joh 1: 1-14', value: '/da/christmas/2.gospel-juledag' },
  { id: 261, postil: 'Jul', tag: 'Epistel', label: '2. Juledag', bible: 'ApG 6: 8-14 & 7:54-60', value: '/da/christmas/epistle-2.juledag' },
  { id: 262, postil: 'Jul', tag: 'Evangelium', label: '2. Juledag', bible: 'Matt 23: 34-39', value: '/da/christmas/gospel-2.juledag' },
  { id: 271, postil: 'Jul', tag: 'Epistel', label: '3. Juledag', bible: 'Sirak 15: 1-8', value: '/da/christmas/epistle-3.juledag' },
  { id: 272, postil: 'Jul', tag: 'Evangelium', label: '3. Juledag', bible: 'John 21: 19-24', value: '/da/christmas#/gospel-3.juledag' },
  { id: 291, postil: 'Jul', tag: 'Epistel', label: 'Julesøndag', bible: 'Gal 4: 1-7', value: '/da/christmas/epistle-julesondag' },
  { id: 292, postil: 'Jul', tag: 'Evangelium', label: 'Julesøndag', bible: 'Luk 2: 33-40', value: '/da/christmas/gospel-julesondag' },
  { id: 321, postil: 'Jul', tag: 'Epistel', label: 'Nyårsdag', bible: 'Gal 3: 23-29', value: '/da/christmas/epistle-nyaarsdag' },
  { id: 322, postil: 'Jul', tag: 'Evangelium', label: 'Nyårsdag', bible: 'Luk 2: 21', value: '/da/christmas/gospel-nyaarsdag' },
  { id: 331, postil: 'Jul', tag: 'Epistel', label: 'Tre Konger', bible: 'Esajas 60: 1-6', value: '/da/christmas/epistle-helligtrekonger' },
  { id: 332, postil: 'Jul', tag: 'Evangelium', label: 'Tre Konger', bible: 'Matt 2: 1-12', value: '/da/christmas/gospel-helligtrekonger' },

  { label: 'Vinter Postil - Fra 1.Åpenbaringssøndag til påskeuka', type: 'label' },
  { id: 411, postil: 'Vinter', tag: 'Epistel', label: '1. Søndag', bible: 'Rom 13: 11-14', value: '/da/lent/epiphany-epistle01' },
  { id: 412, postil: 'Vinter', tag: 'Evangelium', label: '1. Søndag', bible: 'Matt 21: 1-9', value: '/da/lent/epiphany-gospel01' },

  { label: '4. Postil - Easter - Pentecost - Trinity', type: 'label' },
  { label: 'Summer Postil is coming soon', value: '/en/easter' },

  { label: 'Trinity I; 1 - 12. Sunday after Trinity', type: 'label' },
  { label: 'Trinity I Postil is coming soon', value: '/en/trinity1' },

  { label: 'Trinity II; 13- 26. Sunday after Trinity', type: 'label' },
  { label: 'Trinity II Postil is coming soon', value: '/en/trinity2' },

  { type: 'separator' }
]

export default defineEventHandler(() => {
  return daSelectMenu
})
