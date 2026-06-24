# Prospektus Backend API Documentation

Base URL: `http://localhost:3000/api`

All protected routes require an `Authorization` header with a valid `Bearer <accessToken>`.

---

## 🔐 Authentication API

### 1. Sign Up
Creates a new user account, along with a default personal workspace and a free subscription plan.

* **URL:** `/auth/signup`
* **Method:** `POST`
* **Auth required:** No
* **Request Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
* **Success Response:**
  * **Code:** `201 Created`
  * **Cookies Set:** `refreshToken` (HttpOnly, Secure, SameSite=Lax, 7-day expiry)
  * **Content:**
    ```json
    {
      "accessToken": "eyJhbG...",
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com",
        "image": null,
        "workspace": [ { "id": "...", "name": "Personal Workspace", "type": "PERSONAL" } ],
        "subscription": [ { "id": "...", "plan": "FREE" } ]
      }
    }
    ```
* **Error Responses:**
  * `400 Bad Request`: "Email and password are required"
  * `409 Conflict`: "User with this email already exists"

### 2. Sign In
Authenticates a user and returns their profile with session tokens.

* **URL:** `/auth/signin`
* **Method:** `POST`
* **Auth required:** No
* **Request Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
* **Success Response:**
  * **Code:** `200 OK`
  * **Cookies Set:** `refreshToken` (HttpOnly, Secure, SameSite=Lax, 7-day expiry)
  * **Content:**
    ```json
    {
      "accessToken": "eyJhbG...",
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com",
        "image": null,
        "workspace": [ ... ],
        "subscription": [ ... ]
      }
    }
    ```
* **Error Responses:**
  * `400 Bad Request`: "This account uses Google sign-in" (if no password set)
  * `401 Unauthorized`: "Invalid credentials"
  * `404 Not Found`: "User not found"

### 3. Refresh Token
Silently renews the short-lived access token using a valid refresh token cookie.

* **URL:** `/auth/refresh`
* **Method:** `POST`
* **Auth required:** No (relies on `refreshToken` cookie)
* **Request Cookies:** `refreshToken`
* **Success Response:**
  * **Code:** `200 OK`
  * **Cookies Set:** New `refreshToken` (Replaces old token for rotation)
  * **Content:**
    ```json
    {
      "accessToken": "new-eyJhbG..."
    }
    ```
* **Error Responses:**
  * `401 Unauthorized`: "Refresh token is required" or "Invalid or expired refresh token"

### 4. Logout
Revokes the refresh token and clears the session cookies.

* **URL:** `/auth/logout`
* **Method:** `POST`
* **Auth required:** No (but typically called while logged in)
* **Request Cookies:** `refreshToken`
* **Success Response:**
  * **Code:** `200 OK`
  * **Cookies Cleared:** `refreshToken`
  * **Content:**
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

---

## 👤 User API

### 5. Get Current User Profile
Fetches the full profile data for the authenticated user, including workspaces, members, subscriptions, and notifications.

* **URL:** `/users/me`
* **Method:** `GET`
* **Auth required:** Yes (`Bearer <accessToken>`)
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:**
    ```json
    {
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com",
        "image": null,
        "trial": false,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "studio": null,
        "workspace": [
          {
            "id": "workspace-uuid",
            "name": "Personal Workspace",
            "type": "PERSONAL",
            "folders": [],
            "members": []
          }
        ],
        "subscription": [
          { "id": "sub-uuid", "plan": "FREE" }
        ],
        "notification": []
      }
    }
    ```
* **Error Responses:**
  * `401 Unauthorized`: Missing, invalid, or expired access token.
  * `404 Not Found`: "User not found"

### 6. Update Current User
Updates basic profile details (name, image) of the authenticated user.

* **URL:** `/users/me`
* **Method:** `PATCH`
* **Auth required:** Yes (`Bearer <accessToken>`)
* **Request Body (JSON):** *(all fields optional)*
  ```json
  {
    "name": "Johnny Doe",
    "image": "https://example.com/avatar.png"
  }
  ```
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:**
    ```json
    {
      "user": {
        "id": "uuid-string",
        "name": "Johnny Doe",
        "email": "john@example.com",
        "image": "https://example.com/avatar.png"
      }
    }
    ```

### 7. Get Media Settings
Fetches the user's saved recording preferences (screen, mic, camera devices, and quality preset). Used primarily by the Electron desktop app.

* **URL:** `/users/me/settings`
* **Method:** `GET`
* **Auth required:** Yes (`Bearer <accessToken>`)
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:**
    ```json
    {
      "settings": {
        "id": "media-uuid",
        "userId": "uuid-string",
        "screen": "screen-device-id",
        "mic": "mic-device-id",
        "camera": "camera-device-id",
        "preset": "HD"
      }
    }
    ```
    *(Note: `settings` may be `null` if the user hasn't set preferences yet).*

### 8. Update Media Settings
Upserts the user's media recording preferences.

* **URL:** `/users/me/settings`
* **Method:** `PATCH`
* **Auth required:** Yes (`Bearer <accessToken>`)
* **Request Body (JSON):** *(all fields optional)*
  ```json
  {
    "screen": "display-1",
    "mic": "default-mic",
    "camera": "webcam-1",
    "preset": "HD"
  }
  ```
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:**
    ```json
    {
      "settings": {
        "id": "media-uuid",
        "userId": "uuid-string",
        "screen": "display-1",
        "mic": "default-mic",
        "camera": "webcam-1",
        "preset": "HD"
      }
    }
    ```
