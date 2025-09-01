# User Settings API Documentation

This document describes the new user settings endpoints that allow users to manage their profile, password, avatar, and circle membership.

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Change Password

**PUT** `/user/change-password`

Updates the user's password after verifying the current password.

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Validation Rules:**

- `currentPassword`: Required, minimum 6 characters
- `newPassword`: Required, minimum 6 characters

**Response:**

- **Success (200):**
  ```json
  {
    "message": "Password updated successfully"
  }
  ```
- **Error (400):** Current password is incorrect
- **Error (401):** Unauthorized or invalid token
- **Error (404):** User not found

---

### 2. Update Display Name

**PUT** `/user/update-display-name`

Updates the user's display name.

**Request Body:**

```json
{
  "displayName": "string"
}
```

**Validation Rules:**

- `displayName`: Required, minimum 2 characters, must be unique

**Response:**

- **Success (200):**
  ```json
  {
    "message": "Display name updated successfully",
    "user": {
      "id": "string",
      "displayName": "string",
      "email": "string",
      "avatar": "string",
      "updatedAt": "date"
    }
  }
  ```
- **Error (400):** Display name already taken
- **Error (401):** Unauthorized or invalid token
- **Error (404):** User not found

---

### 3. Update Email

**PUT** `/user/update-email`

Updates the user's email address.

**Request Body:**

```json
{
  "email": "string"
}
```

**Validation Rules:**

- `email`: Required, must be valid email format, must be unique

**Response:**

- **Success (200):**
  ```json
  {
    "message": "Email updated successfully",
    "user": {
      "id": "string",
      "displayName": "string",
      "email": "string",
      "avatar": "string",
      "updatedAt": "date"
    }
  }
  ```
- **Error (400):** Email already taken
- **Error (401):** Unauthorized or invalid token
- **Error (404):** User not found

---

### 4. Upload Avatar

**POST** `/user/upload-avatar`

Uploads and updates the user's profile picture. Automatically deletes the old avatar from Cloudinary.

**Request:**

- Content-Type: `multipart/form-data`
- Body: Form data with `avatar` field containing image file

**File Requirements:**

- File type: Image files only (JPEG, PNG, GIF, etc.)
- Maximum size: 5MB
- Field name: `avatar`

**Response:**

- **Success (200):**
  ```json
  {
    "message": "Avatar uploaded successfully",
    "avatar": "https://cloudinary-url.com/avatar.jpg"
  }
  ```
- **Error (400):** No image file provided, file too large, or invalid file type
- **Error (401):** Unauthorized or invalid token
- **Error (404):** User not found

**Notes:**

- Old avatar is automatically deleted from Cloudinary
- Image is optimized to 300x300 pixels with face detection
- Stored in Cloudinary 'avatars' folder

---

### 5. Leave Circle

**POST** `/user/leave-circle`

Allows a user to leave their current circle. If the user is the owner, ownership is transferred to the next member. If the circle becomes empty, it is automatically deleted.

**Request Body:**

```json
{
  "confirm": true
}
```

**Validation Rules:**

- `confirm`: Required, must be `true` to confirm leaving

**Response:**

- **Success (200):**
  ```json
  {
    "message": "You have successfully left the circle",
    "circleName": "string"
  }
  ```
  OR (if circle is deleted):
  ```json
  {
    "message": "You have left the circle. The circle has been deleted as it is now empty."
  }
  ```
- **Error (400):** Not a member of any circle or confirmation not provided
- **Error (401):** Unauthorized or invalid token

**Circle Ownership Transfer Logic:**

1. If the leaving user is the owner and other members exist:
   - Ownership transfers to the first remaining member
   - Circle continues to exist
2. If the leaving user is the owner and no other members exist:
   - Circle is automatically deleted
3. If the leaving user is not the owner:
   - User is simply removed from members
   - Circle continues to exist

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- **200**: Success
- **400**: Bad Request (validation errors, business logic errors)
- **401**: Unauthorized (invalid or missing token)
- **404**: Not Found (user not found)
- **500**: Internal Server Error

## File Upload Notes

- Files are temporarily stored in the `uploads/` directory
- After successful upload to Cloudinary, temporary files can be cleaned up
- The `uploads/` directory is excluded from version control
- Maximum file size is 5MB
- Only image files are accepted

## Security Considerations

- All endpoints require JWT authentication
- Password changes require current password verification
- File uploads are restricted to image types only
- File size limits prevent abuse
- Unique constraints prevent duplicate emails/display names
- Circle membership is validated before operations

## Testing

To test the endpoints:

1. **Change Password:**

   ```bash
   curl -X PUT http://localhost:4321/user/change-password \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"currentPassword":"oldpass","newPassword":"newpass"}'
   ```

2. **Update Display Name:**

   ```bash
   curl -X PUT http://localhost:4321/user/update-display-name \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"displayName":"NewName"}'
   ```

3. **Update Email:**

   ```bash
   curl -X PUT http://localhost:4321/user/update-email \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"email":"newemail@example.com"}'
   ```

4. **Upload Avatar:**

   ```bash
   curl -X POST http://localhost:4321/user/upload-avatar \
     -H "Authorization: Bearer <token>" \
     -F "avatar=@/path/to/image.jpg"
   ```

5. **Leave Circle:**
   ```bash
   curl -X POST http://localhost:4321/user/leave-circle \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"confirm":true}'
   ```
