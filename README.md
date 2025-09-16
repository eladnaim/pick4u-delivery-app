# Pick4U - Community Package Pickup App 📦

**Hebrew community-based package pickup platform built with React, TypeScript, and Firebase.**

## 🚀 Features

- 🔐 **SMS Authentication** - Secure login with Israeli phone numbers
- 📦 **Pickup Request Management** - Create and manage delivery requests
- 💬 **Real-time Chat** - Live messaging with price negotiation
- 📍 **Google Maps Integration** - Location-based matching
- 🔔 **Push Notifications** - Instant alerts for new requests
- 📱 **iOS App Ready** - Complete with 14 app icons for TestFlight
- 🌐 **PWA Support** - Works offline with service workers
- 🇮🇱 **Hebrew RTL Support** - Full right-to-left interface

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend:** Firebase (Auth, Firestore, Storage, Cloud Messaging)
- **Maps:** Google Maps JavaScript API
- **Build:** Vite + ESLint + PostCSS
- **PWA:** Service Workers + Web App Manifest

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── LoginForm.tsx   # User authentication
│   ├── ChatInterface.tsx # Real-time chat
│   └── ...
├── services/           # Firebase services
│   ├── authService.ts  # SMS authentication
│   ├── pickupService.ts # Pickup requests
│   └── chatService.ts  # Real-time messaging
├── hooks/              # React hooks
├── config/             # Firebase configuration
└── types/              # TypeScript definitions

public/
├── icons/              # 14 iOS app icons (20x20 to 1024x1024)
├── manifest.json       # PWA configuration
└── firebase-messaging-sw.js # FCM service worker
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Firebase project with Auth, Firestore, Storage, FCM enabled
- Google Maps API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/pick4u-delivery-app.git
cd pick4u-delivery-app
```

2. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Firebase and Google Maps credentials:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. **Start development server:**
```bash
pnpm run dev
# or
npm run dev
```

## 🔥 Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project: "Pick4U"
   - Enable Google Analytics (optional)

2. **Enable Services:**
   - **Authentication** → Phone sign-in method
   - **Firestore Database** → Create in test mode
   - **Storage** → Create default bucket
   - **Cloud Messaging** → Generate VAPID key

3. **Get Configuration:**
   - Project Settings → General → Your apps
   - Add web app: "Pick4U Web"
   - Copy `firebaseConfig` to `src/config/firebase.ts`

## 📱 iOS App Deployment

### App Icons Ready
- 14 PNG icons in `public/icons/` (20x20 to 1024x1024)
- Optimized for all iOS devices and App Store

### TestFlight Steps
1. Create Xcode project with WKWebView
2. Add app icons from `public/icons/`
3. Configure Bundle ID and signing
4. Archive and upload to App Store Connect
5. Submit for TestFlight review

## 🏗️ Build & Deploy

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint
```

## 📊 Project Stats

- **Build Size:** 479KB JS, 74KB CSS
- **Dependencies:** 179 packages
- **Components:** 6 main + 40+ UI components
- **Services:** 6 Firebase services
- **Hooks:** 3 custom React hooks
- **Icons:** 14 iOS app icons
- **Languages:** Hebrew RTL + English

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Android app icons and deployment
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration (Stripe/PayPal)
- [ ] Advanced rating system
- [ ] Route optimization for collectors

---

**Built with ❤️ for the Israeli community**

*Ready for TestFlight deployment and production use!*