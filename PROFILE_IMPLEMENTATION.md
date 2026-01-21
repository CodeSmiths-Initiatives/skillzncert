# Profile Page Implementation - Architecture & Documentation

## 🎯 Overview
A modern, scalable, and performant profile management system for the user dashboard. Built with React Server Components, Next.js 14+ App Router, and following industry best practices.

## 🏗️ Architecture

### Layer Separation (Clean Architecture)
```
┌─────────────────────────────────────────┐
│   Presentation Layer (UI Components)    │
│   - ProfileView.tsx                     │
│   - ProfileComponents.tsx               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Application Layer (Actions)           │
│   - get-enrollment.actions.ts           │
│   - update-enrollment.actions.ts        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Domain/Service Layer                  │
│   - enrollment.service.ts               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Infrastructure Layer (API/Strapi)     │
└─────────────────────────────────────────┘
```

## 📁 File Structure

```
app/
└── dashboard/
    └── profile/
        ├── page.tsx                    # Server Component (Entry Point)
        └── ProfileViewWrapper.tsx      # Client Component (State Management)

features/
└── dashboard/
    └── ProfileView.tsx                 # Main profile UI with edit mode

components/
└── profile/
    └── ProfileComponents.tsx           # Reusable profile components

actions/
└── enrollment/
    ├── get-enrollment.actions.ts       # Fetch enrollment data
    └── update-enrollment.actions.ts    # Update enrollment data

lib/
└── services/
    └── enrollment.service.ts           # Business logic & API calls
```

## 🔑 Key Features

### 1. **View/Edit Mode Toggle**
- Clean separation between view and edit states
- Smooth transitions with visual feedback
- Cancel functionality that restores original data

### 2. **Optimistic UI Updates**
- Immediate feedback on user actions
- Server-side validation and revalidation
- Toast notifications for success/error states

### 3. **Image Upload Management**
- Preview current images
- Upload new images while keeping old ones
- File size and type validation

### 4. **Form State Management**
- Controlled components with React state
- Real-time validation
- Efficient re-renders using useTransition

### 5. **Responsive Design**
- Mobile-first approach
- Adaptive grid layouts (1 column on mobile, 2 on desktop)
- Touch-friendly UI elements

## 🎨 Design System

### Color Palette
- Primary: `#51A8B1` (Teal Blue)
- Primary Dark: `#3b8f97`
- White: `#FFFFFF`
- Gray Scale: 50, 100, 200, 500, 700, 900
- Success: Green 50-900
- Error: Red 50-900

### Component Hierarchy
```
ProfileView (Main Container)
├── Header with Edit/Save/Cancel buttons
├── Payment Status Badge (conditional)
├── ProfileSection (Personal Info)
│   └── TwoColumnGrid
│       └── ProfileField × 4
├── ProfileSection (Address)
│   └── ProfileField × 3
├── ProfileSection (Academic)
│   └── TwoColumnGrid
│       └── ProfileField × 4
├── ProfileSection (Documents)
│   └── TwoColumnGrid
│       └── ProfileImageUpload × 2
└── Metadata Footer
```

## ⚡ Performance Optimizations

### 1. **Server Components by Default**
- Initial page load uses RSC (React Server Components)
- Reduced JavaScript bundle size
- Faster initial render

### 2. **Selective Client Components**
- Only interactive parts use "use client"
- ProfileViewWrapper handles client-side updates
- ProfileView manages edit state

### 3. **Progressive Enhancement**
- Works without JavaScript (initial view)
- Enhanced with JS for interactivity
- Server Actions for form submission

### 4. **Data Fetching Strategy**
```typescript
// Server Component - No client-side data fetching needed
export default async function ProfilePage() {
  const result = await getEnrollmentAction();
  // Data is pre-fetched on server
  return <ProfileViewWrapper enrollment={result.data} />
}
```

### 5. **Cache Management**
- `cache: "no-store"` for fresh data
- `revalidatePath()` after updates
- Automatic ISR (Incremental Static Regeneration)

## 🔒 Security Measures

### 1. **Server-Side Authentication**
```typescript
export async function getEnrollmentAction() {
  const { user, token } = await getAuthUser();
  if (!user || !token) {
    return { success: false, message: "Unauthorized" };
  }
  // Proceed with authorized request
}
```

### 2. **Token-Based API Calls**
- All API calls include Bearer token
- Server-side validation
- No token exposure to client

### 3. **Input Validation**
- Type-safe with TypeScript interfaces
- Server-side validation in Strapi
- Client-side validation for UX

### 4. **File Upload Security**
- File type restrictions (JPG/PNG only)
- Size limitations (max 50KB)
- Server-side processing

## 🔄 Data Flow

### Fetch Flow
```
User navigates to /dashboard/profile
         ↓
Server Component (page.tsx) calls getEnrollmentAction()
         ↓
Action validates auth and calls getEnrollmentData()
         ↓
Service makes API call to Strapi with populate=*
         ↓
Data transforms to typed EnrollmentData interface
         ↓
Returns to page.tsx → renders ProfileViewWrapper
         ↓
Client component receives enrollment data as props
```

