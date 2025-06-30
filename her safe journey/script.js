// ===== Hero Slideshow =====
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000);

  showSlide(currentSlide);
});





// ===== Itinerary Builder =====
let dayCount = 0;
const daysList = document.getElementById("days-list");
const dayDetails = document.getElementById("day-details");

function addDay() {
  dayCount++;
  const li = document.createElement("li");
  li.textContent = `Day ${dayCount}`;
  li.addEventListener("click", () => selectDay(`Day ${dayCount}`));
  daysList.appendChild(li);
  selectDay(`Day ${dayCount}`);
}

function selectDay(dayName) {
  dayDetails.innerHTML = `
    <h2>${dayName}</h2>
    <textarea rows="6" placeholder="Add notes, destinations, and checklists for ${dayName}..."></textarea>
  `;
}

function saveItinerary() {
  alert("Your itinerary has been saved successfully!");
}





// ===== Checklist =====
document.addEventListener('DOMContentLoaded', function() {
  // Mapping for categories
  const categories = {
    essentials: { listId: 'essentials-list', countId: 'essentials-count' },
    documents: { listId: 'documents-list', countId: 'documents-count' },
    communication: { listId: 'communication-list', countId: 'communication-count' }
  };

  // Add new checklist item
  const addItemBtn = document.getElementById('add-item-btn');
  if(addItemBtn){
    addItemBtn.addEventListener('click', function() {
      const category = document.getElementById('category-select').value;
      const input = document.getElementById('new-item-input');
      const itemText = input.value.trim();
      if (itemText) {
        const ul = document.getElementById(categories[category].listId);
        const li = document.createElement('li');
        li.innerHTML = `<label><input type="checkbox"> <span class="item-text">${itemText}</span></label>`;
        ul.appendChild(li);
        input.value = '';
        updateCountsAndProgress();
      }
    });
  }




  // Update counts, progress, and strikethroughs
  function updateCountsAndProgress() {
    let total = 0, checked = 0;
    Object.keys(categories).forEach(cat => {
      const ul = document.getElementById(categories[cat].listId);
      const checkboxes = ul.querySelectorAll('input[type="checkbox"]');
      const checkedBoxes = ul.querySelectorAll('input[type="checkbox"]:checked');
      document.getElementById(categories[cat].countId).textContent = `(${checkedBoxes.length}/${checkboxes.length})`;
      total += checkboxes.length;
      checked += checkedBoxes.length;

      // Strikethrough logic
      checkboxes.forEach(cb => {
        const span = cb.parentElement.querySelector('.item-text');
        if (span) {
          if (cb.checked) {
            span.classList.add('checked');
          } else {
            span.classList.remove('checked');
          }
        }
      });
    });
    // Update progress percent
    const percent = total ? Math.round((checked / total) * 100) : 0;
    document.querySelectorAll('#progress-percent').forEach(el => el.textContent = percent + '%');
    // Optional: update visual bar
    const bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = percent + '%';
  }

  // Listen for checkbox changes (including future items)
  document.querySelectorAll('.checklist').forEach(ul => {
    ul.addEventListener('change', updateCountsAndProgress);
  });

  // Initial update and strikethrough
  updateCountsAndProgress();
});




