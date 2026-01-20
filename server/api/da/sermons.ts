// List of sermons in Luther's Church Postil
const daSermons = [
  // { label: 'Advent Postil', type: 'label' },

  { id: 111, postil: 'Advent', tags: 'Epistel', label: '1.Søn.i Adv.', bible: 'Rom 13: 11-14', value: '/da/advent/epistle1' },
  { id: 112, postil: 'Advent', tags: 'Evangelium', label: '1.Søn.i Adv.', bible: 'Matt 21: 1-9', value: '/da/advent/gospel1' },
  { id: 121, postil: 'Advent', tags: 'Epistel', label: '2.Søn.i Adv.', bible: 'Rom 15: 4-13', value: '/da/advent/epistle2' },
  { id: 122, postil: 'Advent', tags: 'Evangelium', label: '2.Søn.i Adv.', bible: 'Luk 21: 25-36', value: '/da/advent/gospel2' },
  { id: 131, postil: 'Advent', tags: 'Epistel', label: '3.Søn.i Adv.', bible: '1 Kor 4: 1-5', value: '/da/advent/epistle3' },
  { id: 132, postil: 'Advent', tags: 'Evangelium', label: '3.Søn.i Adv.', bible: 'Matt 11: 2-10', value: '/da/advent/gospel3' },
  { id: 141, postil: 'Advent', tags: 'Epistel', label: '4.Søn.i Adv.', bible: 'Filem 4: 4-7', value: '/da/advent/epistle4' },
  { id: 142, postil: 'Advent', tags: 'Evangelium', label: '4.Søn.i Adv.', bible: 'Joh 1: 19-28', value: '/da/advent/gospel4' },

  // { type: 'separator' },
  // { label: 'Jule Postil; Julaften - Helligtrekongersdag', type: 'label' },

  { id: 241, postil: 'Jul', tags: 'Epistel', label: 'Juleaften', bible: 'Tit 2: 11-15', value: '/da/christmas/epistle-juleaften' },
  { id: 242, postil: 'Jul', tags: 'Evangelium', label: 'Juleaften', bible: 'Luk 2: 1-14', value: '/da/christmas/gospel-juleaften' },
  { id: 251, postil: 'Jul', tags: 'Epistel', label: '1. Juledag', bible: 'Tit 3: 4-7', value: '/da/christmas/1.epistle-juledag' },
  { id: 252, postil: 'Jul', tags: 'Evangelium', label: '1. Juledag', bible: 'Luk 2: 15-20', value: '/da/christmas/1.gospel-juledag' },
  { id: 253, postil: 'Jul', tags: 'Epistel', label: '1. Juledag', bible: 'Hebr 1: 1-12', value: '/da/christmas/2.epistle-juledag' },
  { id: 254, postil: 'Jul', tags: 'Evangelium', label: '1. Juledag', bible: 'Joh 1: 1-14', value: '/da/christmas/2.gospel-juledag' },
  { id: 261, postil: 'Jul', tags: 'Epistel', label: '2. Juledag', bible: 'ApG 6: 8-14 & 7:54-60', value: '/da/christmas/epistle-2.juledag' },
  { id: 262, postil: 'Jul', tags: 'Evangelium', label: '2. Juledag', bible: 'Matt 23: 34-39', value: '/da/christmas/gospel-2.juledag' },
  { id: 271, postil: 'Jul', tags: 'Epistel', label: '3. Juledag', bible: 'Sir 15: 1-8', value: '/da/christmas/epistle-3.juledag' },
  { id: 272, postil: 'Jul', tags: 'Evangelium', label: '3. Juledag', bible: 'Joh 21: 19-24', value: '/da/christmas#/gospel-3.juledag' },
  { id: 291, postil: 'Jul', tags: 'Epistel', label: 'Julesøndag', bible: 'Gal 4: 1-7', value: '/da/christmas/epistle-julesondag' },
  { id: 292, postil: 'Jul', tags: 'Evangelium', label: 'Julesøndag', bible: 'Luk 2: 33-40', value: '/da/christmas/gospel-julesondag' },
  { id: 321, postil: 'Jul', tags: 'Epistel', label: 'Nyårsdag', bible: 'Gal 3: 23-29', value: '/da/christmas/epistle-nyaarsdag' },
  { id: 322, postil: 'Jul', tags: 'Evangelium', label: 'Nyårsdag', bible: 'Luk 2: 21', value: '/da/christmas/gospel-nyaarsdag' },
  { id: 331, postil: 'Jul', tags: 'Epistel', label: 'Tre Konger', bible: 'Es 60: 1-6', value: '/da/christmas/epistle-helligtrekonger' },
  { id: 332, postil: 'Jul', tags: 'Evangelium', label: 'Tre Konger', bible: 'Matt 2: 1-12', value: '/da/christmas/gospel-helligtrekonger' },

  // { type: 'separator' },
  // { label: 'Vinter Postil; Epiphany - The Holy Week', type: 'label' },

  { id: 411, postil: 'Vinter', tags: 'Epistel', label: '1.S.e.Åbenb.', bible: 'Rom 12: 1-6', value: '/da/lent/epiphany-epistle01' },
  { id: 412, postil: 'Vinter', tags: 'Evangelium', label: '1. s.e.Åbenb.', bible: 'Luk 2: 42-52', value: '/da/lent/epiphany-gospel01' },
  { id: 421, postil: 'Vinter', tags: 'Epistel', label: '2. s.e.Åbenb.', bible: 'Rom 12: 6-16', value: '/da/lent/epiphany-epistle02' },
  { id: 422, postil: 'Vinter', tags: 'Evangelium', label: '2. s.e.Åbenb.', bible: 'Joh 2: 1-11', value: '/da/lent/epiphany-gospel02' },
  { id: 431, postil: 'Vinter', tags: 'Epistel', label: '3. s.e.Åbenb.', bible: 'Rom 12: 16-21', value: '/da/lent/epiphany-epistle03' },
  { id: 432, postil: 'Vinter', tags: 'Evangelium', label: '3. s.e.Åbenb.', bible: 'Matt 8: 1-13', value: '/da/lent/epiphany-gospel03' },
  { id: 441, postil: 'Vinter', tags: 'Epistel', label: '4. s.e.Åbenb.', bible: 'Rom 13: 8-10', value: '/da/lent/epiphany-epistle04' },
  { id: 442, postil: 'Vinter', tags: 'Evangelium', label: '4. s.e.Åbenb.', bible: 'Matt 8: 23-27', value: '/da/lent/epiphany-gospel04' },
  { id: 451, postil: 'Vinter', tags: 'Epistel', label: '5. s.e.Åbenb.', bible: 'Kol 3: 12-17', value: '/da/lent/epiphany-epistle05' },
  { id: 452, postil: 'Vinter', tags: 'Evangelium', label: '5. s.e.Åbenb.', bible: 'Matt 13: 24-30', value: '/da/lent/epiphany-gospel05' },
  { id: 461, postil: 'Vinter', tags: 'Epistel', label: 'Septuagesima', bible: '1 Kor 9: 24-10,5', value: '/da/lent/septuagesima-epistle' },
  { id: 462, postil: 'Vinter', tags: 'Evangelium', label: 'Septuagesima', bible: 'Matt 20: 1-16', value: '/da/lent/septuagesima-gospel' },
  { id: 471, postil: 'Vinter', tags: 'Epistel', label: 'Seksagesima', bible: '2 Kor 11: 19-12,9', value: '/da/lent/sexagesima-epistle' },
  { id: 472, postil: 'Vinter', tags: 'Evangelium', label: 'Seksagesima', bible: 'Luk 8: 5-15', value: '/da/lent/sexagesima-gospel' },
  { id: 481, postil: 'Vinter', tags: 'Epistel', label: 'Fastelavenss.', bible: '1 Kor 13: 1-13', value: '/da/lent/fastelavens-sondag-epistle' },
  { id: 482, postil: 'Vinter', tags: 'Evangelium', label: 'Fastelavenss.', bible: 'Luk 18, 31-43', value: '/da/lent/fastelavens-sondag-gospel' },

  // { type: 'separator' }
  // { label: '1. Sommer Postil', type: 'label' },

  { id: 1011, postil: 'Sommer', tags: 'Epistel', label: '1.Søn.e.påske', bible: '1 Joh 5: 4-12', value: '/da/easter/epistle01' },
  { id: 1012, postil: 'Sommer', tags: 'Evangelium', label: '1.Søn.e.påske', bible: 'Joh 20: 19-31', value: '/da/easter/gospel01' },
  { id: 1021, postil: 'Sommer', tags: 'Epistel', label: '2.Søn.e.påske', bible: '1 Pet 2: 20-25', value: '/da/easter/epistle02' },
  { id: 1022, postil: 'Sommer', tags: 'Evangelium', label: '2.Søn.e.påske', bible: 'Joh 10: 11-16', value: '/da/easter/gospel02' },
  { id: 1031, postil: 'Sommer', tags: 'Epistel', label: '3.Søn.e.påske', bible: '1 Pet 2: 11-20', value: '/da/easter/epistle03' },
  { id: 1032, postil: 'Sommer', tags: 'Evangelium', label: '3.Søn.e.påske', bible: 'Joh 16: 16-23', value: '/da/easter/gospel03' },
  { id: 1041, postil: 'Sommer', tags: 'Epistel', label: '4.Søn.e.påske', bible: 'Jak 1: 16-21', value: '/da/easter/epistle04' },
  { id: 1042, postil: 'Sommer', tags: 'Evangelium', label: '4.Søn.e.påske', bible: 'Joh 16: 5-15', value: '/da/easter/gospel04' },

  // { type: 'separator' }
  // { label: '1. Trinity I Postil', type: 'label' },

  { id: 2011, postil: 'Trinity I', tags: 'Epistel', label: '1.Søn.e.Tref.', bible: 'Rom 11: 33-36', value: '/da/trinity1/epistle01' },
  { id: 2012, postil: 'Trinity I', tags: 'Evangelium', label: '1.Søn.e.Tref.', bible: 'Luk 16: 19-31', value: '/da/trinity1/gospel01' },
  { id: 2021, postil: 'Trinity I', tags: 'Epistel', label: '2.Søn.e.Tref.', bible: '1 Joh 3: 13-18', value: '/da/trinity1/epistle2' },
  { id: 2022, postil: 'Trinity I', tags: 'Evangelium', label: '2.Søn.e.Tref.', bible: 'Luk 14: 16-24', value: '/da/trinity1/gospel02' },
  { id: 2031, postil: 'Trinity I', tags: 'Epistel', label: '3.Søn.e.Tref.', bible: '1 Pet 5: 5-11', value: '/da/trinity1/epistle03' },
  { id: 2032, postil: 'Trinity I', tags: 'Evangelium', label: '3.Søn.e.Tref.', bible: 'Luk 15: 1-10', value: '/da/trinity1/gospel03' },
  { id: 2041, postil: 'Trinity I', tags: 'Epistel', label: '4.Søn.e.Tref.', bible: 'Rom 8: 18-22', value: '/da/trinity1/epistle04' },
  { id: 2042, postil: 'Trinity I', tags: 'Evangelium', label: '4.Søn.e.Tref.', bible: 'Luk 6: 36-42', value: '/da/trinity1/gospel04' },
  { id: 2051, postil: 'Trinity I', tags: 'Epistel', label: '5.Søn.e.Tref.', bible: '1 Pet 3: 8-15', value: '/da/trinity1/epistle05' },
  { id: 2052, postil: 'Trinity I', tags: 'Evangelium', label: '5.Søn.e.Tref.', bible: 'Luk 5: 1-11', value: '/da/trinity1/gospel05' },
  { id: 2061, postil: 'Trinity I', tags: 'Epistel', label: '6.Søn.e.Tref.', bible: 'Rom 6: 3-11', value: '/da/trinity1/epistle06' },
  { id: 2062, postil: 'Trinity I', tags: 'Evangelium', label: '6.Søn.e.Tref.', bible: 'Matt 5: 20-26', value: '/da/trinity1/gospel06' },
  { id: 2071, postil: 'Trinity I', tags: 'Epistel', label: '7.Søn.e.Tref.', bible: 'Rom 6: 19-23', value: '/da/trinity1/epistle07' },
  { id: 2072, postil: 'Trinity I', tags: 'Evangelium', label: '7.Søn.e.Tref.', bible: 'Mark 8: 1-9', value: '/da/trinity1/gospel07' },
  { id: 2081, postil: 'Trinity I', tags: 'Epistel', label: '8.Søn.e.Tref.', bible: 'Rom 8: 12-17', value: '/da/trinity1/epistle08' },
  { id: 2082, postil: 'Trinity I', tags: 'Evangelium', label: '8.Søn.e.Tref.', bible: 'Matt 7: 15-23', value: '/da/trinity1/gospel08' },
  { id: 2091, postil: 'Trinity I', tags: 'Epistel', label: '9.Søn.e.Tref.', bible: '1 Kor 10: 6-13', value: '/da/trinity1/epistle09' },
  { id: 2092, postil: 'Trinity I', tags: 'Evangelium', label: '9.Søn.e.Tref.', bible: 'Luk 16: 1-9', value: '/da/trinity1/gospel09' },
  { id: 2101, postil: 'Trinity I', tags: 'Epistel', label: '10.Søn.e.Tref.', bible: '1 Kor 12: 1-11', value: '/da/trinity1/epistle10' },
  { id: 2102, postil: 'Trinity I', tags: 'Evangelium', label: '10.Søn.e.Tref.', bible: 'Luk 19: 41-48', value: '/da/trinity1/gospel10' },
  { id: 2111, postil: 'Trinity I', tags: 'Epistel', label: '11.Søn.e.Tref.', bible: '1 Kor 15: 1-10', value: '/da/trinity1/epistle111' },
  { id: 2112, postil: 'Trinity I', tags: 'Evangelium', label: '11.Søn.e.Tref.', bible: 'Luk 18: 9-14', value: '/da/trinity1/gospel1' },
  { id: 2121, postil: 'Trinity I', tags: 'Epistel', label: '12.Søn.e.Tref.', bible: '2 Kor 3: 4-11', value: '/da/trinity1/epistle12' },
  { id: 2122, postil: 'Trinity I', tags: 'Evangelium', label: '12.Søn.e.Tref.', bible: 'Mark 7: 31-37', value: '/da/trinity1/gospel12' },

  // { type: 'separator' }
  // { label: '1. Trinity II Postil', type: 'label' },

  { id: 2131, postil: 'Trinity II', tags: 'Epistel', label: '13.Søn.e.Tref.', bible: 'Gal 3: 15-22', value: '/da/trinity2/epistle13' },
  { id: 2132, postil: 'Trinity II', tags: 'Evangelium', label: '13.Søn.e.Tref.', bible: 'Luk 10, 23-37', value: '/da/trinity2/gospel13' },
  { id: 2141, postil: 'Trinity II', tags: 'Epistel', label: '14.Søn.e.Tref.', bible: 'Gal 5: 16-24', value: '/da/trinity2/epistle14' },
  { id: 2142, postil: 'Trinity II', tags: 'Evangelium', label: '14.Søn.e.Tref.', bible: 'Luk 17: 11-19', value: '/da/trinity2/gospel14' },
  { id: 2151, postil: 'Trinity II', tags: 'Epistel', label: '15.Søn.e.Tref.', bible: 'Gal 5:25 - 6:10', value: '/da/trinity2/epistle15' },
  { id: 2152, postil: 'Trinity II', tags: 'Evangelium', label: '15.Søn.e.Tref.', bible: 'Matt 6: 24-34', value: '/da/trinity2/gospel15' },
  { id: 2161, postil: 'Trinity II', tags: 'Epistel', label: '16.Søn.e.Tref.', bible: 'Ef 3: 13-21', value: '/da/trinity2/epistle16' },
  { id: 2162, postil: 'Trinity II', tags: 'Evangelium', label: '16.Søn.e.Tref.', bible: 'Luk 7: 11-17', value: '/da/trinity2/gospel16' },
  { id: 2171, postil: 'Trinity II', tags: 'Epistel', label: '17.Søn.e.Tref.', bible: 'Ef 4: 1-6', value: '/da/trinity2/epistle17' },
  { id: 2172, postil: 'Trinity II', tags: 'Evangelium', label: '17.Søn.e.Tref.', bible: 'Luk 14: 1-11', value: '/da/trinity2/gospel17' },
  { id: 2181, postil: 'Trinity II', tags: 'Epistel', label: '18.Søn.e.Tref.', bible: '1 Kor 1: 4-9', value: '/da/trinity2/epistle18' },
  { id: 2182, postil: 'Trinity II', tags: 'Evangelium', label: '18.Søn.e.Tref.', bible: 'Matt 22: 34-46', value: '/da/trinity2/gospel18' },
  { id: 2191, postil: 'Trinity II', tags: 'Epistel', label: '19.Søn.e.Tref.', bible: 'Ef 4: 22-28', value: '/da/trinity2/epistle19' },
  { id: 2192, postil: 'Trinity II', tags: 'Evangelium', label: '19.Søn.e.Tref.', bible: 'Matt 9: 1-8', value: '/da/trinity2/gospel19' },
  { id: 2201, postil: 'Trinity II', tags: 'Epistel', label: '20.Søn.e.Tref.', bible: 'Ef 5: 15-21', value: '/da/trinity2/epistle20' },
  { id: 2202, postil: 'Trinity II', tags: 'Evangelium', label: '29.Søn.e.Tref.', bible: 'Matt 22: 1-14', value: '/da/trinity2/gospel20' },
  { id: 2211, postil: 'Trinity II', tags: 'Epistel', label: '21.Søn.e.Tref.', bible: 'Ef 6: 10-17', value: '/da/trinity2/epistle21' },
  { id: 2212, postil: 'Trinity II', tags: 'Evangelium', label: '21.Søn.e.Tref.', bible: 'Joh 4: 46-54', value: '/da/trinity2/gospel21' },
  { id: 2215, postil: 'Trinity II', tags: 'Evangelium', label: 'AlleHelgensd.', bible: 'Matt 5: 1-12', value: '/da/trinity2/evangelium-alle-helgens-dag' },
  { id: 2221, postil: 'Trinity II', tags: 'Epistel', label: '22.Søn.e.Tref.', bible: 'Fil 1: 3-11', value: '/da/trinity2/epistle22' },
  { id: 2222, postil: 'Trinity II', tags: 'Evangelium', label: '22.Søn.e.Tref.', bible: 'Matt 18: 23-35', value: '/da/trinity2/gospel22' },
  { id: 2231, postil: 'Trinity II', tags: 'Epistel', label: '23.Søn.e.Tref.', bible: 'Fil 3: 17-21', value: '/da/trinity2/epistle23' },
  { id: 2232, postil: 'Trinity II', tags: 'Evangelium', label: '23.Søn.e.Tref.', bible: 'Matt 22: 15-22', value: '/da/trinity2/gospel23' },
  { id: 2241, postil: 'Trinity II', tags: 'Epistel', label: '24.Søn.e.Tref.', bible: 'Kol 1: 3-14', value: '/da/trinity2/epistle24' },
  { id: 2242, postil: 'Trinity II', tags: 'Evangelium', label: '24.Søn.e.Tref.', bible: 'Matt 9: 18-26', value: '/da/trinity2/gospel24' },
  { id: 2251, postil: 'Trinity II', tags: 'Epistel', label: '25.Søn.e.Tref.', bible: '1 Thess 4: 13-18', value: '/da/trinity2/epistle25' },
  { id: 2252, postil: 'Trinity II', tags: 'Evangelium', label: '25.Søn.e.Tref.', bible: 'Matt 24: 15-28', value: '/da/trinity2/gospel25' },
  { id: 2261, postil: 'Trinity II', tags: 'Epistel', label: '26.Søn.e.Tref.', bible: '2Thess 1: 3-10', value: '/da/trinity2/epistle26' },
  { id: 2262, postil: 'Trinity II', tags: 'Evangelium', label: '26.Søn.e.Tref.', bible: 'Matt 25: 31-42', value: '/da/trinity2/gospel26' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return daSermons
})

// All bible book references need be like the one in Mdc/TableComponent.vue
