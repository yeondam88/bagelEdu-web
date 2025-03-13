/** @type {import('tailwindcss').Config} */
const purple = {
  900: '#160041',
  800: '#18083A',
  700: '#2C1854',
  600: '#49479F',
  500: '#6260b5',
  400: '#7C7AC4',
  300: '#B5A1F5',
  200: '#D2C6FA',
  100: '#e0d7fc',
  50: '#f0ebfe',
  25: '#F4F0FC',
}
const yellow = {
  900: '#FAAF19',
  800: '#FDBE3F',
  700: '#EFB42D',
  600: '#F4C350',
  500: '#F8D075',
  400: '#fbde9b',
  300: '#FDEBC2',
  200: '#fef3da',
  100: '#fef7e7',
  50: '#fffaf6',
}

export default {
    darkMode: ['class'],
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Roboto Flex Variable',
  				'sans-serif'
  			],
  			written: [
  				'Gochi Hand',
  				'cursive'
  			]
  		},
  		colors: {
  			yellow: 'yellow',
  			purple: 'purple',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		lineHeight: {
  			tighter: '1.1',
  			loose: '1.875'
  		},
  		fontSize: {
  			'2xl': '1.75rem',
  			'3xl': '2rem',
  			'4xl': '2.25rem',
  			'5xl': '2.7rem',
  			'6xl': '3.25rem',
  			'7xl': '3.75rem',
  			'8xl': '5rem',
  			'9xl': '6rem'
  		},
  		height: {
  			'30vw': '30vw'
  		},
  		borderRadius: {
  			'4xl': '2.5rem',
  			'5xl': '5rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		width: {
  			'4.5': '1.125rem'
  		},
  		maxWidth: {
  			prose: '65ch'
  		},
  		scale: {
  			'80': '0.8',
  			'135': '1.35'
  		},
  		rotate: {
  			'4': '4deg',
  			'8': '8deg',
  			'-8': '-8deg'
  		},
  		animation: {
  			ping: 'ping 2.5s cubic-bezier(0, 0, 0.3, 1) infinite',
  			'horizontal-bounce': 'horizontal-bounce 1s infinite'
  		},
  		keyframes: {
  			ping: {
  				'75%, 100%': {
  					transform: 'scale(2)',
  					opacity: 0
  				}
  			},
  			'horizontal-bounce': {
  				'50%': {
  					transform: 'translateX(25%)',
  					animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
  				},
  				'0%, 100%': {
  					transform: 'translateX(0)',
  					animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
  				}
  			}
  		},
  		typography: '(theme) => ({\n        lg: {\n          css: {\n            h1: {\n              fontSize: theme('fontSize.5xl'),\n            },\n            h2: {\n              fontSize: theme('fontSize.4xl'),\n            },\n            h3: {\n              fontSize: theme('fontSize.3xl'),\n            },\n          },\n        },\n\n        xl: {\n          css: {\n            h1: {\n              fontSize: theme('fontSize.6xl'),\n            },\n            h2: {\n              fontSize: theme('fontSize.5xl'),\n            },\n            h3: {\n              fontSize: theme('fontSize.3xl'),\n            },\n          },\n        },\n\n        DEFAULT: {\n          css: {\n            '--tw-prose-body': theme('colors.purple[800]'),\n            '--tw-prose-headings': theme('colors.purple[900]'),\n            '--tw-prose-lead': theme('colors.purple[900]'),\n            '--tw-prose-links': theme('colors.purple[600]'),\n            '--tw-prose-links-hover': theme('colors.purple[400]'),\n            '--tw-prose-bold': theme('colors.purple[900]'),\n            '--tw-prose-counters': theme('colors.purple[800]'),\n            '--tw-prose-bullets': theme('colors.purple[800]'),\n            '--tw-prose-hr': theme('colors.purple[50]'),\n            '--tw-prose-quotes': theme('colors.purple[700]'),\n            '--tw-prose-quote-borders': theme('colors.purple[600]'),\n            '--tw-prose-captions': theme('colors.purple[800]'),\n            '--tw-prose-code': theme('colors.purple[900]'),\n            '--tw-prose-pre-code': theme('colors.purple[25]'),\n            '--tw-prose-pre-bg': theme('colors.purple[900]'),\n            '--tw-prose-th-borders': theme('colors.purple[100]'),\n            '--tw-prose-td-borders': theme('colors.purple[100]'),\n            '--tw-prose-invert-body': theme('colors.purple[25]'),\n            '--tw-prose-invert-headings': theme('colors.white'),\n            '--tw-prose-invert-lead': theme('colors.white'),\n            '--tw-prose-invert-links': theme('colors.white'),\n            '--tw-prose-links-hover': theme('colors.purple[300]'),\n            '--tw-prose-invert-bold': theme('colors.white'),\n            '--tw-prose-invert-counters': theme('colors.purple[25]'),\n            '--tw-prose-invert-bullets': theme('colors.purple[100]'),\n            '--tw-prose-invert-hr': theme('colors.purple[25]'),\n            '--tw-prose-invert-quotes': theme('colors.white'),\n            '--tw-prose-invert-quote-borders': theme('colors.purple[100]'),\n            '--tw-prose-invert-captions': theme('colors.purple[50]'),\n            '--tw-prose-invert-code': theme('colors.white'),\n            '--tw-prose-invert-pre-code': theme('colors.white'),\n            '--tw-prose-invert-pre-bg': theme('colors.purple[800]'),\n            '--tw-prose-invert-th-borders': theme('colors.purple[50]'),\n            '--tw-prose-invert-td-borders': theme('colors.purple[100]'),\n          },\n        },\n      })'
  	}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
      require("tailwindcss-animate")
],
}
