# Expenses Tracker App

Expenses Tracker App is an application designed to help one manage their income, expenses and savings.

## Features

- **Dashboard**: View a summary of Total expenses for the entire period, Total expenses for the month, Top Category with the most expenses and also recent expenses.
- **Add/Edit/Delete Expenses**: Expenses List Module.
- **View Expenses Statement**: Statement Module.
- **Download Expenses Statement**: Download Expenses Statement over a given period in PDF or Excel formats.
- **View Expenses Reports**: View Expenses Reports over a given period in a Pie Chart, Bar Chart or Tabular outputs.

## Tech Stack

- **Frontend**: React with Vite for a fast development experience.
- **State Management**: React UseState for managing application state.
- **Routing**: React Router for navigation between pages.
- **Backend**: Python for backend services.
- **Data Fetching**: React Fetch for efficient data fetching and caching.
- **Styling**: Tailwind CSS for styling components.

## Routes

- **Login**: `/login` - User login page.
- **Dashboard**: `dashboard` - Dashboard for managing expenses records.
  - **View and Manage Expenses**: `/dashboard/Expenses List` - View and Manage Expenses.
  - **Statement**: `/dashboard/statement` - View and Download Expenses Statement.
  - **Reports**: `/dashboard/reports` - View and Download Expenses Statements.
- **Not Found**: `*` - Page displayed when a route is not found.

## Screenshots

![Landing Page](./ds_client/public/Login-ExpensesTracker.PNG)


## Installation

To get started with House GRW, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone git@github.com:{yourusername}/rexpenses_tracker.git
   
   ```

2. Navigate to the project directory:

   ```bash
   cd ds_client
   ```

3. Install dependencies using npm:

   ```bash
   npm install
   ```

## Usage

Once you have installed the dependencies, you can run the project locally:

```bash
npm run dev
```

This will start the development server. You can now access the application by navigating to `http://localhost:3000` in your web browser.