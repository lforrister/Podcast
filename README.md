# Set Up Instructions

My goal was to make set up as simple a possible!
1) Please follow the instructions from the provided `recruitment-assignment-frontend-master` repository to get the server running on `localhost:1337`
2) Then, for this repository, you can just open `index.html` directly in your browser. 

# Introduction

Thank you very much for your consideration!

I decided to code this project in vanilla Javascript. While I'm eager to pick up React, currently the framework I have experience with is Vue, so after reading the requirements I felt vanilla JS would be the best representation of my current skillset.

The general functionality of this podcast player is as follows:
1. When a user loads the page, the first audio sample from the provided `/episodes` api call will display in the browser. 
2. A user can click play or pause, or the right and left double arrow icons to skip forward or backwards 5 seconds. 
3. The gray slider will automatically start to fill as the audio plays, or a user can manually click anywhere on the slider to skip to that part of the audio.
4. The 'markers' will display in the light blue box during the times that were specified in the data.
5. A user can click the single arrow buttons to the right or left of the title to go to the next or previous audio.

# Further Improvements

Here are some areas that I would continue to improve:

1. Organization/Compilers/PreProcessors: For the sake of this assignment, I wanted to keep the codebase and setup as simple as possible. For a cleaner or larger codebase, I would use a compiler such a webpack to be able to use various helpers and split the code up into smaller chunks. I would take the `Podcast` JS class within `index.js` and move it into its own file so that I could import it in various places. For a larger project, I also would have used a CSS preprocessor such a Sass or Less to take advantage of their mixins and clean/convenient syntax.

2. I would take time to implement the optional additions to the markers functionality. My initial thoughts on how to approach this would be to disable the skip forward and backward buttons (both visually and functionally) while the current time is within a marker's play time. 

For the second part of the additions, I did wonder about the best approach from a UX standpoint. For example, if the user clicked the skip bar and passed over an ad, should we display the skipped ad with the audio section the ad is visible for, then skip ahead to the part they clicked after the ad(s) finish? If so, that may be a bit jarring to the user to be jumping through different chunks of the audio. Another option may be to just visually show the skipped ad without playing any associated audio, though the silence could be strange. I would ideally want to discuss different scenarios before implementing.

3. Use more of the built in audio element options. I haven't used audio elements frequently in previous roles, so this was a great opportunity to learn more about how they worked. Looking back, I learned that several of the items I hand coded could have just used the built in audio controls (i.e. the play/pause button and slider). They may have been a bit harder to customize/style, but I think it would have saved me some time.

4. I would think through different approaches on how to choose which audio to display. For now, I just have the first audio in the supplied data showing first, and then provide the next and back arrows to move between the different audios. Other options could be adding a search input so a user can look for a specific podcast, displaying more than one at at time, etc. 

5. Further UI/style adjustments. One area I notice specifically is the slider - when it automatically updates it is a little jumpy looking. I could maybe add a CSS transition to the width to make that a little smoother. Or, as #3 mentions, I could use the built in slider.


