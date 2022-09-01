const TOTAL_STORY_PASSAGES = 14

document.initTwProgressBar = () => {
  const tags = $('tw-passage').attr('tags')
  const progress = tags?.match(/progress(\d+)/)?.[1]

  if (progress == null) {
    $('#progress-bar').hide()
    return
  }

  for (let doneI = 0; doneI < progress; doneI++) {
    $('#progress-bar').append('<div class="progress-node done" />')
  }
  for (let undoneI = progress; undoneI < TOTAL_STORY_PASSAGES; undoneI++) {
    $('#progress-bar').append('<div class="progress-node" />')
  }
}
