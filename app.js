"use strict";
// Wait for the DOM to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resumeForm');
    // Attach event listener to handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(form); // Gather form data
        // Parse different sections of the form into structured objects/arrays
        const educationData = parseMultiField(formData.get('education'), formData.get('education-year'), formData.get('institute'));
        const experienceData = parseExperience(formData.get('experience'));
        const languagesData = parseCommaSeparated(formData.get('languages'));
        const skillsData = parseCommaSeparated(formData.get('skills'));
        // Construct the resume object using the parsed data
        const resumeData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dateOfBirth: formData.get('date-f-birth'),
            address: formData.get('address'),
            education: educationData,
            experience: experienceData,
            languages: languagesData,
            skills: skillsData,
            photo: formData.get('photo'), // Optional photo if provided
        };
        // Function call to render the dynamically generated resume on the page
        renderResume(resumeData);
    });
});
// Function to parse multiple fields (degree, year, institute) into an array format
function parseMultiField(degree, year, institute) {
    const degrees = degree.split('\n'); // Split entries by newline
    const years = year.split('\n');
    const institutes = institute.split('\n');
    const educationArray = [];
    // Iterate through each entry to form the education array
    for (let i = 0; i < degrees.length; i++) {
        educationArray.push({
            degree: degrees[i].trim(),
            year: years[i].trim(),
            institute: institutes[i].trim(),
        });
    }
    return educationArray; // Return the structured array
}
// Function to parse and structure experience data
function parseExperience(experience) {
    // Map through each line to form experience objects
    return experience.split('\n').map(exp => ({
        years: exp.trim().split(' ')[0], // Extracts years from the string
        description: exp.trim(),
    }));
}
// Helper function to parse comma-separated values (e.g., languages or skills)
function parseCommaSeparated(input) {
    return input.split(',').map(item => item.trim()); // Trim whitespace and return array
}
// Function to dynamically render the resume data onto the webpage
function renderResume(data) {
    const container = document.createElement('div');
    container.className = 'container'; // Apply the container class for styling
    container.innerHTML = `
        <div class="left-column"></div>
        <div class="right-column">
            <span class="name-section">
                <h1>${data.name}</h1>
            </span>
            <span class="info-section">
                <p><b>Phone :</b>${data.phone} <br><b>Email :</b> ${data.email} <b> <br> Birth Dat :</b> ${data.dateOfBirth}<br> <b>Address :</b> ${data.address}</p>
            </span>
            <div class="education">
                <h2>EDUCATION:</h2>
                ${data.education.map(edu => `<p>${edu.degree} <br><strong>${edu.year}</strong> From ${edu.institute}</p>`).join('')}
            </div>
            <div class="work-experience">
                <h2>WORK EXPERIENCE:</h2>
                ${data.experience.map(exp => `<p>${exp.description}</p>`).join('')}
            </div>
            <div class="languages">
                <h2>LANGUAGES:</h2>
                <div class="languages-list">
                    <ul>
                        ${data.languages.map(lang => `<li><p>${lang}</p></li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="skills">
                <h2>SKILLS:</h2>
                <div class="skills-list">
                    <ul>
                        ${data.skills.map(skill => `<li><p>${skill}</p></li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    // If a profile photo is provided, create and display it
    if (data.photo) {
        const photoContainer = document.createElement('span');
        photoContainer.className = 'profile-photo';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(data.photo);
        img.alt = `${data.name}'s photo`; // Accessible alt text for the image
        img.className = 'profile-photo';
        photoContainer.appendChild(img);
        container.appendChild(photoContainer);
    }
    // Remove any existing container before appending the new one to avoid duplication
    const existingContainer = document.querySelector('.container');
    if (existingContainer) {
        existingContainer.remove();
    }
    // Append the new container to the body of the document
    document.body.appendChild(container);
}
