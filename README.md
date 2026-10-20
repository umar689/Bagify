# Bagify

Bagify is a server-rendered online storefront for bags. Shoppers can create an account, browse a product catalogue, manage a cart, and edit their profile. A store owner can sign in to a separate admin area to create and delete products.

The repository contains the core storefront and catalogue-management flows. It does not currently implement checkout, payment processing, or order creation.

## Features

### Shopper

- Register and sign in with an email address and password.
- Browse all products, recently added products, or discounted products.
- Sort supported product lists by newest.
- Add products to a cart, adjust quantities, and remove cart entries.
- View cart totals and edit profile details or upload a profile picture.
- Sign out.

### Store owner

- Sign in to the owner area.
- View the product catalogue.
- Create products with an image, price, discount, and display colors.
- Delete one product or delete the entire catalogue.
- In development mode, use routes for initial owner creation and sample product seeding.

## Technology

| Area | Technology | Use |
| --- | --- | --- |
| Runtime | Node.js | Runs the server-side JavaScript application. |
| Web framework | Express 5 | HTTP server, middleware, and route handling. |
| Templates | EJS | Renders pages on the server using data from route handlers. |
| Database | MongoDB | Persists users, owners, and products. |
| Database ODM | Mongoose | Defines schemas, validates model shapes, and queries MongoDB. |
| Input validation | Joi | Defines validation rules for user, owner, and product data. |
| Password security | bcrypt | Hashes passwords and verifies login attempts. |
| Authentication | `jsonwebtoken` | Creates and verifies shopper and owner JWTs. |
| Cookies and sessions | `cookie-parser`, `express-session`, `connect-flash` | Reads authentication cookies and supports session-backed flash messages. |
| Image uploads | Multer | Accepts profile and product images in memory. |
| Frontend styling | Tailwind CSS (CDN) and custom CSS | Provides utility styling and Bagify's visual theme. |
| Frontend behavior | Vanilla JavaScript | Adds interface interactions and motion behavior. |
| Animation | GSAP and ScrollTrigger (CDN) | Adds entrance, scroll-reveal, floating, and parallax effects. |
| Icons and font | Remix Icon (CDN), Google Fonts | Provides interface icons and the Manrope typeface. |
| Configuration and diagnostics | `dotenv`, `config`, `debug` | Supports environment/configuration loading and debug logging. |
| Development utility | `nodemon` | Available as a dependency for restarting the app during development. |

There is no frontend framework such as React or Vue. The browser receives HTML rendered by EJS, along with static CSS and JavaScript.

## Architecture

```text
app.js
├── config/                 Database connection and Multer configuration
├── routes/                 HTTP routes for shoppers, owners, and products
├── controllers/            Shopper authentication handlers
├── middlewares/            Shopper and owner JWT checks
├── models/                 Mongoose schemas and Joi validators
├── utils/                  Token and password helpers
├── scripts/                Sample product seeding
├── views/                  EJS pages and shared partials
└── public/                 Static images, CSS, and browser JavaScript
```

`app.js` configures Express, static file serving, JSON and form parsing, cookies, sessions, flash messages, and the EJS view engine. It mounts the route modules and starts listening on `PORT`, defaulting to `8000`.

Most storefront routes—including the shop, cart, and account pages—are in `routes/indexRouter.js`. Shopper registration and login are routed through `routes/userRoute.js` to `controllers/authController.js`. Owner administration is implemented in `routes/ownerRouter.js`.

## Data model

- **User** (`models/user-model.js`): username, email, password hash, contact number, profile picture, cart entries, and order references. Each cart entry references a product and includes a quantity.
- **Product** (`models/product-model.js`): name, price, discount, image bytes and MIME type, display colors, stock, and description.
- **Owner** (`models/owner-model.js`): username, email, password hash, optional GSTIN and picture, and product references.

Schemas are defined with Mongoose. Joi validation functions are also defined in the model modules and used by relevant routes/controllers. Uploaded images are held in MongoDB as binary data with a content type and are rendered as data URLs in the EJS templates.

