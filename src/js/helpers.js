export const isRTL = () => {
  const $html = document.querySelector('html')
  return ['ar', 'he', 'fa'].includes($html.getAttribute('lang'))
}

export const isMobile = (width = '768px') => {
  return window.matchMedia(`(max-width: ${width})`).matches
}

export const isDarkMode = () => {
  // const darkModeMatcher = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')

  // return darkModeMatcher && darkModeMatcher.matches
  // default light theme
  return false
}

export const formatDate = (date) => {
  if (date) {
    return new Date(date).toLocaleDateString(document.documentElement.lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return ''
}

export const getParameterByName = (name, url) => {
  if (!url) url = window.location.href

  name = name.replace(/[\[\]]/g, '\\$&')

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)

  if (!results) return null

  if (!results[2]) return ''

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const adjustImageGallery = () => {
  const images = document.querySelectorAll('.kg-gallery-image img')

  for (var i = 0, len = images.length; i < len; i++) {
    const container = images[i].closest('.kg-gallery-image')
    const width = images[i].attributes.width.value
    const height = images[i].attributes.height.value
    const ratio = width / height
    container.style.flex = `${ratio} 1 0%`
  }
}

export const managePostImages = ($) => {
  $('.js-post-content')
    .find('img')
    .each(function() {
      if (
        !$(this)
          .closest('figure')
          .hasClass('kg-bookmark-card') &&
        !$(this)
          .parent()
          .is('a')
      ) {
        $(this).addClass('js-zoomable')
      }

      const $figcaption = $(this)
        .parent()
        .find('figcaption')

      if ($figcaption) {
        $(this).attr('alt', $figcaption.text())
      } else {
        $(this).attr('alt', '')
      }
    })
}

export const makeImagesZoomable = ($, mediumZoom) => {
  const zoom = mediumZoom('.js-zoomable')

  zoom.on('open', (event) => {
    if (
      isMobile() &&
      $(event.target)
        .parent()
        .hasClass('kg-gallery-image')
    ) {
      setTimeout(() => {
        const $mediumZoomImage = $('.medium-zoom-image--opened')
        const transform = $mediumZoomImage[0].style.transform
        const scale = transform.substr(0, transform.indexOf(' '))
        const scaleValue = parseFloat(scale.substr(scale.indexOf('(') + 1).split(')')[0])
        const translate = transform.substr(transform.indexOf(' ') + 1)
        const translateY = parseFloat(translate.split(',')[1])
        const newTranslateY =
          translateY < 0
            ? scaleValue * translateY + translateY
            : scaleValue * translateY - translateY
        const newTransform = `scale(1) translate3d(0, ${newTranslateY}px, 0)`

        $mediumZoomImage.addClass('medium-zoom-image-mobile')
        $mediumZoomImage[0].style.transform = newTransform
      }, 10)
    }
  })

  zoom.on('close', () => {
    if (
      isMobile() &&
      $(event.target)
        .parent()
        .hasClass('kg-gallery-image')
    ) {
      const $mediumZoomImage = $('.medium-zoom-image')
      $mediumZoomImage.removeClass('medium-zoom-image-mobile')
    }
  })
}
