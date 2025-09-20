# Boston Red Sox Player Statistics Tracker

**Live Application:** [Your Render URL Here]

## Project Overview

The Boston Red Sox Player Statistics Tracker is a web application that allows users to manage and track baseball player performance metrics. Users can create accounts, log in, and maintain their own personal database of player statistics including batting average (AVG), on-base percentage (OBP), slugging percentage (SLG), and the automatically calculated OPS (On-base Plus Slugging).

### Key Features

- **User Authentication**: Simple username/password authentication with automatic account creation
- **Personal Data Management**: Each user maintains their own separate collection of player statistics
- **Full CRUD Operations**: Add, view, edit, and delete player records
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **Real-time Calculations**: Automatic OPS calculation based on OBP and SLG values
- **Data Persistence**: All data stored in MongoDB with user session management

## Application Goals

The primary goal of this application is to provide baseball enthusiasts, coaches, or statisticians with a simple, intuitive tool to track and manage player performance data. The application demonstrates modern web development practices including:

- Two-tier architecture with Express.js backend and responsive frontend
- Persistent data storage with MongoDB
- User authentication and session management
- Modern CSS framework implementation
- RESTful API design

## Challenges Faced

### 1. Database Schema Design
Designing the MongoDB collections to properly separate user data while maintaining efficient queries was initially challenging. I resolved this by implementing a user-based data segregation model where each player record includes a `userId` field.

### 2. Session Management
Implementing secure session handling with MongoDB session storage required careful configuration of the express-session middleware with connect-mongo to ensure sessions persist across server restarts.

### 3. Form Validation and User Experience
Creating a seamless experience for both adding new players and editing existing ones in the same form required careful state management in the frontend JavaScript.

### 4. Responsive Design
Ensuring the application works well on both desktop and mobile devices while maintaining the professional appearance required extensive CSS customization on top of Bootstrap.

## Authentication Strategy

I chose to implement a simple **username/password authentication system** for the following reasons:

1. **Simplicity**: Easy for users to understand and for graders to test
2. **No External Dependencies**: Doesn't require OAuth provider accounts or API keys
3. **Educational Value**: Demonstrates basic session management and user data segregation
4. **Quick Testing**: Automatic account creation makes it easy to test different user scenarios

**Note**: In a production environment, passwords would be hashed using bcrypt or similar, but for this educational project, plain text storage is acceptable.

### Login Instructions
- Visit the application URL
- Enter any username and password
- If the username doesn't exist, a new account will be automatically created
- If the username exists, you must enter the correct password

**Demo Account**: You can use username: `demo` and password: `password` for testing.

## CSS Framework Choice

I selected **Bootstrap 5** as the CSS framework for this project because:

1. **Comprehensive Component Library**: Bootstrap provides a complete set of UI components including forms, tables, buttons, and navigation elements that match perfectly with the application's needs
2. **Responsive Grid System**: The 12-column grid system makes it easy to create layouts that work on all device sizes
3. **Modern Design**: Bootstrap 5's design language is clean, professional, and contemporary
4. **Extensive Documentation**: Well-documented with examples, making it easy to implement and customize
5. **No jQuery Dependency**: Bootstrap 5 is built with vanilla JavaScript, reducing dependencies

### CSS Customizations Made

While Bootstrap handles most of the styling, I made several custom modifications:

