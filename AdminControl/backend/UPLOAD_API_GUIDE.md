# Image Upload API Guide

## Problem
The 413 Content Too Large error occurs when sending large base64-encoded images directly in blog POST/PUT requests. Vercel's serverless functions have a 4.5MB payload limit.

## Solution
Upload images separately using the `/api/upload/image` endpoint, then send only the Cloudinary URL object to the blog endpoints.

## New Upload Endpoint

### POST /api/upload/image
Upload an image to Cloudinary before creating/updating a blog.

**Request:**
```javascript
POST https://ease-and-bloom-backend.vercel.app/api/upload/image
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // base64 encoded image
  "folder": "easeandbloom/blogs"  // optional, defaults to "easeandbloom/blogs"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "image": {
      "url": "https://res.cloudinary.com/...",
      "publicId": "easeandbloom/blogs/xyz123",
      "width": 1920,
      "height": 1080
    }
  }
}
```

## Updated Blog Workflow

### Frontend Implementation Example

```javascript
// 1. Upload image first
const uploadImage = async (base64Image) => {
  const response = await axios.post('/api/upload/image', {
    image: base64Image,
    folder: 'easeandbloom/blogs'
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data.data.image; // Returns Cloudinary object
};

// 2. Create blog with uploaded image URL
const createBlog = async (blogData, featuredImageBase64) => {
  // Upload image first
  const uploadedImage = await uploadImage(featuredImageBase64);
  
  // Create blog with Cloudinary object
  const response = await axios.post('/api/blogs', {
    ...blogData,
    featuredImage: uploadedImage  // Use the Cloudinary object, not base64
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};
```

## Backward Compatibility

The blog endpoints still accept base64 images for small files (< 1MB), but will show a note in logs recommending the upload endpoint for larger images.

**Both formats are accepted:**

```javascript
// Option 1: Pre-uploaded Cloudinary object (RECOMMENDED)
{
  "featuredImage": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "easeandbloom/blogs/xyz123"
  }
}

// Option 2: Base64 string (for small images only)
{
  "featuredImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

## Benefits

1. **Avoids 413 errors** - Images are uploaded separately, keeping blog request payloads small
2. **Better error handling** - Image upload failures are caught before blog creation
3. **Progress tracking** - Can show upload progress for large images
4. **Reusable images** - Same image can be used in multiple blogs without re-uploading

## Migration Steps

1. Update frontend to use the new upload endpoint for featured images
2. Test with large images (> 2MB)
3. Deploy backend changes
4. Deploy frontend changes
5. Monitor logs for any issues
