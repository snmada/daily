# Daily - Healthcare Software Solution

Welcome to **Daily**, a full-stack solution designed to redefine how acne treatment journey is managed and experienced.

At the core of Daily lies a web-based application for doctors, built with the power of **React.js**. This is complemented by a mobile application for patients, developed using **React Native**. Behind the scenes, Daily runs on a robust **Node.js** backend, ensuring efficient performance and scalability. Data is securely stored in a **MySQL** database, while acne images are managed within **Firebase Cloud Storage**. Additionally, the tech stack is strengthened with the integration of the **Gmail API** for sending emails seamlessly.

## Table of Contents

1. [Web Application (Doctor's Portal)](#1-web-application-doctors-portal)  
2. [Mobile Application (Patient's App)](#2-mobile-application-patients-app)  
3. [Technologies Used](#3-technologies-used)  
4. [Getting Started](#4-getting-started)  
5. [Running The Project](#5-running-the-project) 
6. [Web Application UI](#6-web-application-ui)
7. [Mobile Application UI](#7-mobile-application-ui)
8. [Credits](#8-credits)

## 1. Web Application (Doctor's Portal)

The **web application** serves as a digital hub for storing patient data, where organization and accessibility come together, allowing doctors to focus on what truly matters - patient care.

The following diagram provides a visual representation of all actions a doctor can perform within the system.

<div align="center">
  <img alt="Doctor Diagram" src="https://github.com/snmada/daily/blob/main/assets/diagrams/doctor.png?raw=true">
</div>

## 2. Mobile Application (Patient's App)

The **mobile application** turns patients into active participants by enabling them to document their skin’s progress through before-and-after images, while staying up to date with their medical plan.

The following diagram provides a visual representation of all actions a patient can perform within the system.

<div align="center">
  <img alt="Patient Diagram" src="https://github.com/snmada/daily/blob/main/assets/diagrams/patient.png?raw=true">
</div>

## 3. Technologies Used

### Frontend
- **React.js 18** 
- **React Native**
- **Expo**
- **Material UI**
- **SCSS**
- **Axios**

### Backend
- **Node.js**
- **Express**
- **MySQL**
- **Gmail API**
- **Nodemailer**
- **JWT**
- **Bcrypt**

### Cloud Storage
- **Firebase Cloud Storage**

## 4. Getting Started 

### Prerequisites

1. **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/). This includes npm (Node Package Manager) needed for managing packages.
2. **MySQL**: Download and install MySQL from [mysql.com](https://www.mysql.com/). Follow the installation instructions for your operating system.
4. **Android Studio**: Download and install from [developer.android.com](https://developer.android.com/studio). This will allow you to use the Android Emulator for testing mobile app.
5. **Gmail API Setup**: Set up a Google Cloud project to use the Gmail API. Visit the [Google Cloud Console](https://console.cloud.google.com/) to create a project and enable the Gmail API.
6. **Firebase Setup**: Set up a Firebase project at [firebase.google.com](https://firebase.google.com/) to use Cloud Storage for storing images.

### Clone the Repository
Clone the repository to your local machine using the following command:

  ```bash
  git clone https://github.com/snmada/daily.git
  cd daily
  ```

### MySQL Database
This project uses a local MySQL database. Please create the database manually before running. Below is the Entity Relationship Diagram (ERD) to guide you in setting up the necessary tables and relationships.

<div align="center">
  <img alt="Entity Relationship Diagram" src="https://github.com/snmada/daily/blob/main/assets/diagrams/entity-relationship-diagram.png?raw=true">
</div>

## 5. Running the Project

### Start the Web Application 
- Navigate to the web directory, install the required dependencies, and start the web app:
   
  ```bash
  cd web
  npm install
  npm start
  ```
   
### Start the Mobile Application
- Navigate to the mobile directory, install the required dependencies, and start the mobile app:
   
  ```bash
  cd mobile
  npm install
  npm start
  ```
   
### Start the Backend Server
- Navigate to the server directory, install the required dependencies, and start the server:
   
  ```bash
  cd server
  npm install
  node index.js
  ```

## 6. Web Application UI

This section includes a few screenshots that provide an overview of the web application's user interface.

> ***Note**: All data in this application is fictional. However, I have covered certain potentially sensitive information with a grey sticker.*

### Landing Page
The Landing Page offers a brief description of both applications.

![Landing Page](https://github.com/snmada/daily/blob/main/assets/screenshots/web/landing-page.png?raw=true)

### Dashboard Page
The Dashboard Page offers an overview of data through visual charts and graphs. It displays key metrics, including patient distribution by gender, prevalence of acne, recent consultations, total patients, total consultations, and the average age of patients.

![Dashboard Page](https://github.com/snmada/daily/blob/main/assets/screenshots/web/dashboard-page.png?raw=true)

### Patients Page
The Patients Page displays a complete list of registered patients in table format. Doctors can easily access detailed profiles by selecting a patient, utilize filtering options to quickly find specific individuals, and effortlessly add new patients to the system.

![Patients Page](https://github.com/snmada/daily/blob/main/assets/screenshots/web/patients-page.png?raw=true)

### Add New Patient Form
The Add New Patient Form allows doctors to enter essential patient details, including firstname, lastname, personal numeric code, phone number, address, and country. To ensure data accuracy, I have implemented form validation using the **Yup** library, preventing the submission of incorrect or incomplete information.

![Add Patient Form](https://github.com/snmada/daily/blob/main/assets/screenshots/web/add-patient.png?raw=true)

### Patient Profile Page
The Patient Profile Page displays comprehensive information about a selected patient, including personal information, medical records, current treatment, allergies, acne images, and pre-existing medical conditions.

![Patient Profile Page](https://github.com/snmada/daily/blob/main/assets/screenshots/web/patient-profile.png?raw=true)

### Add Treatment Form
The Add Treatment Form lets doctors list the medications a patient needs. It includes fields for medication names, administration timing, and any relevant notes. This ensures that treatment plans are well-documented and easily accessible for effective patient care.

![Add Treatment Form](https://github.com/snmada/daily/blob/main/assets/screenshots/web/add-treatment.png?raw=true)

### Sign-In Page
The Sign-In Page allows doctors to sign in to the system with their credentials.

![Sign-In](https://github.com/snmada/daily/blob/main/assets/screenshots/web/sign-in.png?raw=true)

### Sign-Up Form (3-Step Process)

The sign-up process consists of three steps for doctors to create an account. In the first step, they provide personal details (firstname, lastname, personal numeric code). The second step requires their professional code to confirm their authorization to work in the healthcare sector. Lastly, in the third step, they establish sign-up credentials (email and password).

- Sign-Up (Step 1)

![Sign-Up Step1](https://github.com/snmada/daily/blob/main/assets/screenshots/web/sign-up-step-one.png?raw=true)

- Sign-Up (Step 2)

![Sign-Up Step2](https://github.com/snmada/daily/blob/main/assets/screenshots/web/sign-up-step-two.png?raw=true)

- Sign-Up (Step 3)

![Sign-Up Step3](https://github.com/snmada/daily/blob/main/assets/screenshots/web/sign-up-step-three.png?raw=true)

## 7. Mobile Application UI

This section includes a few screenshots that provide an overview of the mobile application's user interface.

> ***Note**: All data in this application is fictional. However, I have covered certain potentially sensitive information with a grey sticker.*

The mobile application starts with a sign-up screen, allowing users to either sign in to an account or sign up for one. Upon successful sign-in, users are welcomed to the home screen, which includes several widgets for easy navigation to important features. Patients can access their treatment plan and upload images of their skin condition. 

<div align="center">
  <img alt="Mobile Collage" src="https://github.com/snmada/daily/blob/main/assets/screenshots/mobile/screenshots-collage.png?raw=true">
</div>

## 8. Credits
Big thanks to [unDraw](https://undraw.co/) for the stunning illustrations that bring the web application to life.