let color = '#3aa757';


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


/*change this into the js that handles the bird and its movements

bird image will be added to SOMETHING? with DOM ??? so that we have access to the image here (or some other way to make it a global variable)


BIRD MOVEMENTS:
   ideas:
    sometimes have the bird land on your cursor and follow it for a few seconds before flying off

    swarm mode: many bird flying randomly but only change direction x degrees from their current direction



*/