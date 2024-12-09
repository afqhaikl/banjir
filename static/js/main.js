// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const formEntries = Object.fromEntries(formData.entries());
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', formEntries);
    
    // Clear form
    this.reset();
    alert('Thank you for your message! We will get back to you soon.');
});

// Add scroll-based navbar styling
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = '#fff';
    }
});

// Fetch data from our API endpoint
async function fetchFloodData() {
    try {
        const response = await fetch('/api/flood-data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching flood data:', error);
        return null;
    }
}

// Update statistics cards
function updateStats(data) {
    if (!data) return;

    // Example statistics (modify based on actual data structure)
    document.querySelector('#total-incidents .stat-value').textContent = data.length || '0';
    document.querySelector('#active-incidents .stat-value').textContent = 
        data.filter(item => item.status === 'active').length || '0';
    document.querySelector('#affected-areas .stat-value').textContent = 
        [...new Set(data.map(item => item.location))].length || '0';
}

// Create trend chart
function createTrendChart(data) {
    if (!data) return;

    // Example trend data (modify based on actual data structure)
    const dates = data.map(item => item.date);
    const incidents = data.map(item => item.value);

    const trace = {
        x: dates,
        y: incidents,
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#3498db',
            width: 2
        },
        marker: {
            size: 6,
            color: '#2c3e50'
        }
    };

    const layout = {
        title: 'Flood Incidents Over Time',
        xaxis: {
            title: 'Date',
            showgrid: false
        },
        yaxis: {
            title: 'Number of Incidents',
            showgrid: true,
            gridcolor: '#f5f5f5'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 40, r: 20, b: 40, l: 60 }
    };

    Plotly.newPlot('trend-chart', [trace], layout, {responsive: true});
}

// Populate data table
function populateTable(data) {
    if (!data) return;

    const tbody = document.querySelector('#flood-data-table tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date || '-'}</td>
            <td>${item.location || '-'}</td>
            <td>${item.status || '-'}</td>
            <td>${item.details || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize dashboard
async function initializeDashboard() {
    const data = await fetchFloodData();
    updateStats(data);
    createTrendChart(data);
    populateTable(data);
}

// Refresh data periodically
setInterval(initializeDashboard, 300000); // Refresh every 5 minutes

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDashboard);
