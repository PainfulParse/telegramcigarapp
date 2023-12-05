import cigars from "./data/cigarlist.js";

// Check and initialize local storage
function initializeCigars() {
    if (!localStorage.getItem('cigars')) {
        localStorage.setItem('cigars', JSON.stringify(cigars));
    }
}

// Display the list of cigars
function displayCigarList() {
    const storedCigars = JSON.parse(localStorage.getItem('cigars'));
    const listContainer = document.getElementById('listContainer');
    listContainer.innerHTML = '';

    storedCigars.forEach(cigar => {
        const listItem = document.createElement('div');
        listItem.className = 'cigar-item';
        listItem.innerHTML = `${cigar.name} <span class="rating-indicator" id="rating-${cigar.name.replace(/\s/g, '')}"></span>`;
        listItem.addEventListener('click', () => showCigarDetails(cigar.name));
        listContainer.appendChild(listItem);

        updateRatingIndicator(cigar.name, cigar.rating);
    });
}

// Show details of a specific cigar
function showCigarDetails(cigarName) {
    const storedCigars = JSON.parse(localStorage.getItem('cigars'));
    const selectedCigar = storedCigars.find(cigar => cigar.name === cigarName);

    if (selectedCigar) {
        document.getElementById('cigarName').textContent = selectedCigar.name;
        document.getElementById('cigarDetails').textContent = selectedCigar.description;
        document.getElementById('cigarCountry').textContent = "Country: " + selectedCigar.country;
        document.getElementById('cigarStrength').textContent = "Strength: " + selectedCigar.strength;
        document.getElementById('cigarWrapper').textContent = "Wrapper: " + selectedCigar.wrapper;
        document.getElementById('cigarColor').textContent = "Color: " + selectedCigar.color;
        document.getElementById('cigarImage').src = selectedCigar.image;

        updateStarDisplay(selectedCigar.rating || 0);
    }

    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('detailsContainer').style.display = 'block';
}

// Update the star rating display
function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('rated'); // Adds color to the star
        } else {
            star.classList.remove('rated'); // Removes color, shows empty
        }
    });
}

// Set and update rating in local storage
function setRating(cigarName, rating) {
    let storedCigars = JSON.parse(localStorage.getItem('cigars'));
    let cigarToUpdate = storedCigars.find(cigar => cigar.name === cigarName);
    if (cigarToUpdate) {
        cigarToUpdate.rating = rating;
        localStorage.setItem('cigars', JSON.stringify(storedCigars));
    }

    updateRatingIndicator(cigarName, rating);
    updateStarDisplay(rating);

    // Refresh the main list to show the updated rating indicator
    displayCigarList();
}


// Update the rating indicator on the main screen
function updateRatingIndicator(cigarName, rating) {
    const indicatorId = `rating-${cigarName.replace(/\s/g, '')}`;
    const indicator = document.getElementById(indicatorId);
    indicator.innerHTML = ''; // Clear previous rating

    if (rating > 0) {
        for (let i = 1; i <= rating; i++) {
            const star = document.createElement('span');
            star.innerHTML = '&#9733;'; // Unicode character for a star
            star.className = i <= rating ? 'rated' : '';
            indicator.appendChild(star);
        }
    }
}


// Start the show!
document.addEventListener('DOMContentLoaded', () => {
    initializeCigars();
    displayCigarList();

    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-value'));
            const cigarName = document.getElementById('cigarName').textContent;
            setRating(cigarName, rating);
        });
    });

    document.getElementById('resetRating').addEventListener('click', () => {
        const cigarName = document.getElementById('cigarName').textContent;
        setRating(cigarName, 0);
    });
    
    document.getElementById('backButton').addEventListener('click', function() {
        document.getElementById('detailsContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        updateRatingIndicator()
    });
});