- **Color Scheme**: Implemented Boston Red Sox team colors (#0C2340 navy blue and #BD3039 red) throughout the application
- **Custom Gradients**: Added gradient backgrounds for headers and navigation to create visual depth
- **Enhanced Cards**: Added hover effects and improved shadows for better visual feedback
- **Custom Badges**: Created specialized styling for position and statistics badges
- **Typography**: Integrated Google Fonts (Montserrat and Open Sans) for improved readability
- **Animation Effects**: Added subtle hover animations and transitions for better user interaction

## Express Middleware Used

1. **express.json()** - Parses incoming JSON payloads from client requests
2. **express.urlencoded({ extended: true })** - Parses URL-encoded form data
3. **express.static('public')** - Serves static files (HTML, CSS, JS) from the public directory
4. **express-session** - Manages user sessions with MongoDB session storage via connect-mongo
5. **Custom requireAuth middleware** - Protects routes by checking for valid user sessions and redirecting unauthorized users to login

## Technical Achievements

### **W3C Accessibility Implementation**

I implemented 12 active accessibility improvements following W3C guidelines:

1. **Skip Navigation Links** - Added "Skip to main content" links on both pages that appear on focus, allowing keyboard users to bypass navigation elements.

2. **Semantic HTML Structure** - Used proper semantic elements (`<main>`, `<nav>`, `<header>`, `<section>`, `<fieldset>`, `<legend>`) to provide document structure for screen readers.

3. **ARIA Landmarks and Labels** - Added `role` attributes, `aria-label`, `aria-labelledby`, and `aria-describedby` to provide context for interactive elements and form relationships.

4. **Form Field Descriptions** - Added `aria-describedby` linking form inputs to help text, and used `<legend>` elements to group related form fields with context.

5. **Required Field Indicators** - Added visual asterisks (*) with `aria-label="required"` for screen readers, plus validation feedback with `role="alert"`.

6. **Live Region Announcements** - Implemented `aria-live="polite"` regions for dynamic content updates and screen reader announcements when players are added/deleted.

7. **Enhanced Focus Indicators** - Added custom focus styles with high contrast outlines (3px solid #005fcc) that exceed WCAG requirements for keyboard navigation visibility.

8. **Button Context and Tooltips** - Added descriptive `aria-label` attributes and `title` attributes for icon-only buttons, providing clear action context.

9. **Table Accessibility** - Used `<caption>`, `<th scope="col">`, proper headers, and descriptive text for data table navigation by screen readers.

10. **Abbreviation Expansions** - Used `<abbr title="">` tags for baseball statistics (AVG, OBP, SLG, OPS) to provide full terminology on hover/focus.

11. **High Contrast Mode Support** - Added CSS `@media (prefers-contrast: high)` queries to enhance borders and contrast for users with visual impairments.

12. **Form Validation with Accessibility** - Implemented client-side validation with `aria-invalid`, error announcements, and focus management to guide users through error correction.

### **CRAP Design Principles Analysis**

#### **Contrast**
Contrast serves as the primary visual hierarchy tool throughout the application. The most emphasized elements on each page use the strong Red Sox red (#BD3039) against white backgrounds - specifically the primary action buttons (Login, Add Player) and the main navigation header. Secondary contrast is achieved through the navy blue (#0C2340) used for card headers and table headers, creating depth while maintaining readability. Text contrast ratios exceed WCAG AA standards with dark text on light backgrounds and white text on dark backgrounds. The statistics badges use subtle blue backgrounds (#e3f2fd) with dark blue text to draw attention without overwhelming the data presentation. Error states use high-contrast red backgrounds for immediate attention, while success states use green. This contrast hierarchy guides users naturally through the interface, making the most important actions visually prominent.

#### **Repetition**  
Repetition creates consistency and professional cohesion throughout the application. The color palette is consistently applied - Red Sox red for primary actions, navy blue for headers, and neutral grays for secondary elements appear on every page. Typography uses two Google Fonts consistently: Montserrat for headings and branding elements, and Open Sans for body text and form labels. The card-based layout pattern repeats across both login and dashboard pages, creating familiarity. Icon usage from Bootstrap Icons is consistent - the same icons represent the same concepts (person icons for users, chart icons for statistics, action icons for edit/delete). Border radius values of 8px for buttons and 15px for cards are repeated throughout. Button styling, spacing patterns, and form input appearances maintain consistent visual treatment, creating a unified design language that users can predict and navigate intuitively.

#### **Alignment**
Alignment creates order and professional appearance through careful positioning of elements. The application uses Bootstrap's grid system to create strong left-aligned columns for the form and table sections, with consistent margins and padding. Form labels are left-aligned with their inputs, creating clear reading paths for users. The navigation bar uses justified alignment with the brand logo left-aligned and user controls right-aligned, following web conventions. Table data uses left alignment for text (names, positions) and consistent alignment for numerical data. Card headers center their titles while maintaining left-aligned content within cards. The login page centers the entire card both horizontally and vertically, creating balance and focus. Button groups use consistent spacing and alignment, particularly visible in the table action buttons and form submission controls, creating predictable interaction patterns.

#### **Proximity**
Proximity organizes related information into logical groups, reducing cognitive load and improving usability. The login page groups credentials (username and password) together with minimal spacing, clearly separated from action buttons below. The dashboard form groups player information fields together, then separates statistical inputs into their own section with a fieldset and legend. Related statistics (AVG, OBP, SLG) are grouped in a three-column layout, showing their relationship while maintaining individual identity. The table groups player data rows with consistent spacing, while action buttons for each player are grouped closely together. Form labels and their corresponding inputs have tight proximity, with help text positioned directly below inputs. Error messages appear immediately adjacent to their related fields. The navigation area groups user identification and logout functionality together, separated from the main brand elements, creating clear functional zones that users can quickly scan and understand.

## Design/UX Achievements
- **W3C Accessibility**: Implemented 12 active accessibility improvements following W3C guidelines including skip navigation, ARIA labels, semantic HTML, form accessibility, screen reader support, and high contrast mode compatibility.
- **CRAP Design Principles**: Comprehensive analysis of how the site implements Contrast, Repetition, Alignment, and Proximity principles from the Non-Designer's Design Book.

### Backend Architecture
- **Node.js** with **Express.js** framework
- **MongoDB** with native MongoDB driver for data persistence
- **Session-based authentication** with MongoDB session storage
- **RESTful API endpoints** for player data management

### Frontend Architecture
- **Vanilla JavaScript** for DOM manipulation and API calls
- **Bootstrap 5** for responsive UI components
- **Modern ES6+ features** including async/await for API communication
- **Progressive enhancement** with graceful fallbacks

### Database Collections
- **users**: Stores user account information (username, password, creation date)
- **players**: Stores player statistics with user association
- **sessions**: Managed automatically by connect-mongo for session persistence

## Installation and Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file based on `.env.example`
4. Set up a MongoDB database (local or MongoDB Atlas)
5. Update the `MONGODB_URI` in your `.env` file
6. Run `npm start` to start the server
7. Visit `http://localhost:3000` in your browser

## API Endpoints

- `GET /` - Home page (redirects based on authentication)
- `GET /login` - Login page
- `POST /login` - Authentication endpoint
- `POST /logout` - Logout endpoint
- `GET /dashboard` - Main application dashboard (protected)
- `GET /players` - Get all players for authenticated user
- `POST /players` - Add new player for authenticated user
- `PUT /players/:id` - Update existing player
- `DELETE /players/:id` - Delete player

## Future Enhancements

- Password hashing for improved security
- Advanced statistics calculations (batting average over time, etc.)
- Data export functionality (CSV, JSON)
- Player photo uploads
- Team management features
- Advanced search and filtering options

# AI Usage Statement
ChatGPT was used as a resource similar to Google, StackOverflow, and other online documentation. Specifically, it was used to ask for

- Clarification of the assignment requirements.
- Examples of CSS frameworks and session secret keys
- Ideas for how to implement the technical and design achievements

I reviewed and edited all generated examples to make sure I understood them and that they met the assignment requirements.
All final code and design choices were my own.