### Update Flow
```
User clicks Edit → modifies fields → clicks Save
         ↓
ProfileView calls updateEnrollmentAction()
         ↓
useTransition shows "Saving..." state
         ↓
Action validates auth and calls updateEnrollmentData()
         ↓
Service sends FormData to Strapi API
         ↓
revalidatePath() triggers re-fetch
         ↓
router.refresh() updates UI
         ↓
Toast notification shows success/error
```

## 🧩 Reusable Components

### ProfileSection
**Purpose:** Container for grouped profile fields  
**Props:** `title`, `icon`, `children`, `className`  
**Usage:**
```tsx
<ProfileSection title="Personal Info" icon={<FiUser />}>
  {/* fields */}
</ProfileSection>
```

### ProfileField
**Purpose:** Individual field with view/edit modes  
**Props:** `label`, `value`, `isEditing`, `name`, `onChange`, `type`, `options`  
**Usage:**
```tsx
<ProfileField
  label="First Name"
  value={formData.firstName}
  isEditing={isEditing}
  name="firstName"
  onChange={handleChange}
/>
```

### ProfileImageUpload
**Purpose:** Image preview and upload  
**Props:** `label`, `currentImage`, `onSelect`, `isEditing`  
**Usage:**
```tsx
<ProfileImageUpload
  label="Passport"
  currentImage={enrollment.passport}
  onSelect={setPassport}
  isEditing={isEditing}
/>
```

### TwoColumnGrid
**Purpose:** Responsive grid layout  
**Usage:**
```tsx
<TwoColumnGrid>
  <ProfileField {...} />
  <ProfileField {...} />
</TwoColumnGrid>
```

## 🚀 Scalability Considerations

### 1. **Extensibility**
- Add new fields by extending EnrollmentData interface
- New ProfileField components automatically inherit styling
- Easy to add new sections

### 2. **Type Safety**
```typescript
export interface EnrollmentData {
  // Strongly typed - catches errors at compile time
  firstName: string;
  // ... all fields typed
}
```

### 3. **Separation of Concerns**
- UI components don't know about API
- Services don't know about UI
- Actions bridge the gap

### 4. **Testing Strategy**
- Unit tests for components
- Integration tests for actions
- E2E tests for user flows

### 5. **Future Enhancements**
- Easy to add field-level permissions
- Can implement versioning
- Ready for internationalization (i18n)
- Can add real-time updates with WebSockets

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Default: 1 column
md: (768px+) 2 columns
lg: (1024px+) Enhanced spacing
```

## 🛠️ Developer Guide

### Adding a New Field

1. **Update Interface** (enrollment.service.ts)
```typescript
export interface EnrollmentData {
  // ... existing fields
  newField: string; // Add here
}
```

2. **Update Service** (enrollment.service.ts)
```typescript
return {
  // ... existing mappings
  newField: enrollment.newField || "",
};
```

3. **Add to Form State** (ProfileView.tsx)
```typescript
const [formData, setFormData] = useState({
  // ... existing fields
  newField: enrollment.newField,
});
```

4. **Add UI Field** (ProfileView.tsx)
```tsx
<ProfileField
  label="New Field"
  value={formData.newField}
  isEditing={isEditing}
  name="newField"
  onChange={handleChange}
/>
```

### Adding a New Section

```tsx
<ProfileSection title="New Section" icon={<FiIcon />}>
  <TwoColumnGrid>
    <ProfileField {...} />
    <ProfileField {...} />
  </TwoColumnGrid>
</ProfileSection>
```

## 🎯 Best Practices Implemented

1. ✅ **Server Components First** - Reduce client bundle
2. ✅ **Progressive Enhancement** - Works without JS
3. ✅ **Type Safety** - TypeScript everywhere
4. ✅ **Error Boundaries** - Graceful error handling
5. ✅ **Loading States** - useTransition for smooth UX
6. ✅ **Accessibility** - Semantic HTML, labels, ARIA
7. ✅ **SEO Ready** - Server-rendered content
8. ✅ **Code Splitting** - Automatic with Next.js
9. ✅ **Clean Code** - SOLID principles
10. ✅ **DRY Principle** - Reusable components

## 🔍 Monitoring & Debugging

### Useful Debug Points
```typescript
// In ProfileView.tsx
console.log("Current form state:", formData);
console.log("Is editing:", isEditing);

// In actions
console.log("Fetching for user:", user.id);
console.log("Update result:", result);
```

### Error Tracking
- All errors return structured responses
- Toast notifications for user feedback
- Server logs for backend issues

## 📊 Performance Metrics

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

**Optimization Techniques:**
- Image optimization with Next.js Image
- Code splitting per route
- Minimal client-side JavaScript
- Efficient re-renders with useTransition

## 🎓 Key Learnings

1. **RSC Pattern** - Server Components reduce client bundle dramatically
2. **Server Actions** - Eliminate need for API routes
3. **Form Handling** - FormData works seamlessly with multipart uploads
4. **State Management** - Local state sufficient for isolated features
5. **Type Safety** - Interfaces prevent runtime errors

---

## 🚦 Usage

Navigate to `/dashboard/profile` to view your profile.

**View Mode:**
- See all your enrollment data
- Check payment status
- View uploaded documents

**Edit Mode:**
- Click "Edit Profile"
- Modify any field
- Upload new documents
- Save or cancel changes

---

Built with ❤️ using Next.js 14+, React 18+, TypeScript, and Tailwind CSS
