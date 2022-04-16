window.onload = function() {

    // First, I'll declare any global variables I'd like to have access to
    const episodesUrl = 'http://localhost:1337/episodes'
    const mainHeadline = document.getElementById('mainHeadline')
    const playButton = document.getElementById('play')
    const pauseButton = document.getElementById('pause')
    const seekForwardButton = document.getElementById('seekforward')
    const seekBackButton = document.getElementById('seekback')
    const sliderContainer = document.getElementById('rangeSlider')
    const innerBar = document.getElementById('innerBar')
    const contentHeadline = document.getElementById('contentHeadline')
    const contentLink = document.getElementById('contentLink')
    const contentImage = document.getElementById('contentImage')
    const nextAudio = document.getElementById('nextAudio')
    const prevAudio = document.getElementById('prevAudio')

    class Podcast {
        constructor(data, fullData) {
            this.audio = new Audio()
            this.createVars(data, fullData)
            this.setUp()
        }

        createVars(data, fullData) {
            this.data = data
            this.fullData = fullData
            this.audio.src = 'http://localhost:1337' + this.data.audio
            this.index = this.fullData.indexOf(this.data)
            this.prev = this.fullData[this.index - 1] ? this.fullData[this.index - 1] : null
            this.next = this.fullData[this.index + 1] ? this.fullData[this.index + 1] : null
        }
        
        setUp() {
            this.clearContent()

            mainHeadline.innerHTML = this.data.name
            
            //Event Listeners
            let listener = this.audioCheck.bind(this, this.audio, this.data)
            this.audio.addEventListener('timeupdate', listener)
            playButton.addEventListener('click', this.playAudio.bind(this, this.audio))
            pauseButton.addEventListener('click', this.pauseAudio.bind(this, this.audio))
            seekForwardButton.addEventListener('click', this.sfAudio.bind(this, this.audio))
            seekBackButton.addEventListener('click', this.sbAudio.bind(this, this.audio))
            sliderContainer.addEventListener('click', this.rangeSlider.bind(this, this.audio))

            // TODO - Add Previous!
            if (this.prev) {
                prevAudio.classList.remove('hidden')
                prevAudio.addEventListener('click', () => {
                    this.audio.removeEventListener('timeupdate', listener)
                    this.createVars(this.prev, this.fullData)

                    //TODO - range slider width should reset to 0
                    this.setUp()
                })
            } else {
                prevAudio.classList.add('hidden')
            }

            if (this.next) {
                nextAudio.classList.remove('hidden')
                nextAudio.addEventListener('click', () => {
                    this.audio.removeEventListener('timeupdate', listener)
                    this.createVars(this.next, this.fullData)

                    //TODO - range slider width should reset to 0
                    this.setUp()
                })
            } else {
                nextAudio.classList.add('hidden')
            }
        }

        clearContent() {
            contentHeadline.innerHTML = ''
            contentLink.innerHTML = ''
            contentImage.innerHTML = ''
        }

       audioCheck(audio, data) {
            //have the slider continuously update
            this.rangeSlider(audio)
    
            // Handle the markers
            let display = []
    
            data.markers.forEach((marker) => {
                let markerEnd = marker.start + marker.duration
    
                if (audio.currentTime > marker.start && audio.currentTime < markerEnd) {
                    display.push(marker)
                } else {
                    if (display.includes(marker)) {
                        let index = display.indexOf(marker)
                        display.splice(index, 1)
                    }
                }
            })

            if (display.length) {
                this.displayMarker(display[0])
            } else {
                this.clearContent()
            }
    
            // Set pause button back to play at the end 
            if (audio.currentTime === audio.duration) {
                playButton.classList.remove('hidden')
                pauseButton.classList.add('hidden')
            }
        }

        playAudio(audio) {
            audio.play()
            playButton.classList.add('hidden')
            pauseButton.classList.remove('hidden')
        }

        pauseAudio(audio) {
            audio.pause()
            pauseButton.classList.add('hidden')
            playButton.classList.remove('hidden')
        }

        sfAudio(audio) {
            audio.currentTime = audio.currentTime + 5
            this.playAudio(audio)
        }

        sbAudio(audio) {
            let newTime = audio.currentTime - 5
    
            if (newTime < 0) {
                newTime = 0
            }
            audio.currentTime = newTime
            this.playAudio(audio)
    
        }

        rangeSlider(audio, event) {
            //to make the slider, I need to track what percentage of the width the user clicked.
            // From there, I can use that percentage to find where it would be in the audio, and play.
            // TODO - this only  works if you click to the right rn, need to let it click to the left!!
            if(event) {
                let percentage = event.offsetX / 350
                let newTime = audio.duration * percentage
    
                // show the width at the current spot 
                innerBar.style.setProperty('right', 100 - (percentage * 100) + '%')
    
                audio.currentTime = newTime
                this.playAudio(audio)
            } else {
                // This is for the continuous update of the slider, not from a click event
                let percentage = audio.currentTime / audio.duration
                innerBar.style.setProperty('right', 100 - (percentage * 100) + '%')
            }
        }

        displayMarker(marker) {
            if (marker.content) {
                if (marker.type === 'text') {
                    if (!contentHeadline.innerHTML) {
                        contentHeadline.innerHTML = marker.content
                    }
                } else {
                    contentHeadline.innerHTML = ''
                }
    
                if (marker.type === 'ad') {
                    if (!contentImage.innerHTML) {
                        contentLink.innerHTML = '<a href="' + marker.link + '" target="_blank">' + marker.content + '</a>'
                    }
                } else {
                    contentLink.innerHTML = ''
                }
    
                if (marker.type === 'image') {
                    if (!contentImage.innerHTML) {
                        contentImage.innerHTML = '<img src="http://localhost:1337/' + marker.content + '" id="contentImg" alt="Advertisement Image"></img>'
                    } 
                } else {
                    contentImage.innerHTML = null
                }
            }
        }
    }

    // Here is a generic fetch data function that I can use to grab what I need from the server
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

    // Now, I'll get the info I need from the episodes file and use that to pass appropriate data to my podcast player function
    fetchData(episodesUrl, podcastPlayer)

    function podcastPlayer(data) {
        // Call the first/initial instance
        new Podcast(data[0], data)
    } 
}

