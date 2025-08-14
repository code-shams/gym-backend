# 🏋️‍♂️ Gym Class Scheduling and Membership Management System

## 📖 Project Overview

The Gym Class Scheduling and Membership Management System is a comprehensive backend solution designed to efficiently manage gym operations with role-based access control. The system supports three distinct user roles - **Admin**, **Trainer**, and **Trainee** - each with specific permissions and functionalities.

### Key Features:
- **Role-based Authentication**: Secure JWT-based authentication system
- **Class Scheduling**: Admins can create and manage class schedules with business rule enforcement
- **Booking Management**: Trainees can book and cancel class schedules
- **Trainer Management**: Complete CRUD operations for trainer profiles
- **Business Rule Enforcement**: Automated validation for scheduling limits and capacity constraints

## 🛠️ Technology Stack

- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Encryption**: bcryptjs
- **Deployment**: Vercel (Serverless)
- **Database Hosting**: MongoDB Atlas

## 📚 API Endpoints

### 🔐 Authentication Routes (`/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new trainee | Public |
| POST | `/auth/login` | Login user (all roles) | Public |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "admin@gym.com",
  "password": "admin123"
}
```

**Success Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "trainee",
  "token": "jwt_token_here"
}
```

### 👥 User Management Routes (`/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users/profile` | Get current user profile | All authenticated users |
| PUT | `/users/profile` | Update trainee profile | Trainee only |
| POST | `/users` | Create new trainer | Admin only |
| GET | `/users` | Get all trainers | Admin only |
| PUT | `/users/:id` | Update trainer | Admin only |
| DELETE | `/users/:id` | Delete trainer | Admin only |

**Create Trainer Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@gym.com",
  "password": "trainer123"
}
```

**Update Profile Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword"
}
```

### 📅 Class Schedule Routes (`/schedules`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/schedules` | Create class schedule | Admin only |
| GET | `/schedules/my` | View trainer's schedules | Trainer only |

**Create Schedule Request Body:**
```json
{
  "date": "2025-08-15T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "12:00",
  "trainer": "trainer_id_here"
}
```

**Schedule Response:**
```json
{
  "message": "Schedule created",
  "schedule": {
    "_id": "schedule_id",
    "date": "2025-08-15T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "12:00",
    "trainer": "trainer_id",
    "maxTrainees": 10,
    "bookedTrainees": []
  }
}
```

### 📝 Booking Routes (`/bookings`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/bookings` | Book a class | Trainee only |
| DELETE | `/bookings/:bookingId` | Cancel booking | Trainee only |
| GET | `/bookings/my` | View my bookings | Trainee only |

**Book Class Request Body:**
```json
{
  "classScheduleId": "schedule_id_here"
}
```

**Booking Response:**
```json
{
  "message": "Class booked successfully",
  "booking": {
    "_id": "booking_id",
    "trainee": "trainee_id",
    "classSchedule": "schedule_id",
    "createdAt": "2025-08-14T10:00:00.000Z"
  }
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "trainer", "trainee"],
    default: "trainee"
  }
}
```

### ClassSchedule Model
```javascript
{
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Format: "HH:mm"
  endTime: { type: String, required: true },   // Format: "HH:mm"
  trainer: { type: ObjectId, ref: "User", required: true },
  maxTrainees: { type: Number, default: 10 },
  bookedTrainees: [{ type: ObjectId, ref: "User" }]
}
```

### Booking Model
```javascript
{
  trainee: { type: ObjectId, ref: "User", required: true },
  classSchedule: { type: ObjectId, ref: "ClassSchedule", required: true }
}
```

## 🔑 Admin Credentials

Use these credentials to test admin functionalities:

```
Email: admin@gym.com
Password: admin123
```

## 🚀 Instructions to Run Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gym-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/gym-management
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gym-management
   
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   ```

4. **Seed Admin User (Optional)**
   Create an admin user manually in MongoDB or through the application:
   ```javascript
   // Admin user document
   {
     name: "Admin User",
     email: "admin@gym.com",
     password: "$2a$10$hashedPasswordHere", // bcrypt hash of "admin123"
     role: "admin"
   }
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the production server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

