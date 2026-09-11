# 🩺 MediCare+ — Doctor Consultation Platform

MediCare+ is a modern full-stack **Doctor Consultation Platform** designed to connect patients with certified doctors through an easy-to-use online healthcare system.

The platform allows patients to explore healthcare services, book doctor consultations, and access online medical care. Doctors can manage consultations, while administrators can manage the platform through a dedicated admin interface.

## 🌐 Live Demo

🚀 **Live Website:**
https://doctor-consultation-platform-fawn.vercel.app/

---

## 📌 Project Overview

MediCare+ provides a digital healthcare experience where users can access medical consultation services from anywhere.

The platform is designed with a modern, responsive interface and focuses on simplifying the process of finding doctors and booking consultations.

### 🎯 Main Goals

* Make healthcare consultation easily accessible online
* Allow patients to book doctor consultations
* Provide dedicated access for patients, doctors, and administrators
* Support online video consultations
* Provide a clean and responsive healthcare UI
* Manage appointments and consultation information digitally

---

## ✨ Features

### 👨‍⚕️ Doctor Features

* Doctor login
* Doctor dashboard
* Manage appointments
* View patient information
* Manage consultation requests
* Online consultation support
* Doctor profile management

### 👤 Patient Features

* Patient registration and login
* Browse healthcare categories
* Find doctors
* View doctor information
* Book appointments
* Online video consultation
* Manage appointments
* View consultation information

### 🛡️ Admin Features

* Admin authentication
* Admin dashboard
* Manage doctors
* Manage patients
* Manage appointments
* Monitor platform activities
* Manage healthcare information

### 🎥 Online Consultation

* Video consultation support
* Real-time doctor-patient communication
* Online appointment-based consultation
* Secure consultation access

### 📱 Responsive Design

The application is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

---

## 🏥 Healthcare Categories

The platform includes multiple healthcare categories such as:

* Primary Care
* Mental & Behavioral Health
* Sexual Health
* Children's Health
* Senior Health
* Women's Health
* Men's Health
* Wellness

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Next.js
* JavaScript
* Tailwind CSS
* shadcn/ui
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* MongoDB Atlas

### Authentication & Security

* JWT Authentication
* bcrypt
* Role-Based Access Control

### Payment

* Razorpay

### Video Consultation

* ZEGOCLOUD

### Cloud Services

* Cloudinary

### Development Tools

* Git
* GitHub
* VS Code
* Postman

### Deployment

* Vercel

---

## 🏗️ Project Architecture

```text
doctor-consultation-platform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── admin/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

> Update the folder structure above if your actual GitHub repository uses different folder names.

---

## 🔐 User Roles

The platform supports three main roles:

```text
                 MediCare+
                    │
       ┌────────────┼────────────┐
       │            │            │
    Patient       Doctor        Admin
       │            │            │
       ↓            ↓            ↓
   Book Visit   Manage Visit   Manage Users
   View Doctor  Appointments   Manage Doctors
   Consultation Patient Info   Manage Platform
```

---

## 🔄 Application Flow

### Patient Flow

```text
Register / Login
       ↓
Explore Healthcare
       ↓
Find Doctor
       ↓
Select Doctor
       ↓
Book Appointment
       ↓
Payment
       ↓
Appointment Confirmation
       ↓
Online Consultation
```

### Doctor Flow

```text
Doctor Login
     ↓
Doctor Dashboard
     ↓
View Appointments
     ↓
Manage Patients
     ↓
Accept / Manage Consultation
     ↓
Start Video Consultation
```

### Admin Flow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Manage Doctors
     ↓
Manage Patients
     ↓
Manage Appointments
     ↓
Monitor Platform
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Praveensuthar/doctor-consultation-platform.git
```

```bash
cd doctor-consultation-platform
```

> Replace the repository URL with your actual GitHub repository URL.

---

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

### 4. Install Admin Dependencies

