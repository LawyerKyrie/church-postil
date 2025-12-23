export default defineAppConfig({
  ui: {
    contentToc: {
      slots: {
        // Adjust the 'root' class: change top positioning to 'top-0'
        // and potentially remove background effects.
        // sticky top-0 z-10 bg-white dark:bg-gray-900 -mx-4 px-4 sm:px-6 sm:-mx-6 overflow-y-auto max-h-[calc(100vh)]
        root: 'sticky top-0 z-10'
      }
    },
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'Church Postil'
  },
  header: {
    slot: { root: 'relative top-auto z-60' },
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true
    // links: [{ /* Removed link to GitHub here */ }]

  },
  footer: {
    credits: `@LawyerKyrie • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://go.nuxt.com/discord',
      'target': '_blank',
      'aria-label': 'Nuxt on Discord'
    }, {
      'icon': 'i-simple-icons-x',
      'to': 'https://go.nuxt.com/x',
      'target': '_blank',
      'aria-label': 'Nuxt on X'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/LawyerKyrie/church-postil/',
      'target': '_blank',
      'aria-label': 'Church Postil on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/LawyerKyrie/church-postil/edit/main/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/LawyerKyrie/church-postil',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Church Postil Docs',
        to: 'https://github.com/LawyerKyrie/church-postil',
        target: '_blank'
      }]
    }
  }
})
