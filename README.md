# Red Sox Player Statistics Tracker

This application tracks Boston Red Sox player statistics with a focus on offensive performance metrics. It allows users to add, edit, and delete player records while automatically calculating OPS as a derived field.

## Technical Achievements

- **Single-Page Application**: Implemented a single page app that provides a form for users to submit data and always shows the current state of the server-side data. When the user submits data, the server responds with the updated data (including the derived OPS field calculated on the server) and the client updates its data display.

- **Data Modification**: Added the ability to modify existing data in addition to adding and deleting data on the server.

## Design Achievements

- **CSS Flexbox Layout**: Used CSS Flexbox for responsive layout that works on both desktop and mobile devices.

- **Red Sox Theme**: Implemented a color scheme using the official Red Sox colors (#BD3039 red, #0C2340 navy blue, #FFFFFF white).

- **Google Fonts**: Used Montserrat for headings and Open Sans for body text to create a modern, readable interface.

## How to Use

1. Navigare to https://a2-ethanknorring.onrender.com/ 
2. View current player statistics in the table
3. Add new players using the form
4. Edit or delete existing players using the buttons in the table

Alternatively,
1. Start the server with `node server.improved.js` or `npm start` 
2. Open your browser to `http://localhost:3000`

The application calculates OPS as a derived field based on the player's on-base percentage (OBP) and slugging percentage (SLG), providing a comprehensive measure of a player's offensive performance.

## Base Requirements Met

- **Server**: Maintains a dataset of Red Sox players with 6 fields (id, name, position, avg, obp, slg, ops)
- **Results**: Displays all player data in a table
- **Form/Entry**: Allows adding, editing, and deleting player data
- **Server Logic**: Calculates OPS as a derived field from OBP and SLG
- **HTML**: Form with various input types, table for results, validated HTML
- **CSS**: Element, ID, and class selectors; Flexbox layout; web fonts; external stylesheet
- **JavaScript**: Front-end code to get/fetch data from the server
- **Node.js**: HTTP server that delivers files and calculates derived fields

# AI Usage Statement
ChatGPT was used as a resource in the same way as Google or other online documentation.
Specifically, I asked for:

- Clarification of the assignment requirements.
- Examples of how to structure my index.html with semantic HTML, CSS, and JavaScript.
- Ideas for how to implement the technical and design achievements

I reviewed and edited all generated examples to make sure I understood them and that they met the assignment requirements.
All final code and design choices were my own.