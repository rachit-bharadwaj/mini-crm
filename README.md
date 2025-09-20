# Mini CRM Application

A full-stack Customer Relationship Management (CRM) application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) as an assignment for Dev Innovations Labs.

## Testing the platform

Test the platform using the following test accounts:

- Admin:
  - Email: `john@example.com`
  - Password: `password123`
- User:
  - Email: `jane@example.com`
  - Password: `password123`

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes

### Customer Management

- Create, read, update, and delete customers
- Search customers by name, email, or company
- Pagination support
- Customer detail view with associated leads

### Lead Management

- Create, read, update, and delete leads for each customer
- Lead status tracking (New, Contacted, Converted, Lost)
- Lead value tracking
- Filter leads by status

### Dashboard & Reporting

- Overview statistics (total customers, leads, recent activity)
- Visual charts showing lead distribution by status
- Top customers by lead count
- Responsive design for desktop and mobile

### Additional Features

- Request validation using Joi
- Password hashing with bcryptjs
- Responsive UI with Tailwind CSS
- Toast notifications
- Form validation with React Hook Form
- Charts with Recharts library
- Modern, professional UI design with animations
- Database seeding with realistic sample data
- Enhanced form designs and interactions
- Loading states and smooth transitions

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Joi** - Request validation
- **bcryptjs** - Password hashing
- **Jest** - Testing framework

### Frontend

- **React.js** - UI library
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Recharts** - Chart library
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp example.env .env
```

4. Update the `.env` file with your configuration:

```env
PORT=8000
API_VERSION=1.0.0
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
MONGO_URI=mongodb://localhost:27017/mini-crm
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

5. Seed the database with sample data (optional but recommended):

```bash
npm run seed
```

6. Start the backend server:

```bash
npm run dev
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

4. Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Customers

- `POST /api/customers` - Create customer (protected)
- `GET /api/customers` - List customers with pagination and search (protected)
- `GET /api/customers/:id` - Get customer details (protected)
- `PUT /api/customers/:id` - Update customer (protected)
- `DELETE /api/customers/:id` - Delete customer (protected)

### Leads

- `POST /api/customers/:customerId/leads` - Create lead (protected)
- `GET /api/customers/:customerId/leads` - List leads with pagination and filters (protected)
- `GET /api/customers/:customerId/leads/:leadId` - Get lead details (protected)
- `PUT /api/customers/:customerId/leads/:leadId` - Update lead (protected)
- `DELETE /api/customers/:customerId/leads/:leadId` - Delete lead (protected)

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

## Database Schema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Users      │    │    Customers    │    │      Leads      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ _id: ObjectId   │    │ _id: ObjectId   │    │ _id: ObjectId   │
│ name: String    │    │ name: String    │    │ title: String   │
│ email: String   │    │ email: String   │    │ description: Str│
│ passwordHash: S │    │ phone: String   │    │ status: Enum    │
│ role: Enum      │    │ company: String │    │ value: Number   │
│ createdAt: Date │    │ ownerId: Ref    │◄───┤ customerId: Ref │
│ updatedAt: Date │    │ createdAt: Date │    │ createdAt: Date │
└─────────────────┘    │ updatedAt: Date │    │ updatedAt: Date │
         │              └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     One-to-Many          │
                    │   (User owns Customers)  │
                    └───────────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     One-to-Many          │
                    │ (Customer has Leads)     │
                    └───────────────────────────┘
```

### Collection Details

**Users Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  role: String (enum: ["admin", "user"]),
  createdAt: Date,
  updatedAt: Date
}
```

**Customers Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  company: String,
  ownerId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

**Leads Collection**

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (enum: ["New", "Contacted", "Converted", "Lost"]),
  value: Number,
  customerId: ObjectId (ref: Customer),
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment (Render/Heroku)

1. Build the project:

```bash
npm run build
```

2. Set environment variables in your deployment platform
3. Deploy the built files

### Frontend Deployment (Vercel/Netlify)

1. Build the project:

```bash
npm run build
```

2. Set environment variables:

- `NEXT_PUBLIC_API_URL` - Your backend API URL

3. Deploy the built files

## Usage

### Quick Start with Sample Data

1. **Seed the Database**: Run `npm run seed` in the backend directory to populate with sample data
2. **Login**: Use the pre-created accounts:
   - Admin: `john@example.com` / `password123`
   - User: `jane@example.com` / `password123`
   - User: `mike@example.com` / `password123`

### Application Features

1. **Dashboard**: View beautiful charts and statistics with modern UI
2. **Customer Management**: Add, edit, and manage customers with enhanced visual design
3. **Lead Tracking**: Create and track leads with status management
4. **Search & Filter**: Advanced search and filtering capabilities
5. **Responsive Design**: Works perfectly on desktop and mobile devices

### Sample Data Includes

- **3 Users** (1 admin, 2 regular users)
- **50 Customers** with realistic company data
- **200 Leads** with various statuses and values
- **Realistic Data**: Names, companies, phone numbers, and lead descriptions

## Project Structure

```
├── backend/
│   ├── constants/          # Configuration constants
│   ├── controllers/        # Route controllers
│   ├── database/          # Database connection
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── tests/             # Unit tests
│   ├── utils/             # Utility functions
│   └── index.ts           # Entry point
├── frontend/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utility libraries
│   └── public/            # Static assets
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is created as an assignment for Dev Innovations Labs.

## Contact

For questions or support, please contact the development team.
