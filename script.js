document.addEventListener('DOMContentLoaded', function () {
    // Get user's current timezone based on geolocation
    getCurrentTimezone();

    // Add event listener to the button for finding timezone by address
    document.getElementById('find-timezone-btn').addEventListener('click', findTimezone);
});

function getCurrentTimezone() {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
        // Get current position
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function showPosition(position) {
    // Display user's current latitude and longitude
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // Use latitude and longitude to fetch timezone from Geoapify Timezone API
    fetchTimezone(latitude, longitude, displayCurrentTimezone);
}

function showError(error) {
    // Handle errors from geolocation
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function findTimezone() {
    // Retrieve timezone based on entered address
    var address = document.getElementById('address-input').value;

    // Validate the entered address
    if (address.trim() === '') {
        alert('Please enter a valid address.');
        return;
    }

    // Use Geoapify Geocoding API to convert address to coordinates
    var geocodingApiUrl = 'https://api.geoapify.com/v1/geocode/search?text=' + encodeURIComponent(address) + '&apiKey=YOUR_GEOAPIFY_API_KEY';

    // Fetch coordinates from the Geocoding API
    fetch(geocodingApiUrl)
        .then(response => response.json())
        .then(data => {
            // Check if valid coordinates are returned
            if (data.features && data.features.length > 0) {
                var coordinates = data.features[0].geometry.coordinates;
                var latitude = coordinates[1];
                var longitude = coordinates[0];
                
                // Use coordinates to fetch timezone from Geoapify Timezone API
                fetchTimezone(latitude, longitude, displayAddressTimezone);
            } else {
                alert('Invalid address. Please enter a valid address.');
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

function fetchTimezone(latitude, longitude, callback) {
    // Fetch timezone from Geoapify Timezone API
    var timezoneApiUrl = 'https://api.geoapify.com/v1/timezone/byCoords?lat=' + latitude + '&lon=' + longitude + '&apiKey=YOUR_GEOAPIFY_API_KEY';

    // Fetch timezone data
    fetch(timezoneApiUrl)
        .then(response => response.json())
        .then(data => {
            // Pass timezone data to the callback function
            callback(data);
        })
        .catch(error => {
            console.error('Error fetching timezone:', error);
        });
}

function displayCurrentTimezone(timezoneData) {
    // Update the DOM to display current timezone data
    var currentTimezoneDiv = document.getElementById('current-timezone');
    currentTimezoneDiv.innerHTML = `
        <h3>Name of Time Zone: ${timezoneData.timezone.name}</h3>
        <h3>Latitude: ${timezoneData.coordinates.lat}</h3>
        <h3>Longitude: ${timezoneData.coordinates.lon}</h3>
        <h3>Offset STD: ${timezoneData.timezone.offset_std}</h3>
        <h3>Offset STD Second: ${timezoneData.timezone.offset_std_sec}</h3>
        <h3>Offset DST: ${timezoneData.timezone.offset_dst}</h3>
        <h3>Offset DST Second: ${timezoneData.timezone.offset_dst_sec}</h3>
        <h3>Country: ${timezoneData.country}</h3>
        <h3>Pncode: ${timezoneData.pncode}</h3>
        <h3>City: ${timezoneData.city}</h3>
    `;
}

function displayAddressTimezone(timezoneData) {
    // Update the DOM to display timezone data for entered address
    var addressTimezoneDiv = document.getElementById('address-timezone');
    addressTimezoneDiv.innerHTML = `
        <h3>Name of Time Zone: ${timezoneData.timezone.name}</h3>
        <h3>Latitude: ${timezoneData.coordinates.lat}</h3>
        <h3>Longitude: ${timezoneData.coordinates.lon}</h3>
        <h3>Offset STD: ${timezoneData.timezone.offset_std}</h3>
        <h3>Offset STD Second: ${timezoneData.timezone.offset_std_sec}</h3>
        <h3>Offset DST: ${timezoneData.timezone.offset_dst}</h3>
        <h3>Offset DST Second: ${timezoneData.timezone.offset_dst_sec}</h3>
        <h3>Country: ${timezoneData.country}</h3>
        <h3>Pncode: ${timezoneData.pncode}</h3>
        <h3>City: ${timezoneData.city}</h3>
    `;
}