If your project contains a separate admin application:

```bash
cd admin
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend/server directory.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

ZEGOCLOUD_APP_ID=your_zegocloud_app_id
ZEGOCLOUD_SERVER_SECRET=your_zegocloud_server_secret
```

For the frontend, create the required `.env` file according to your application's API configuration.

Example:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=₹
```

### ⚠️ Important

Never upload your `.env` file to GitHub.

Add this to `.gitignore`:

```gitignore
.env
.env.local
node_modules
dist
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Start Admin

If the project has a separate admin application:

```bash
cd admin
npm run dev
```

---

## 🧪 API Testing

Backend APIs can be tested using:

* Postman
* Thunder Client

Typical API modules include:

```text
/api/user
/api/doctor
/api/admin
/api/appointment
/api/payment
```

Update these routes according to your actual backend implementation.

---

## 🔒 Security

The application uses several security practices:

* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Role-based authorization
* Environment variables for sensitive credentials
* Secure database connection
* Authentication middleware

---

## 🚀 Deployment

The project can be deployed using **Vercel** for the frontend and a suitable backend hosting platform for the API.

Your current live deployment is:

**MediCare+**

https://doctor-consultation-platform-fawn.vercel.app/

Vercel supports deploying web applications and connecting third-party services through integrations.

---

## 📸 Screenshots

Add your project screenshots here:

```markdown
## 📸 Screenshots

### 🏠 Home Page

![Home Page](./screenshots/home.png)

### 👨‍⚕️ Doctor Dashboard

![Doctor Dashboard](./screenshots/doctor-dashboard.png)

### 👤 Patient Dashboard

![Patient Dashboard](./screenshots/patient-dashboard.png)

### 📅 Appointment Booking

![Appointment Booking](./screenshots/appointment.png)

### 🎥 Video Consultation

![Video Consultation](./screenshots/video-consultation.png)

### 🛡️ Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## 📊 Key Highlights

| Feature           | Description                      |
| ----------------- | -------------------------------- |
| 👤 Authentication | Secure user authentication       |
| 👨‍⚕️ Doctors     | Doctor management and profiles   |
| 📅 Appointments   | Online appointment booking       |
| 🎥 Video Calls    | Online doctor consultation       |
| 💳 Payments       | Online payment integration       |
| 🛡️ Admin         | Platform administration          |
| ☁️ Cloudinary     | Cloud image/file management      |
| 📱 Responsive     | Mobile, tablet & desktop support |
| 🔐 JWT            | Secure authentication            |
| 🗄️ MongoDB       | Database management              |

---

## 💡 What I Learned

While developing this project, I worked with:

* Full-stack MERN architecture
* REST API development
* MongoDB database design
* Authentication and authorization
* Role-based access control
* Payment gateway integration
* Real-time video consultation
* Cloudinary integration
* API testing with Postman
* Git and GitHub
* Vercel deployment
* Responsive UI development

---

## 🔮 Future Improvements

Potential future improvements include:

* 📱 Mobile application
* 🔔 Push notifications
* 📧 Email appointment reminders
* 💬 Doctor-patient chat
* 📄 Digital prescription management
* 🧾 Medical reports
* ⭐ Doctor reviews and ratings
* 🤖 AI-powered health assistant
* 📊 Advanced analytics dashboard
* 🗓️ Advanced doctor availability scheduling

---

## 👨‍💻 Developer

**Praveen Suthar**

🎓 B.Tech — Computer Science & Engineering
💻 MERN Stack Developer

### Skills

```text
React.js
Next.js
JavaScript
Node.js
Express.js
MongoDB
Tailwind CSS
REST APIs
JWT
Git & GitHub
```

---

## 🌐 Live Project

🚀 **MediCare+ — Doctor Consultation Platform**

https://doctor-consultation-platform-fawn.vercel.app/

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

### 📄 License

This project was developed for educational and portfolio purposes.
