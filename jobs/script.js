document.addEventListener('DOMContentLoaded', function () {
    const jobsContainer = document.getElementById('jobs-container');
    console.log('Fetching job data...');

    // Fetch job data from the API using the proxy server
    fetch('http://localhost:8080/https://careers.abb-bank.az/api/vacancy/v2/get')
        .then(response => {
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(jobs => {
            console.log('Fetched job data:', jobs);

            // Display each job
            jobs.forEach(job => {
                const jobDiv = document.createElement('div');
                jobDiv.className = 'job-container';

                jobDiv.innerHTML = `
                    <h2>${job.title}</h2>
                    <p><strong>Description:</strong> ${job.description}</p>
                    <p><strong>Job Type:</strong> ${job.type}</p>
                    <p><strong>Term:</strong> ${job.term}</p>
                    <p><strong>Start Date:</strong> ${job.begin_date}</p>
                    <p><strong>End Date:</strong> ${job.end_date}</p>
                    <p><strong>Status:</strong> ${job.status === 1 ? 'Active' : 'Inactive'}</p>
                    <p><strong>Job URL:</strong> <a href="${job.url}" target="_blank">${job.url}</a></p>
                `;

                jobsContainer.appendChild(jobDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching job data:', error);
            jobsContainer.innerHTML = `<p>Error fetching job data: ${error.message}</p>`;
        });
});