// ===== Reviews ===
document.addEventListener('DOMContentLoaded', function() {
    // Sample reviews to display on page load
    let reviews = [
        {
            location: "Tokyo, Japan",
            country: "Japan",
            name: "Sarah M.",
            rating: "safe",
            text: "Extremely safe for solo female travelers. Clean, efficient public transport and helpful locals. Late night walks felt completely safe.",
            date: "1/15/2024",
            likes: 24
        },
        {
            location: "Bangkok, Thailand",
            country: "Thailand",
            name: "Emma L.",
            rating: "caution",
            text: "Generally safe but be cautious of scams in tourist areas. Stick to well-lit areas at night. Amazing food and culture!",
            date: "1/10/2024",
            likes: 18
        },
        {
            location: "Reykjavik, Iceland",
            country: "Iceland",
            name: "Lisa K.",
            rating: "safe",
            text: "One of the safest countries in the world. Traveled solo for a week without any concerns. Stunning nature and friendly people.",
            date: "1/5/2024",
            likes: 31
        }
    ];

    // Defensive: Only attach if elements exist
    const shareBtn = document.getElementById('share-experience-btn');
    const reviewFormSection = document.getElementById('review-form-section');
    const cancelBtn = document.getElementById('cancel-review');
    const filterCountry = document.getElementById('filter-country');
    const filterRating = document.getElementById('filter-rating');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    // Show/hide review form
    if (shareBtn && reviewFormSection) {
        shareBtn.onclick = function() {
            reviewFormSection.style.display = 'block';
        };
    }
    if (cancelBtn && reviewFormSection) {
        cancelBtn.onclick = function() {
            reviewFormSection.style.display = 'none';
        };
    }

    // Render reviews
    function renderReviews(filterCountryVal = '', filterRatingVal = '') {
        if (!reviewsList) return;
        reviewsList.innerHTML = '';
        reviews
            .filter(r => (!filterCountryVal || r.country.toLowerCase().includes(filterCountryVal.toLowerCase())))
            .filter(r => (!filterRatingVal || r.rating === filterRatingVal))
            .forEach((r, idx) => {
                const icon = r.rating === 'safe'
                    ? '<span class="review-badge safe">Safe</span>'
                    : '<span class="review-badge caution">Caution</span>';
                const stars = r.rating === 'safe'
                    ? '<span class="stars">★★★★★</span>'
                    : '<span class="stars">★★★★☆</span>';
                reviewsList.innerHTML += `
                    <div class="review-card">
                        <div class="review-header">
                            <span class="review-location">${r.location}</span> ${icon}
                        </div>
                        <div class="review-stars">${stars}</div>
                        <div class="review-text">${r.text}</div>
                        <div class="review-footer">
                            <span class="review-author">By ${r.name}</span>
                            <span class="review-date">${r.date}</span>
                            <button class="like-btn" onclick="toggleLike(this)">
                                <i class="fa fa-heart"></i> <span class="like-count">${r.likes}</span>
                            </button>
                        </div>
                    </div>
                `;
            });
    }

    // Filter logic
    if (filterCountry) {
        filterCountry.addEventListener('input', function() {
            renderReviews(this.value, filterRating ? filterRating.value : '');
        });
    }
    if (filterRating) {
        filterRating.addEventListener('change', function() {
            renderReviews(filterCountry ? filterCountry.value : '', this.value);
        });
    }

    // Handle form submission
    if (reviewForm) {
        reviewForm.onsubmit = function(e) {
            e.preventDefault();
            const now = new Date();
            reviews.unshift({
                location: document.getElementById('review-location').value + ', ' + document.getElementById('review-country').value,
                country: document.getElementById('review-country').value,
                name: document.getElementById('review-name').value,
                rating: document.getElementById('review-rating').value,
                text: document.getElementById('review-text').value,
                date: now.toLocaleDateString(),
                likes: 0
            });
            if (reviewFormSection) reviewFormSection.style.display = 'none';
            this.reset();
            renderReviews();
        };
    }

    // Initial render
    renderReviews();
});

// Like button logic (global, works for dynamically created buttons)
function toggleLike(btn) {
  btn.classList.toggle('liked');
  let countSpan = btn.querySelector('.like-count');
  let count = parseInt(countSpan.textContent, 10);
  if (btn.classList.contains('liked')) {
    countSpan.textContent = count + 1;
  } else {
    countSpan.textContent = count - 1;
  }
}








// ===== SOS Feature =====

// Call Emergency Services
function callEmergency() {
  window.location.href = 'tel:911';
}

// Send SMS with Location
function sendSMS() {
  const location = localStorage.getItem('currentLocation') || 'Unable to fetch location';
  window.location.href = `sms:?body=My current location: ${location}`;
}

