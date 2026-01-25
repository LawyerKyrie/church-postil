// English Index Page
export default defineEventHandler(() => {
  const enSermons = [

    { id: 6222, postil: 'Trinity II', tags: 'Gospel', label: '22.Sun.a.Trin.', bible: 'Matt 18: 23-35', value: '/da/trinity2/gospel22' },
    { id: 6231, postil: 'Trinity II', tags: 'Epistle', label: '23.Sun.a.Trin.', bible: 'Phil 3: 17-21', value: '/da/trinity2/epistle23' },
    { id: 6232, postil: 'Trinity II', tags: 'Gospel', label: '23.Sun.a.Trin.', bible: 'Matt 22: 15-22', value: '/da/trinity2/gospel23' },
    { id: 6241, postil: 'Trinity II', tags: 'Epistle', label: '24.Sun.a.Trin.', bible: 'Col 1: 3-14', value: '/da/trinity2/epistle24' },
    { id: 6242, postil: 'Trinity II', tags: 'Gospel', label: '24.Sun.a.Trin.', bible: 'Matt 9: 18-26', value: '/da/trinity2/gospel24' },
    { id: 6251, postil: 'Trinity II', tags: 'Epistle', label: '25.Sun.a.Trin.', bible: '1 Thess 4: 13-18', value: '/da/trinity2/epistle25' },
    { id: 6252, postil: 'Trinity II', tags: 'Gospel', label: '25.Sun.a.Trin.', bible: 'Matt 24: 15-28', value: '/da/trinity2/gospel25' },
    { id: 6261, postil: 'Trinity II', tags: 'Epistle', label: '26.Sun.a.Trin.', bible: '2Thess 1: 3-10', value: '/da/trinity2/epistle26' },
    { id: 6262, postil: 'Trinity II', tags: 'Gospel', label: '26.Sun.a.Trin.', bible: 'Matt 25: 31-42', value: '/da/trinity2/gospel26' }

  ]

  console.log('Api call from api/en/ssrapitest.ts - enSermons = ', enSermons)

  return enSermons
})
