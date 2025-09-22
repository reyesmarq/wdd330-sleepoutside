// A class for creating and managing an alert module.
export default class Alert {
    // The constructor takes the parent element where the alert will be rendered.
    constructor(listElement) {
      this.listElement = listElement;
      this.path = '/json/alerts.json';
    }
  
    // An asynchronous method to fetch the alert data and render the alert.
    async init() {
      // Fetch the data from the alerts.json file.
      const response = await fetch(this.path);
      if (response.ok) {
        const alerts = await response.json();
        this.renderAlerts(alerts);
      }
    }
  
    // A method to render the alerts to the page.
    renderAlerts(alerts) {
      // Create the main section element for the alerts.
      const section = document.createElement('section');
      section.classList.add('alert-list');
  
      // Loop through each alert in the JSON data.
      alerts.forEach(alert => {
        // Create a paragraph element for the alert message.
        const p = document.createElement('p');
        p.textContent = alert.message;
        p.style.backgroundColor = alert.background;
        p.style.color = alert.color;
        section.appendChild(p);
      });
  
      // Prepend the new section to the main element of the page.
      this.listElement.prepend(section);
    }
  }