// Share Location on WhatsApp
function shareWhatsApp() {
  const location = localStorage.getItem('currentLocation') || 'Unable to fetch location';
  const message = `I'm in danger! Here's my location: ${location}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

// Sound Alarm
function soundAlarm() {
  const alarm = new Audio('alarm.mp3'); 
  alarm.play();
  alert("Alarm sounding! Make sure volume is up.");
}

// Call Contact Number
function callNumber(number) {
  window.location.href = `tel:${number}`;
}

// Add Contact
function addContact() {
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();

  if (!name || !phone) {
    alert("Please enter both contact name and phone number.");
    return;
  }

  const contactList = document.querySelector('.emergency-contacts');
  const contactDiv = document.createElement('div');
  contactDiv.className = 'contact-row';
  contactDiv.innerHTML = `
    <label>${name}</label>
    <input type="text" value="${phone}" readonly />
    <button class="call-btn" onclick="callNumber('${phone}')">📞</button>
  `;
  contactList.appendChild(contactDiv);

  document.getElementById('contactName').value = '';
  document.getElementById('contactPhone').value = '';
}

// Get Current Location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const location = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
      localStorage.setItem('currentLocation', location);
      alert(`Location captured:\n${location}`);
    }, () => {
      alert("Failed to get your location.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// SOS Button Logic
let sosTimer = null;

function startSOS() {
  sosTimer = setTimeout(() => {
    activateSOS();
  }, 3000); // 3 seconds hold
  const label = document.getElementById('sosLabel');
  if (label) label.innerText = "Hold...";
}

function cancelSOS() {
  clearTimeout(sosTimer);
  const label = document.getElementById('sosLabel');
  if (label) label.innerText = "SOS";
}

function activateSOS() {
  const circle = document.getElementById('sosCircle');
  const label = document.getElementById('sosLabel');
  const alertBox = document.getElementById('sosAlert');

  if (circle) circle.classList.add('activated');
  if (label) label.innerText = "ACTIVATED";
  if (alertBox) alertBox.style.display = 'block';

  // Play alarm sound
  const alarm = new Audio('alarm.mp3');
  alarm.play().catch(e => console.log("Autoplay blocked:", e));

  




  // Hide alert after 5 seconds
  setTimeout(() => {
    if (alertBox) alertBox.style.display = 'none';
    if (circle) circle.classList.remove('activated');
    if (label) label.innerText = "SOS";
  }, 5000);
}






// ===== Currency Converter =====
document.addEventListener('DOMContentLoaded', function() {
  // --- Currency Data (Sample) ---
  const currencies = [
    { code: "USD", name: "US Dollar", rate: 1 },
    { code: "EUR", name: "Euro", rate: 0.85 },
    { code: "GBP", name: "British Pound", rate: 0.73 },
    { code: "JPY", name: "Japanese Yen", rate: 110 },
    { code: "INR", name: "Indian Rupee", rate: 74.5 },
    { code: "AUD", name: "Australian Dollar", rate: 1.35 },
    { code: "CAD", name: "Canadian Dollar", rate: 1.25 },
    { code: "THB", name: "Thai Baht", rate: 33 },
  ];

  // --- Populate Select Options ---
  function populateCurrencySelects() {
    const from = document.getElementById("from-currency");
    const to = document.getElementById("to-currency");
    if (!from || !to) return;
    from.innerHTML = '';
    to.innerHTML = '';
    currencies.forEach(cur => {
      const opt1 = document.createElement("option");
      opt1.value = cur.code;
      opt1.textContent = `${cur.code} - ${cur.name}`;
      from.appendChild(opt1);
      const opt2 = document.createElement("option");
      opt2.value = cur.code;
      opt2.textContent = `${cur.code} - ${cur.name}`;
      to.appendChild(opt2);
    });
    from.value = "USD";
    to.value = "EUR";
  }
  populateCurrencySelects();

  // --- Conversion Logic ---
  const convertBtn = document.getElementById("convert-btn");
  if (convertBtn) {
    convertBtn.addEventListener("click", () => {
      const amount = parseFloat(document.getElementById("amount").value);
      const from = document.getElementById("from-currency").value;
      const to = document.getElementById("to-currency").value;
      const fromRate = currencies.find(c => c.code === from).rate;
      const toRate = currencies.find(c => c.code === to).rate;
      const result = ((amount / fromRate) * toRate).toFixed(2);
      document.getElementById("conversion-result").textContent = `${amount} ${from} = ${result} ${to}`;
    });
  }

  // --- Popular Destinations ---
  const popular = [
    { country: "TH", name: "Thailand", code: "THB", value: 3300 },
    { country: "JP", name: "Japan", code: "JPY", value: 11000 },
    { country: "IN", name: "India", code: "INR", value: 7450 },
    { country: "GB", name: "United Kingdom", code: "GBP", value: 73 },
    { country: "AU", name: "Australia", code: "AUD", value: 135 },
    { country: "CA", name: "Canada", code: "CAD", value: 125 },
  ];
  const popDiv = document.getElementById("popular-destinations");
  if (popDiv) {
    popDiv.innerHTML = '';
    popular.forEach(dest => {
      const box = document.createElement("div");
      box.className = "popular-dest";
      box.innerHTML = `<span>${dest.country}</span> ${dest.name}<br><strong>${dest.value} ${dest.code}</strong>`;
      popDiv.appendChild(box);
    });
  }

  // --- Exchange Rate Table ---
  const tbody = document.querySelector("#exchange-table tbody");
  if (tbody) {
    tbody.innerHTML = '';
    currencies.forEach(cur => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${cur.code}</td>
        <td>${cur.name}</td>
        <td>${cur.rate.toFixed(4)}</td>
        <td>1 USD = ${(1 / cur.rate).toFixed(4)} ${cur.code}</td>
      `;
      tbody.appendChild(tr);
    });
  }
});






