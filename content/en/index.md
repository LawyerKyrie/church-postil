---
seo:
  title: Church Postil (en/da)
  description: Luther's Church Postil (Kirke Postille)
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal

---
<!-- markdownlint-disable MD018 -->
#top
:hero-background

#title
Luther's [Church Postil]{.text-primary}

#description

&nbsp;Landing page - Choose between English and Danish Church Postil.

#links

  :::u-button
  ---
  icon: i-iconoir-language
  size: xl
  to: /en/?action=selectEnglish
  trailing-icon: i-lucide-arrow-right

  ---
  English
  :::

  :::u-button
  ---
  icon: i-lucide-languages
  color: neutral
  variant: outline
  size: xl
  to: /da/?action=selectDanish
  trailing-icon: i-lucide-arrow-right

  ---
  Danish
  :::

::

::client-only
  ::MdcTableComponent
::client-only
