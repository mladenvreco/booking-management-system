
# Kampify – Booking Management App for Rafting Camps

Kampify is a modern web application built for internal use by rafting camps to streamline and simplify the booking process. It is tailored to handle multiple users with different access levels and provides all necessary tools for managing reservations, availability, reporting, and more.

## 🌟 Features

- ✅ Quick booking creation and editing  
- 🛏️ View available bungalows by date  
- 🔍 Search reservations by guest name or date  
- 📄 Export reservation data (PDF/CSV)  
- 💰 Revenue overview for custom time periods  
- 👥 Multi-user access with role-based permissions  
- 🧾 Printable daily reports and listings  
- ☁️ Real-time autosave and secure data storage  
- 📦 Daily automated backups (7-day retention)  
- 🔐 Access via username & password  
- 🧩 Customizable features per camp needs   

---

## 👥 User Roles & Permissions

- Unlimited users with individual accounts.
- Role-based access control:
  - **Reception**: Can add/edit reservations.
  - **Kitchen**: Sees only guest meal-related data.
  - **Manager/Owner**: Full access, including finances.

## 👤 Who Is This For?

This application is built for **rafting camps** and their internal teams – from reception and kitchen staff to management and owners. Whether you run a small camp or a large business with over 500,000€ in annual revenue, Kampify can streamline your reservation process.

---

## 🛠️ Built With

- **React.js** – modern JavaScript UI library  
- **Supabase** – open source backend-as-a-service (auth + database + storage)  
- **PDFKit / CSV libraries** – for exports  

---

## 🗂️ Project Structure (`src/` folder)

- `data` - Static or preloaded data
- `features` - Core business logic
- `hooks` - Custom React hooks
- `pages` - Application pages (Next.js style routing)
- `services` - External service handlers (e.g. Supabase)
- `styles` - Global and component styles
- `ui` - Reusable UI components
- `utils` - Utility/helper functions
- `App.jsx`, `main.jsx` – Entry point and root component

## 🚀 Live Demo & Video

- 🌐 [Live Demo](https://kampifydemo.netlify.app/)
- 🎥 [Video Presentation](https://www.youtube.com/watch?v=h9ns1xneE_s)

## 📦 Installation

1. Clone the repo:
```
   bash
   git clone https://github.com/yourusername/kampify.git
   cd kampify
   npm install
   # or
   yarn install
   npm run dev
```

## 📄 License

This project is not open-sourced but available for demonstration purposes. Contact the author for more info.

---

📞 Contact

Created by Mladen Vrećo

📍 Foča, Bosnia and Herzegovina

💼 Frontend Developer | UI/UX Enthusiast

🌐 vreco.vercel.app

📧 [vrecom00@gmail.com] 