## Main routes

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/` | Shopper registration and login page | Public |
| `POST` | `/users/register` | Register a shopper | Public |
| `POST` | `/users/login` | Sign in a shopper | Public |
| `GET` | `/users/logout` | Sign out a shopper | Public |
| `GET` | `/shop` | Browse all products; supports `?sortby=newest` | Shopper |
| `GET` | `/shop/new` | Browse products created in the last four days | Shopper |
| `GET` | `/shop/discounted` | Browse products with a discount | Shopper |
| `GET` | `/cart/:pid` | Add a product to the cart | Shopper |
| `GET` | `/cart` | View the cart | Shopper |
| `POST` | `/cart/delete/:pid` | Remove a cart entry | Shopper |
| `POST` | `/cart/incbyone/:pid` | Increase a cart quantity | Shopper |
| `POST` | `/cart/decbyone/:pid` | Decrease a cart quantity | Shopper |
| `GET` | `/account` | View the shopper account | Shopper |
| `GET`, `POST` | `/account/edit` | Display or save profile details | Shopper |
| `POST` | `/upload` | Upload a profile picture | Shopper |
| `GET`, `POST` | `/owners/login` | Display owner login or authenticate | Public |
| `GET` | `/owners/admin` | View products in the owner console | Owner |
| `GET`, `POST` | `/owners/product/create` | Display the product form or create a product | Owner |
| `GET` | `/owners/product/deleteone/:pid` | Delete one product | Owner |
| `GET` | `/owners/product/deleteall` | Delete all products | Owner |

The shopper and owner route guards are in `middlewares/isLoggedIn.js` and `middlewares/isOwnerLoggedIn.js`. Shopper and owner tokens use separate JWT secrets, but both flows currently use a cookie named `token`.

## Local setup

### Prerequisites

- Node.js and npm.
- A MongoDB instance.
- Configuration values for the database connection, JWT signing, and sessions.

### Install dependencies

```sh
npm install
```

### Configure and start

The application needs:

- `MONGO_URI` as a value available to the `config` package; the database connection calls `config.get("MONGO_URI")`.
- `JWT_SECRET` for shopper tokens.
- `JWT_SECRET_OWNER` for owner tokens.
- `SESSION_SECRET` for Express sessions.
- Optionally, `PORT` (defaults to `8000`) and `NODE_ENV`.

No node-config JSON file is included in the repository. Supply `MONGO_URI` through a node-config-supported configuration source (for example, the `NODE_CONFIG` environment variable or an external config file). Set the JWT and session secrets in the process environment. The app imports the database connection before `userRoute.js` calls `dotenv.config()`, so do not rely on that later call to load database configuration before connecting; provide configuration before starting the process.

Then start the server with:

```sh
node app.js
```

The application listens on `http://localhost:8000` unless `PORT` is set. `package.json` does not currently define `start` or development scripts.

### Dependency note

Joi is imported by the model modules but is not currently listed in `package.json`. A clean dependency installation may therefore require adding the `joi` package before the application can start successfully.

## Sample products

`scripts/seedproducts.js` reads the sample PNGs in `public/images/` and inserts the corresponding product records into MongoDB. The owner router exposes the seed endpoint only when `NODE_ENV` is `development`:

```text
GET /owners/addDummyProducts
```

The development-only owner creation endpoint is `POST /owners/create`. These routes are intended for initial setup rather than normal public account flows.

## Current limitations

- Checkout, payment, and order creation are not implemented. The cart’s checkout button is currently UI only.
- The user schema has an `orders` field, but there is no order model or order-processing flow in the implemented routes.
- Product stock is stored, but cart operations do not enforce stock limits.
- Product administration supports creation and deletion, but not editing.
- `routes/productRouter.js` and `routes/hourseRouter.js` are currently placeholders; the primary shopping routes live in `routes/indexRouter.js`.
- The `test` script in `package.json` is a placeholder and does not run a test suite.
- The project includes no automated test suite or documented production deployment configuration.
