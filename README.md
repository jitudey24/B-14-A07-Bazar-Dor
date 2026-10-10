# 🛒 বাজার দর (Bazar Dor)

### বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে

বাজার দর একটি responsive web application, যেখানে ব্যবহারকারীরা বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান দাম, দৈনিক মূল্য পরিবর্তন এবং বিভিন্ন বাজারের দাম দেখতে পারবেন। ব্যবহারকারীরা পণ্যের তালিকা ও ক্যাটাগরি ব্রাউজ করতে পারবেন এবং লগইন করে প্রতিটি পণ্যের বিস্তারিত মূল্য ও বাজারভিত্তিক তথ্য দেখতে পারবেন।

---

## ✨ Features

- **Responsive Design:** Mobile, tablet এবং desktop—সব ধরনের screen size-এর জন্য উপযোগী UI।
- **Interactive Navbar:** Logo, বাংলা তারিখ, category navigation এবং authentication buttons।
- **Live Price Ticker:** পণ্যের নাম, emoji, দাম এবং মূল্য পরিবর্তনের percentage-সহ scrolling price ticker।
- **Hero Banner:** আকর্ষণীয় hero section এবং সব পণ্যের তালিকায় যাওয়ার CTA button।
- **Price Movers:** আজকের দাম বেড়েছে এমন Top 6 পণ্য এবং দাম কমেছে এমন Top 6 পণ্যের তালিকা।
- **All Products:** সব পণ্যকে responsive grid layout-এ দেখানো।
- **Product Details:** প্রতিটি পণ্যের minimum, maximum, average price এবং বিভিন্ন বাজারের দাম দেখানো।
- **Category Pages:** ক্যাটাগরি অনুযায়ী পণ্য দেখা এবং দাম অনুসারে sorting করা।
- **Smart Price Sorting:** ডিফল্ট, কম থেকে বেশি এবং বেশি থেকে কম দামে পণ্য সাজানো।
- **Better Auth Authentication:** Email/password দিয়ে Sign Up ও Sign In এবং Google/GitHub social login।
- **Protected Routes:** লগইন ছাড়া product details page-এ প্রবেশ সীমাবদ্ধ রাখা।
- **User Profile:** লগইন করা ব্যবহারকারীর profile দেখা এবং নাম update করার সুবিধা।
- **Toast Notifications:** Login, signup, logout এবং validation error-এর জন্য notification।
- **Loading Skeletons:** Home ও category page-এ data loading-এর সময় skeleton UI।
- **Custom 404 Page:** ভুল route বা অনুপস্থিত পণ্যের জন্য friendly error page এবং Home Page-এ ফেরার link।

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Application development and routing |
| React.js | Building reusable UI components |
| TypeScript | Type safety and maintainable code |
| Tailwind CSS | Responsive styling |
| HeroUI | UI components |
| Better Auth | Authentication and user sessions |
| MongoDB | Database for authentication and user data |
| React Hot Toast | Success and error notifications |
| REST API / JSON | Fetching product, category and price data |
| Git & GitHub | Version control and project hosting |
| Vercel | Application deployment |

---

## 📂 Main Application Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero banner, price movers and all products |
| `/category/[categorySlug]` | Category-wise products with sorting |
| `/product/[slug]` | Protected product details and market prices |
| `/signin` | User login page |
| `/signup` | User registration page |
| `/profile` | User profile information |
| `/profile/update` | Update user name |
| `/not-found` | Custom 404 page |

---

## 🔐 Authentication

Bazar Dor uses Better Auth to manage user authentication.

- Register with name, email and password.
- Sign in using email and password.
- Google and GitHub social authentication.
- Display profile information after successful login.
- Sign out securely.
- Protect product detail pages from unauthenticated access.
- Display toast notifications for authentication success and errors.
- Update the user's name through the profile update feature.

> Social login requires valid provider credentials and environment variables.

---

## 📱 Responsive Design

The application is designed to work across different devices.

- Mobile-friendly navigation and price ticker.
- Responsive product card grids.
- Hero section that stacks on smaller screens.
- Readable typography and accessible interactive controls.
- Consistent spacing and layouts across mobile, tablet and desktop.

---

## ⚖️ Product Price Information

Each product card displays:

- Product emoji or illustration.
- Bengali product name.
- Unit, such as প্রতি কেজি, প্রতি লিটার or প্রতি ডজন.
- Today's price using Bengali numerals.
- Daily price change with an appropriate indicator.

The product details page includes minimum, maximum and average prices, along with market-specific price information.

**Note:** Prices are indicative and may vary depending on market conditions.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- MongoDB connection
- Required API access and social login credentials

### 1. Clone the Repository

```bash
git clone https://github.com/jitudey24/B-14-A07-Bazar-Dor.git
```

### 2. Navigate to the Project

```bash
cd B-14-A07-Bazar-Dor
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the variables required by your application.

```env
MONGODB_URL=your_mongodb_connection_string

BETTER_AUTH_SECRET=your_secure_random_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Add any additional environment variables required by your product API or application configuration.

**Important:** Use the exact environment variable names referenced in your project code. Never commit `.env.local` or expose database credentials, authentication secrets or provider secrets in a public repository.

### 5. Run the Development Server

```bash
npm run dev
```

Open [b-14-a-7-bazar-dor.vercel.app] in your browser.

### 6. Build for Production

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

---

## 🌐 Deployment

The application can be deployed on Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables in Vercel project settings.
4. Configure the Google and GitHub OAuth callback URLs for the deployed domain.
5. Deploy the application.
6. Test the homepage, authentication, product details, category sorting and profile update.
7. Verify that refreshing dynamic routes works correctly after deployment.

---

## 📋 Assignment Highlights

This project is developed to meet the Bazar Dor assignment requirements, including:

- Responsive user interface.
- Product and category navigation.
- Price change indicators and price sorting.
- Better Auth with email/password and social login.
- Protected product details.
- Loading skeletons and toast notifications.
- Custom 404 handling.
- User profile update functionality.
- Git version control and project documentation.

---

## 🧑‍💻 Developer

**Jitu Dey**

- GitHub: [@jitudey24](https://github.com/jitudey24)
- Project Repository: [B-14-A07-Bazar-Dor](https://github.com/jitudey24/B-14-A07-Bazar-Dor)

---

## 📄 License

This project was created for educational purposes as part of a web development assignment.
