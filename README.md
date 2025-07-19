<h1 align="center">
ScalpersParadise | 転売天国 (Tenbai Tengoku)
</h1>

# 🎟️ ScalpersParadise

<p align="center">
  <img src="https://github.com/user-attachments/assets/9b461ad0-8f90-4195-90e7-0dbe0ba417ee" alt="brave_1RjmkieLF3" width="70%" />
  <img src="https://github.com/user-attachments/assets/edb1ad19-87ee-4ac9-b38d-a21cf6782df7" alt="signal-2025-07-20-003424_002" width="16%" />
</p>



![ScalpersParadise Dashboard](https://via.placeholder.com/800x400?text=ScalpersParadise+Dashboard)

## _What??_ 何

ScalpersParadise is a sophisticated movie booking system designed to maximize user retention with positive reinforcement and gamification. People are being motivated to interact with other users with price benefits and awards

## _Why??_ 何で

One thing that has always bothered me is the disconnect among moviegoers. The "best" seat is often considered the one farthest from others, which feels counterintuitive — watching movies should be a shared experience. That’s why I created this project: a conceptual movie theater designed to bring people together and celebrate the communal aspect of cinema.

<p align="center">
  <img src="https://github.com/user-attachments/assets/2e00f972-70fb-428b-b172-31d9951ca12e" width="700" />
</p>

## ✨ _Standout Features_ 機能

- **Automated Adding and Sorting of New Movies**: New and Upcoming movies are added automatically and sorted based on popularity
- **Index Proximity Pricing**: The most profitable seats are the seats with the most people near to them
- **Realtime Updates** Realtime chats, movie alerts and booking updates can be optionally enabled to get realtime updates on movies
- **Gamified Positive Reinforcement**: Interaction with others is designed to give users a postive experience, making them more eager to book seats
- **Ticket Management**: Track your currently bought tickets and purchase history
- **Stripe Integration**: Enough said.
- **Activity Analytics**: Visualize your activity with dashboards so you can get discounts on new bookings based on your purchases
- **Heavy Usage of Style** All displayed in a beautiful Frontend with heavy use of 3D and custom animations
- **Built for SEO** With all of this in mind, I have made sure that the browsing experience stays snappy while browsing
- **so much more...**

![ScalpersParadise SEO](https://via.placeholder.com/800x400?text=SEOStats)

## 🚀 _Getting Started_ 準備

### Prerequisites

- Node.js 24.4.1+
- PostgreSQL 17+
- ASP.NET Core 8.0
- TMDB Registration

### Installation

This project is deployed and ready to be viewed from every web browser but in case you want to contribute here's the steps to install it locally

1. Clone the repository:
```bash
git clone https://github.com/IMIHonigmann/ScalpersParadise.git
cd ScalpersParadise
```

2. Install dependencies:
```bash
cd Frontend
npm install
cd ../BackendAPI
dotnet restore
```

3. Configure your environment:
```bash
touch ./Frontend/.env
touch ./BackendAPI/.env.local
# Edit ./BackendAPI/.env with your PostgreSQL connection string (DEFAULT_CONNECTION)
# Edit ./Frontend/.env.local with your TMDB API Keys (TMDB_RAT & TMDB_APIKEY)
```

4. Run migrations
```bash
dotnet ef database update
```

5. Populate the database with mock data
```sql
# placeholder
```

6. Start the application:
```bash
cd Frontend
npm run dev
# Open a second terminal
cd BackendAPI
dotnet run
```

## 🧰 Technologies Used

- **Frontend**: React.js, Next.js, D3.js, Three.js, GSAP, TailwindCSS, TypeScript
<img src="https://skillicons.dev/icons?i=react,nextjs,d3,threejs,tailwind,ts" />

- **Backend**: ASP.NET Core, Node.js
<img src="https://skillicons.dev/icons?i=dotnet,nodejs,postgres" />

- **Database**: PostgreSQL, EFCore
- **Authentication**: JWT, OAuth 2.0
- **APIs**: TMDB

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the style guidelines and includes appropriate tests.

## 📬 Contact

Have questions or suggestions? Reach out on:

- GitHub: [@IMIHonigmann](https://github.com/IMIHonigmann)
- Email: [homammousa15@gmail.com](mailto:homammousa15@gmail.com)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/IMIHonigmann">IMIHonigmann</a>
</p>
