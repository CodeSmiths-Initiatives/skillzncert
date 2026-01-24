# Strapi Enrollment Collection Type Updates

## Required Field Changes in Strapi Content-Type Builder

You need to update the `enrollment` collection type in Strapi with the following changes:

### 1. Remove Field
- ❌ **Remove**: `currentEducationLevel` (Text field)

### 2. Add New Fields

#### yearOfStudy
- **Type**: Text (Short text)
- **Required**: No
- **Description**: 4-digit year (e.g., 2024)

#### netacadId  
- **Type**: Text (Short text)
- **Required**: No
- **Description**: NetAcad email or ID for students who have an account

#### preferredNetwork
- **Type**: Enumeration
- **Required**: Yes
- **Values**:
  - Mtn
  - Glo
  - Airtel
  - mobile9
- **Description**: Preferred network provider for free data

#### numberForData
- **Type**: Text (Short text)
- **Required**: Yes
- **Description**: 10-digit phone number for receiving free data
- **Validation**: Should be exactly 10 digits

## Summary of All Enrollment Fields

After updates, your Strapi enrollment collection should have:

### Personal Information
- firstName (Text, Required)
- lastName (Text, Required)
- phoneNumber (Text, Required) - 10 digits
- address (Text, Required)
- state (Text)
- country (Text)

### Academic Information
- preferredLanguage (Text)
- yearOfStudy (Text) - 4 digits
- previousCertification (Text)
- universityAttending (Text)

### NetAcad Information
- hasNetacadAccount (Boolean, default: false)
- netacadId (Text) - Email or ID

### Data Plan Information
- preferredNetwork (Enumeration, Required) - Mtn, Glo, Airtel, mobile9
- numberForData (Text, Required) - 10 digits

### Documents
- passport (Media, single, Required)
- schoolIdCard (Media, single, Required)

### System Fields
- isPaymentDone (Boolean, default: false)
- user (Relation to User)

## Steps to Update in Strapi

1. Log into your Strapi admin panel
2. Go to **Content-Type Builder**
3. Select **enrollment** collection type
4. Click **Edit**
5. Remove `currentEducationLevel` field
6. Add new fields:
   - yearOfStudy (Text)
   - netacadId (Text)
   - preferredNetwork (Enumeration with values: Mtn, Glo, Airtel, mobile9)
   - numberForData (Text)
7. Click **Save** and wait for server restart
8. Ensure the API permissions are correct for these new fields

## Updated Frontend Validations

The onboarding form now includes:
- ✅ Phone number validation (10 digits) for both `phoneNumber` and `numberForData`
- ✅ Year validation (4 digits, between 1900-2100) for `yearOfStudy`
- ✅ Required field validation for `preferredNetwork` and `numberForData`
- ✅ Success and error toast notifications
- ✅ Real-time field validation as user types
