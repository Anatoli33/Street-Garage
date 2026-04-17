# 🚗 Street Garage

A modern Angular web application where car enthusiasts can **share vehicles, ask questions, and interact with a growing community**.

Built as part of a SoftUni course project, but structured with real-world development practices in mind.

---

## 🌐 Live Concept

Street Garage simulates a real automotive community platform where users can:

* Showcase their cars
* Ask for help or advice
* Explore content from other users

---

## ✨ Features

### 🚘 Cars

* Create and publish car posts
* Upload images and descriptions
* Add tags for better discoverability
* Automatic timestamps

### ❓ Q&A Section

* Ask automotive-related questions
* Browse community questions
* Clean and simple UI for readability

### ⚙️ Core Functionality

* Delete your own content
* Reactive UI using Angular Signals
* Structured Firebase integration

---
## 🛡️ Security & Optimization

* Custom Route Guards:

* authGuard: Protects private routes from guests.

* guestGuard: Prevents logged-in users from accessing Login/Register pages.

* isOwnerGuard: A dynamic guard that prevents users from editing or deleting content they don't own.

* Optimistic UI Updates: Used for the "Like" functionality to ensure an instant, lag-free user experience before the server responds.

* Signal-based State Management: Leveraging Angular Signals for fine-grained reactivity and minimal change detection cycles.

* Comprehensive Error Handling: Graceful handling of Firebase authentication errors (weak passwords, existing emails) and network failures with user-friendly feedback.

---

## 🛠️ Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | Angular (Standalone + Signals) |
| Backend  | Firebase Firestore             |
| Auth     | Firebase Auth *(planned)*      |
| Styling  | CSS                            |

---

## 📂 Project Structure

```
src/
 ├── app/
 │   ├── components/   # Reusable UI components
 │   ├── pages/        # Feature pages (Feed, Q&A, etc.)
 │   ├── services/     # Firebase logic & data handling
 │   ├── interfaces/   # TypeScript models
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anatoli33/Car-Forum
cd project
```

### 2. Install dependencies

```bash
npm install
```



### 3. Run the application

```bash
ng serve
```

Open:

```
http://localhost:4200
```

---

## 🔥 Database Structure

### cars

```ts
{
  id: string
  brand: string
  model: string
  year: number
  description: string
  image: string
  tags: string
  createdAt: timestamp
}
```

### questions

```ts
{
  id: string
  title: string
  description: string
  tags: string
  createdAt: timestamp
}
```

---

## 🔒 Future Improvements
* 📱 Fully responsive design
* 🔎 Search & filtering

---

## 🧠 What I Learned

* Building scalable Angular applications
* Using Angular Signals for reactive state
* Structuring frontend architecture
* Working with Firebase Firestore
* Managing async data and UI updates

---

## 📌 Project Status

🟡 In development – actively improving structure, features, and performance.

---

## 🤝 Contributing

Contributions are welcome.

If you have ideas or improvements:

* Open an issue
* Submit a pull request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Anatoli Hadzhiev**

---

⭐ If you find this project useful, consider giving it a star!
