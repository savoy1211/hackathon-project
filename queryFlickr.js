const EBIRD_TOKEN = 'lu267npcirvi'

// Access list of species, array of strings
const speciesList = [];

var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", EBIRD_TOKEN);

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

function speciesListMaker(array) {
    // Iterate through eBirdRequest,
    JSON.parse(array).forEach(obj => {
        // push in comName to speciesList
        speciesList.push(obj['comName']);
    })
    // console.log('speciesList', speciesList)
}

// List of strings (URLs), each element is a photo of a different bird
const listOfPhotoObjs = [];
const actualNumberOfSpecies = 5;
let currentSpecies = ''
async function photoLister() {
    // Iterate through list of species
    // for (let i = 0; i < actualNumberOfSpecies; i++) {
    for (const species of speciesList.slice(0, actualNumberOfSpecies)) {
        currentSpecies = encodeURIComponent(species);
        const firstFlickrURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&text=${currentSpecies}&api_key=d9c64386725633bb757d9cf4c7e2fcb9&per_page=10&format=json&nojsoncallback=1`
        // Make get request to flickr, receive list of objects of photo info, ***only use one photo
        await fetch(firstFlickrURL, { method: 'GET', redirect: 'follow' })
            // .then(response =>letlet response.text())
            .then(response => response.json())
            // Make get request to flickr using photo info, https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
            // Save photo URL in variable called photo
            // Push photo to listOfPhotos
            .then(result => {
                const firstPhoto = result['photos']['photo'][0];
                const serverID = firstPhoto['server']
                const ID = firstPhoto['id']
                const secret = firstPhoto['secret']
                const sizeSuffix = 'm';
                const secondFlickrURL = `https://live.staticflickr.com/${serverID}/${ID}_${secret}_${sizeSuffix}.jpg`
                listOfPhotoObjs.push({ 'imgURL': secondFlickrURL, 'speciesName': species });


                // const image = document.createElement('img');
                // image.setAttribute('src', secondFlickrURL)
                // const name = document.createElement('div');
                // name.onies}</p>`
                // image.setAttribute('id', species)
                // document.querySelector('body').appendChild(image)
                // document.querySelector('body').appendChild(name)

                console.log('DONE WITH FETCH')
            })
        console.log('iteration species', species)
    }
}

function randomizePhotos() {
    const numBirdsPerSpecies = 10;
    chrome.storage.sync.get('listOfPhotos', obj => {
        const list = obj.listOfPhotos;
        list.forEach(item => {
            for (let i = 0; i < numBirdsPerSpecies; i += 1) {
                const image = document.createElement('img');
                image.setAttribute('src', item['imgURL'].replace('m.jpg', 's.jpg'))
                image.setAttribute('id', item['speciesName'])
                image.setAttribute('width', 30)
                image.style.position = 'absolute'
                image.style.left = Math.floor(Math.random() * 90 + 5) + '%';
                image.style.top = Math.floor(Math.random() * 90 + 5) + '%';
                image.classList.add('birdImage');
                image.addEventListener('mouseover', function (e) {
                    e.target.style.top = Math.floor(Math.random() * 90 + 5) + '%';
                    e.target.style.left = Math.floor(Math.random() * 90 + 5) + '%';
                    const audio = new Audio(chrome.runtime.getURL('Chirp.mp3'));
                    console.log('audio', audio);
                    audio.play();
                })
                document.body.prepend(image)
            }

        })
    })
    // const image = document.getElementsByClassName('.birdImage')
    // console.log('image', image)
    // image.addEventListener('mouseover', function (e) { moveElmRand(e.target) })
}


chrome.storage.sync.get('currentLocation', o => {
    fetch(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${o.currentLocation.lat}&lng=${o.currentLocation.long}&sort=species`, requestOptions)
        .then(response => response.text())
        .then(result => { speciesListMaker(result) })
        .then(() => {
            for (var i = speciesList.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = speciesList[i];
                speciesList[i] = speciesList[j];
                speciesList[j] = temp;
            }
        })
        .then(async () => { await photoLister() })
        .then(() => {
            // const lastImages = document.getElementsByClassName('birdImage');
            // lastImages.remove();
            document.getElementById("loading").remove();
            listOfPhotoObjs.forEach(photoObj => {
                console.log('photoURL', photoObj);
                const image = document.createElement('img');
                image.setAttribute('src', photoObj['imgURL'])
                const name = document.createElement('div');
                name.innerHTML = `<p>${photoObj['speciesName']}</p>`
                image.setAttribute('id', photoObj['speciesName'])
                document.querySelector('body').appendChild(image)
                document.querySelector('body').appendChild(name)
            })
            chrome.storage.sync.set({ 'listOfPhotos': listOfPhotoObjs })
            chrome.storage.sync.get('listOfPhotos', (obj) => {
                console.log('listOfPhotos from storage', obj)
                // obj.listOfPhotos[0]['imgURL']
                // obj.listOfPhotos[1]['speciesName']
            })
        })
        .then(async () => {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: randomizePhotos,
            });
        })
        .catch(error => console.log('error', error));
})




