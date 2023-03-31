tailwind.config = {
  theme: {
    container: {
      // you can configure the container to be centered
      center: true,

      // or have default horizontal padding
      padding: '1rem',

      // default breakpoints but with 40px removed
      screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
          '2xl': '1440px',
      },
    },
    fontFamily: {
      'albertus': ['"Albertus Nova"', 'sans-serif'],
      'essays': ['"Essays1743"', 'sans-serif'],
      'adumu': ['"Adumu"', 'sans-serif']
    },
    extend: {
      colors: {
        darkgreen: '#073300',
        green: '#185602',
        yellow: '#fbc527'
      },
    }
  }
}