# 🚗 Street Garage App

My SoftUni Angular Course Project
Street Garage is a modern web application where users can **share cars**, **ask questions**, and interact with a community of car enthusiasts.

---

## ✨ Features

* 🚘 Post your own cars with images, description, and tags
* ❓ Ask and browse automotive questions (Q&A section)
* 🗑️ Delete your own posts/questions
* 🏷️ Tag system for better categorization
* 📅 Automatic timestamps for posts
* ⚡ Fast and reactive UI using Angular Signals

---

## 🛠️ Tech Stack

* **Frontend:** Angular (Standalone Components + Signals)
* **Backend / Database:** Firebase Firestore
* **Authentication:** Firebase Auth *(optional / future upgrade)*
* **Styling:** CSS

---

## 📂 Project Structure

```
src/
 ├── app/
 │   ├── services/        # Firebase logic (CRUD operations)
 │   ├── interfaces/      # TypeScript interfaces
 │   ├── components/      # UI components
 │   └── pages/           # Main pages (Feed, Q&A, etc.)
```

---

## 🚀 Getting Started

### 1. Clone the repository

```
git clone https://github.com/Anatoli33/Car-Forum
cd project
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Setup Firebase

1. Go to Firebase Console
2. Create a project
3. Enable Firestore Database
4. Copy your config and replace it in:

```
services/firebase.js
```

---

### 4. Run the app

```
ng serve
```

Open in browser:

```
http://localhost:4200
```

---

## 🔥 Firestore Structure

### `cars`

```
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

### `questions`

```
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

* 🔐 User authentication (login/register)
* ❤️ Like system
* 💬 Comments on cars and questions
* 🧑‍🔧 User profiles
* 📱 Responsive mobile design
* ⚡ Real-time updates with Firestore listeners

---

## 🧠 What I Learned

* Working with Angular Signals
* Structuring scalable frontend apps
* Integrating Firebase Firestore
* Handling async data and UI updates
* Building real-world CRUD applications

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Created by **Anatoli Hadzhiev**

---

⭐ If you like this project, consider giving it a star!