### Testing the Setup
Visit `http://localhost:5000` - you should see "Gym API Running"

## 🌐 Live Hosting Link

**Live API Base URL**: `https://your-vercel-app.vercel.app`

*Replace with your actual Vercel deployment URL*

## 📋 Postman Documentation

### Import Collection
1. Open Postman
2. Click "Import" button
3. Use the following endpoints as a starting collection

### Environment Variables
Create a Postman environment with:
- `base_url`: `https://your-vercel-app.vercel.app` (or `http://localhost:5000` for local)
- `auth_token`: (will be set after login)

### Testing Workflow

#### 1. **Admin Authentication & Setup**
```bash
# Login as Admin
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@gym.com",
  "password": "admin123"
}

# Copy the token from response and set as auth_token in environment
```

#### 2. **Create Trainer**
```bash
# Create Trainer (Admin only)
POST {{base_url}}/users
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "email": "sarah@gym.com",
  "password": "trainer123"
}
```

#### 3. **Create Class Schedule**
```bash
# Create Schedule (Admin only)
POST {{base_url}}/schedules
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "date": "2025-08-15T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "12:00",
  "trainer": "TRAINER_ID_FROM_PREVIOUS_STEP"
}
```

#### 4. **Register and Test as Trainee**
```bash
# Register Trainee
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "Mike Wilson",
  "email": "mike@example.com",
  "password": "trainee123"
}

# Login as Trainee and update auth_token
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "mike@example.com",
  "password": "trainee123"
}
```

#### 5. **Book a Class**
```bash
# Book Class (Trainee only)
POST {{base_url}}/bookings
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "classScheduleId": "SCHEDULE_ID_FROM_PREVIOUS_STEP"
}
```

#### 6. **View Bookings**
```bash
# View My Bookings (Trainee only)
GET {{base_url}}/bookings/my
Authorization: Bearer {{auth_token}}
```

## 🧪 Testing Key Features

### **Feature 1: Trainer Management**
1. Login as admin using provided credentials
2. Create multiple trainers using `POST /users`
3. View all trainers using `GET /users`
4. Update trainer information using `PUT /users/:id`
5. Delete a trainer using `DELETE /users/:id`

### **Feature 2: Class Scheduling**
1. As admin, create class schedules using `POST /schedules`
2. Test business rules:
   - Try creating more than 5 schedules per day (should fail)
   - Try creating classes with duration other than 2 hours (should fail)
   - Try overlapping schedules for same trainer (should fail)
3. Login as trainer and view assigned schedules using `GET /schedules/my`

### **Feature 3: Class Booking**
1. Register/login as trainee
2. Book available classes using `POST /bookings`
3. Test booking limits:
   - Try booking same class twice (should fail)
   - Create 10 bookings for one schedule, then try 11th (should fail)
4. View personal bookings using `GET /bookings/my`
5. Cancel bookings using `DELETE /bookings/:bookingId`

### **Feature 4: Authentication & Authorization**
1. Test accessing admin routes without admin role (should fail with 403)
2. Test accessing protected routes without authentication (should fail with 401)
3. Test token expiration after 24 hours

## 🔒 Business Rules Validation

The system enforces the following business rules:

- ✅ **Maximum 5 class schedules per day**
- ✅ **Each class duration must be exactly 2 hours**
- ✅ **Maximum 10 trainees per class schedule**
- ✅ **No double booking for trainees in same time slot**
- ✅ **No overlapping schedules for the same trainer**
- ✅ **Role-based access control for all operations**

## ⚠️ Error Responses

Common error responses you might encounter:

```json
// Unauthorized access
{
  "message": "User not authenticated"
}

// Forbidden access
{
  "message": "Forbidden: Access denied"
}

// Validation error
{
  "message": "Class duration must be exactly 2 hours"
}

// Business rule violation
{
  "message": "Max 5 schedules allowed per day"
}
```

## 📞 Support

For any issues or questions, please refer to the API endpoints documentation above or test the functionality using the provided Postman collection.

---

**Happy Testing! 🏋️‍♂️**