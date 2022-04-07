console.log('yo what up')

//let's make sure I can connect to this endpoint
const episodesUrl = 'http://localhost:1337/episodes'

function fetchData(url, callback) {
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then((data) => {
          console.log('data', data)
          callback(data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

fetchData(episodesUrl, podcastPlayer)

function podcastPlayer(data) {
    let audio = new Audio('http://localhost:1337' + data[0].audio)

    console.log('testing', data)
    const play = document.getElementById('play')
    play.addEventListener('click', function() {
        console.log("Play!")
        audio.play()
    })

    const pause = document.getElementById('pause')
    pause.addEventListener('click', function() {
        console.log("Pause!")
        audio.pause()
    })
}