// List of sermons in Luther's Church Postil
const sermons = [
  { label: 'Most Relevant', type: 'label' },
  { label: 'Intro', value: '/en/' },
  { label: 'This week Gospel' },
  { label: 'This week Epistle' },
  { label: 'Last week Gospel' },
  { label: 'Last week Epistle' },
  { label: 'Next week Gospel' },
  { label: 'Next week Epistle' },
  { label: 'From Galaterne', type: 'label' },
  { label: 'Gal 1' },
  { label: 'Gal 2 ...' },
  { label: 'Gal 3 ...' },
  { label: 'Gal 4 ...' },
  { label: 'Gal 5 ...' },
  { type: 'separator' }
]

export default defineEventHandler(() => {
  return sermons
})
