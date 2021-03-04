const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    layers: ['components', 'utilities'],
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}'
    ]
  },
  darkMode: false,
  theme: {
    screens: {
      mobile: '420px',
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
    fontFamily: {
      sans: ['Gilroy', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      primary: colors.blue,
      accent: colors.yellow,
      'accent-1': colors.emerald,
      fb: 'var(--facebook-bg)',
      'fb-hover': 'var(--facebook-bg-hovered)',
    },
    boxShadow: {
      ...defaultTheme.boxShadow,
      solid: `0 0 0 5px ${colors.yellow[400]}`
    },
    extend: {
      height: {
        '94': '20rem',
        '120': '32rem',
        '90%': '90%'
      },
      minWidth: {
        '300px': '300px'
      }
    },
  },
  variants: {
    backgroundSize: ['important', 'responsive'],
    backgroundColor: ['important', 'hover', 'responsive'],
    fontSize: ['important', 'responsive'],
    backgroundRepeat: ['important', 'responsive'],
    backgroundPosition: ['important', 'responsive'],
    borderColor: ['important', 'focus', 'hover', 'dark'],
    border: ['focus', 'important'],
    display: ['responsive', 'hover'],
    transform: ['hover'],
    outline: ['focus'],
    cursor: ['hover'],
    padding: ['important', 'responsive'],
    extend: {
      transform: ['hover'],
    },
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('readonly', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`readonly${separator}${className}`)}:read-only`
        })
      })

      addVariant('focus', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`focus${separator}${className}`)}:read-only:focus`
        })
      })

      addVariant('hover', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`hover${separator}${className}`)}:read-only:hover`
        })
      })

      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.important = true
          })
        })
      });

      addVariant('before', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`before${separator}${className}`)}::before`;
        });
      });
      addVariant('after', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`after${separator}${className}`)}::after`;
        });
      });
    }),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.-rotate-y-180': {
          transform: 'rotateY(-180deg)',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.rotate-y-0': {
          transform: 'rotateY(0deg)',
        },
      }

      addUtilities(newUtilities, ['group-hover', 'responsive'])
    }),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.flex-basis-100': {
          flexBasis: '100%'
        },
        '.flex-basis-70': {
          flexBasis: '70%'
        },
        '.flex-basis-60': {
          flexBasis: '60%'
        },
        '.flex-basis-40': {
          flexBasis: '40%'
        },
        '.flex-basis-30': {
          flexBasis: '30%'
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden'
        },
        '.grid-cols-fit': {
          gridTemplateColumns: 'repeat(auto-fit, 250px)'
        },
        '.grid-cols-minmax-fit': {
          gridTemplateColumns: 'repeat(auto-fit, minmax(50%, 1fr))'
        },
        '.grid-rows-minmax-fit': {
          gridTemplateRows: 'repeat(auto-fit, minmax(50%, 1fr))'
        }
      }

      addUtilities(newUtilities, ['responsive'])
    }),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.bg-size-flag': {
          backgroundSize: '72px 72px'
        }
      }

      addUtilities(newUtilities, ['important'])
    })
  ],
}
