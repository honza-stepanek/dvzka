document.initTwProgressBar = () => {
  const tags = $('tw-passage').attr('tags')
  const matches = tags?.match(/progress-(\d+)-(\d+)/)
  const progress = parseInt(matches?.[1])
  const total = parseInt(matches?.[2])
  console.log(progress, total)

  let bar = document.getElementById('progress-bar-container')
  if (!bar) {
    $('body').append('<div id="progress-bar-container"><div id="progress-bar"/></div>')
  }
  
  if (progress == null || !total) {
    $('#progress-bar-container').hide()
    return
  }
  
  bar = document.getElementById('progress-bar')
  if (bar.childElementCount !== total) {
    $('#progress-bar').empty()
    for (let i = 1; i <= total; i++) {
      $('#progress-bar').append(`<div id="progress-node-${i}" class="progress-node" />`)
    }
  }
  $('#progress-bar-container').show()

  for (let i = 1; i <= total; i++) {
    $(`#progress-node-${i}`).toggleClass('done', i <= progress)
  }
}