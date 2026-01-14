// List of sermons in Luther's Church Postil
const postil3 = [
  // { label: '1. Uddrag', type: 'label' },

  { id: 4001, postil: 'Uddrag', tag: 'Evangelium', label: 'Julesøndag', bible: 'Luk 2, 33-40', value: '/da/christmas/gospel-julesondag', description: 'To typer forargelser. Den mindste forargelse, forårsager dem, der "synder mod Moselovens anden tavle". Den værste forargelse er forårsaget af dem, der "synder imod Moselovens første tavle, mod troen samt mod Guds ære og hans gerninger."' },
  { id: 4002, postil: 'Uddrag', tag: 'Epistel', label: '1.Søn. i faste', bible: '2 Kor 6, 1-10', value: '/da/lent/epistle-sunday01', description: 'Kampen med retfærdighedens våben til venstre og højre side. Kampen til højre side handler om at kæmpe mod ønsked om at lade sig hædre og hæve over andre. Mens kampen på venstre side handler om at kæmpe imod at tabe tålmodigheden, når man bliver vanæret, fordrjet, tugtet, bagtalt, hånet, og udskældt.' },
  { id: 4003, postil: 'Uddrag', tag: 'Evangelium', label: '3.Søn. e. tref.', bible: 'Luk 15, 1-10', value: '/da/trinity1/sunday01-gospel', description: '"Vi skal ikke give Djævelen adgang, når han ved loven vil bryde ind i Krist brudekammer og sætte sig i hans sted, det vil sige, betage samvittigheden dens glæde og trøst". Se mer om "brudekammer" i Luthers store forklaring over Galaterbrevet.' },
  { id: 4004, postil: 'Uddrag', tag: 'Evangelium', label: 'Helligtrekongersdag', bible: 'Matt 2, 1-12', value: '/da/christmas/gospel-helligtrekonger', description: 'Brug søgeordet "samvittighed" for å lese 39 opbyggelige uttalelser om sagen.' },
  { id: 4005, postil: 'Uddrag', tag: 'Epistel', label: '3. Søndag', bible: '1 Cor 4: 1-5', value: '/da/lent/epiphany-epistle03' },
  { id: 4006, postil: 'Uddrag', tag: 'Evangelium', label: '3. Søndag', bible: 'Matt 11: 2-10', value: '/da/lent/epiphany-gospel03' },
  { id: 4007, postil: 'Uddrag', tag: 'Epistel', label: '4. Søndag', bible: 'Phil 4: 4-7', value: '/da/lent/epiphany-epistle04' },
  { id: 4008, postil: 'Uddrag', tag: 'Evangelium', label: '4. Søndag', bible: 'John 1: 19-28', value: '/da/lent/epiphany-gospel04' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return postil3
})
