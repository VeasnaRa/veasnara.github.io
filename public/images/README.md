# Profile Images

Place your profile picture here.

## How to add your profile picture:

1. **Add your image** to this folder (`public/images/`)
   - Recommended: name it `profile.jpg` or `profile.png`
   - Supported formats: JPG, PNG, WebP, etc.
   - Recommended size: 400x400 pixels or larger (square)

2. **Update site.config.js**:
   ```javascript
   profileImage: "/images/profile.jpg"
   ```

3. **Example**:
   - If your file is `public/images/profile.jpg`
   - Set: `profileImage: "/images/profile.jpg"`

   - If your file is `public/images/avatar.png`
   - Set: `profileImage: "/images/avatar.png"`

4. **Remove the profile image** (show initial letter instead):
   ```javascript
   profileImage: null
   ```

## Tips:
- Use a square image for best results
- Keep file size under 500KB for faster loading
- Use descriptive filenames (e.g., `john-doe-profile.jpg`)