let map; // map accessible globally

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('map')) {
    if (!map) {
      map = L.map('map').setView([25.5941, 85.1376], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      let markerGroup = L.layerGroup().addTo(map);


// Add this just once, doesn't need to be visible
const googleMapDiv = document.createElement('div');
googleMapDiv.style.display = 'none';
document.body.appendChild(googleMapDiv);
const gmap = new google.maps.Map(googleMapDiv, {
  center: { lat: 25.5941, lng: 85.1376 },
  zoom: 14,
});





// Utility to fetch places from Google Places API
function fetchPlaces(type, iconHtml) {
  const apiKey = 'AIzaSyA-aGw0nV0n2x6LuKkpzYjDcEFor7DWgPw'; // Replace with your key
  const lat = 25.5941; // Patna latitude
  const lng = 85.1376; // Patna longitude
  const radius = 5000; // meters

  // Clear previous markers
  markerGroup.clearLayers();

  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        data.results.forEach(place => {
          const marker = L.marker([place.geometry.location.lat, place.geometry.location.lng], {
            icon: L.divIcon({
              className: 'custom-icon',
              html: iconHtml,
              iconSize: [30, 30]
            })
          }).addTo(markerGroup);
          marker.bindPopup(`<b>${place.name}</b><br>${place.vicinity}`);
        });
      } else {
        alert('No locations found for this category.');
      }
    })
    .catch(err => {
      alert('Could not fetch places. Please check your API key and internet connection.');
      console.error(err);
    });
}









      // Button event listeners
      document.getElementById('policeBtn').onclick = function() {
  setActive(this);
  fetchPlaces('police', '<i class="fa-solid fa-shield-halved" style="color:#1976D2;font-size:1.5rem;"></i>');
};
document.getElementById('cafeBtn').onclick = function() {
  setActive(this);
  fetchPlaces('cafe', '<i class="fa-solid fa-mug-hot" style="color:#ff9800;font-size:1.5rem;"></i>');
};
document.getElementById('helpBtn').onclick = function() {
  setActive(this);
  fetchPlaces('hospital', '<i class="fa-solid fa-hands-holding-child" style="color:#e53935;font-size:1.5rem;"></i>');
};


fetchPlaces('police', '<i class="fa-solid fa-shield-halved" style="color:#1976D2;font-size:1.5rem;"></i>');

function setActive(btn) {
        document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }

      // Default view: show police stations
      fetchPlaces('police', '<i class="fa-solid fa-shield-halved" style="color:#1976D2;font-size:1.5rem;"></i>');








      // Find Me button
      document.getElementById('findMeBtn').onclick = function() {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser.');
          return;
        }
        navigator.geolocation.getCurrentPosition(function(pos) {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          map.setView([lat, lng], 15);
          L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'custom-icon',
              html: '<i class="fa-solid fa-location-dot" style="color:#1976D2;font-size:1.5rem;"></i>',
              iconSize: [30, 30]
            })
          }).addTo(map).bindPopup('Your Location').openPopup();
        }, function() {
          alert('Unable to retrieve your location.');
        });
      };
    }
    //  fix map size after showing the section
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }
});






      
//spa navigation


function showSection(sectionId) {
  document.querySelectorAll('section.page-section').forEach(sec =>
    sec.classList.remove('active')
  );
  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
  document.querySelectorAll('nav a[data-section]').forEach(link => link.classList.remove('active'));
  const navLink = document.querySelector(`nav a[data-section="${sectionId}"]`);
  if (navLink) navLink.classList.add('active');

  // Leaflet map display when showing SafeZones
  if (sectionId === 'safezone' && typeof map !== 'undefined') {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }
}

document.querySelectorAll('nav a[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    showSection(sectionId);
  });
});
