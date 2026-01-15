// List of sermons in Luther's Church Postil
const uddrag1 = [
  // { label: '1. Uddrag', type: 'label' },

  { id: 3001, postil: 'Uddrag', tag: 'Evangelium', label: 'Julesøndag', bible: 'Luk 2, 33-40', value: '/da/christmas/gospel-julesondag', description: 'To typer forargelser. Den mindste forargelse, forårsager dem, der "synder mod Moselovens anden tavle". Den værste forargelse er forårsaget af dem, der "synder imod Moselovens første tavle, mod troen samt mod Guds ære og hans gerninger."' },
  { id: 3002, postil: 'Uddrag', tag: 'Epistel', label: 'Julesøndag', bible: 'Gal 4, 1-7', value: '/da/christmas/epistle-julesondag', description: 'Disse versene fra Paulus brev til Galaterne om at vi er Guds arvinger og har barnekår og ikke træller under loven, inneholder den mest viktige Lutherske lærdommen.' },
  { id: 3003, postil: 'Uddrag', tag: 'Epistel', label: 'Nyårsdag', bible: 'Gal 3, 23-29', value: '/da/christmas/epistle-nyaarsdag', description: 'Luthers prædikner over Galaterbrevet inneholder de viktigste lærdommene. I denne prædikenen er det særlig trøsterigt å lese/ høre om at vi er "Guds barn ved troen" og "arvinger i kraft av Guds løfte."' },
  { id: 3004, postil: 'Uddrag', tag: 'Epistel', label: '1.Søn. i faste', bible: '2 Kor 6, 1-10', value: '/da/lent/epistle-sunday01' },
  { id: 3005, postil: 'Uddrag', tag: 'Epistel', label: '2. Søndag', bible: 'Rom 15: 4-13', value: '/da/lent/epiphany-epistle02' },
  { id: 3006, postil: 'Uddrag', tag: 'Evangelium', label: '2. Søndag', bible: 'Luke 21: 25-36', value: '/da/lent/epiphany-gospel02' },
  { id: 3007, postil: 'Uddrag', tag: 'Epistel', label: '3. Søndag', bible: '1 Cor 4: 1-5', value: '/da/lent/epiphany-epistle03' },
  { id: 3008, postil: 'Uddrag', tag: 'Evangelium', label: '3. Søndag', bible: 'Matt 11: 2-10', value: '/da/lent/epiphany-gospel03' },
  { id: 3009, postil: 'Uddrag', tag: 'Epistel', label: '4. Søndag', bible: 'Phil 4: 4-7', value: '/da/lent/epiphany-epistle04' },
  { id: 3010, postil: 'Uddrag', tag: 'Evangelium', label: '4. Søndag', bible: 'John 1: 19-28', value: '/da/lent/epiphany-gospel04' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return uddrag1
})
