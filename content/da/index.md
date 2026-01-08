---
seo:
  title: Kirke Postille
  description: Luthers Kirke Postille på Dansk
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal

---
<!-- markdownlint-disable MD018 -->
#top
:hero-background

#title
Luthers [Kirke Postille]{.text-primary}

#description
Velg mellom engelsk og dansk kirkepostille.

#links

  :::u-button
  ---
  icon: i-iconoir-language
  color: neutral
  variant: outline
  size: xl
  to: /en/?action=selectLanguage
  trailing-icon: i-lucide-arrow-right

  ---
  Engelsk
  :::

  :::u-button
  ---
  icon: i-lucide-languages
  size: xl
  to: /da/?action=selectLanguage
  trailing-icon: i-lucide-arrow-right

  ---
  Dansk
  :::

::

::client-only
  ::MdcTableComponent{apiFile="da-sermons"}
::client-only
