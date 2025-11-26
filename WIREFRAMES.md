# RepX App - Wireframes Documentation

## Overview
This document contains wireframe descriptions for the newly created pages: **Routine Page** and **Friends & Groups Page**.

---

## 1. Routine Page (`/routine`)

### Purpose
Manage workout routines - create, view, and start workout plans.

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  [Profile] [Groups] [Friends]  RepX  [⚙️]  │ ← Top Toolbar (Red)
├─────────────────────────────────────────────┤
│                                             │
│         My Workout Routines                 │
│    Create and manage your workout plans     │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ➕ Create New Routine                │ │ ← Add Button (Red)
│  └───────────────────────────────────────┘ │
│                                             │
│  Active Routines                            │
│  ┌───────────────────────────────────────┐ │
│  │ Push Day              [Active Badge]   │ │
│  │ Chest, Shoulders, Triceps              │ │
│  │ 🏋️ 6 exercises  ⏱️ 60 min             │ │
│  │           [▶️ Start]  [✏️]             │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Pull Day              [Inactive]       │ │
│  │ Back, Biceps, Rear Delts               │ │
│  │ 🏋️ 7 exercises  ⏱️ 65 min             │ │
│  │           [▶️ Start]  [✏️]             │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Leg Day               [Inactive]       │ │
│  │ Quads, Hamstrings, Calves              │ │
│  │ 🏋️ 5 exercises  ⏱️ 55 min             │ │
│  │           [▶️ Start]  [✏️]             │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  This Week                                  │
│  ┌─────────┬─────────┬─────────┐          │
│  │ 📅      │ 🔥      │ 🏆      │          │
│  │   4     │  240    │  12     │          │
│  │Workouts │ Minutes │  PRs    │          │
│  └─────────┴─────────┴─────────┘          │
│                                             │
├─────────────────────────────────────────────┤
│  [Home]  [Phy]  [Work]  [Leader]           │ ← Bottom Nav (Red)
└─────────────────────────────────────────────┘
```

### Key Features
- **Header Section**: Page title and subtitle
- **Create Button**: Large red button to create new routines
- **Routine Cards**: Display workout routines with:
  - Routine name
  - Status badge (Active/Inactive)
  - Description (muscle groups)
  - Stats (exercise count, duration)
  - Action buttons (Start, Edit)
- **Quick Stats**: Weekly summary (workouts, minutes, PRs)

### Color Scheme
- Background: Black (#000) / Dark Gray (#111)
- Primary: Red (#B90009)
- Text: White (#fff) / Gray (#aaa)
- Accents: Red shadows and borders

---

## 2. Friends & Groups Page (`/friends`)

### Purpose
Manage social connections - view friends, friend requests, and workout groups. Uses a segmented control to switch between Friends and Groups views.

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  [Profile] [Groups] [Friends]  RepX  [⚙️]  │ ← Top Toolbar (Red)
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┬──────────────┐           │
│  │   Friends    │    Groups    │           │ ← Segment Toggle
│  └──────────────┴──────────────┘           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🔍 Search friends...                  │ │ ← Search Bar
│  └───────────────────────────────────────┘ │
│                                             │
│  My Friends (24)                            │
│  ┌───────────────────────────────────────┐ │
│  │ 👤 Alex Rodriguez                     │ │
│  │    @alexrod_fit                       │ │
│  │    [WARRIOR] 2,450 XP    [👤] [💬]   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 👤 Sarah Johnson                      │ │
│  │    @sarahj_gains                      │ │
│  │    [CONTENDER] 1,890 XP  [👤] [💬]   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 👤 Mike Chen                          │ │
│  │    @mikechen_lift                     │ │
│  │    [WARRIOR] 2,120 XP    [👤] [💬]   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Friend Requests (2)                        │
│  ┌───────────────────────────────────────┐ │
│  │ 👤 John Smith                         │ │
│  │    @johnsmith_gym                     │ │
│  │         [Accept] [Decline]            │ │
│  └───────────────────────────────────────┘ │
│                                             │
├─────────────────────────────────────────────┤
│  [Home]  [Phy]  [Work]  [Leader]           │ ← Bottom Nav (Red)
└─────────────────────────────────────────────┘
```

### Groups View (when "Groups" segment selected)

```
┌─────────────────────────────────────────────┐
│  [Profile] [Groups] [Friends]  RepX  [⚙️]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┬──────────────┐           │
│  │   Friends    │  ● Groups    │           │ ← Segment Toggle
│  └──────────────┴──────────────┘           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🔍 Search groups...                   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ➕ Create New Group                  │ │ ← Create Button
│  └───────────────────────────────────────┘ │
│                                             │
│  My Groups (5)                              │
│  ┌───────────────────────────────────────┐ │
│  │ 👥 Morning Grinders      [Active]     │ │
│  │    👥 12 members                       │ │
│  │    Early morning workout crew.         │ │
│  │    6 AM daily sessions!                │ │
│  │    🔥 156 workouts this week           │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 👥 Powerlifting Squad    [Active]     │ │
│  │    👥 8 members                        │ │
│  │    Focused on compound lifts and       │ │
│  │    strength training                   │ │
│  │    🔥 98 workouts this week            │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 👥 Cardio Warriors       [Inactive]   │ │
│  │    👥 15 members                       │ │
│  │    Running, cycling, and HIIT          │ │
│  │    enthusiasts                         │ │
│  │    🔥 45 workouts this week            │ │
│  └───────────────────────────────────────┘ │
│                                             │
├─────────────────────────────────────────────┤
│  [Home]  [Phy]  [Work]  [Leader]           │
└─────────────────────────────────────────────┘
```

### Key Features

#### Friends View
- **Segment Toggle**: Switch between Friends and Groups
- **Search Bar**: Find specific friends
- **Friends List**: Display friends with:
  - Profile picture
  - Name and username
  - Rank badge and XP
  - Action buttons (View Profile, Chat - note: chat is placeholder only)
- **Friend Requests**: Separate section showing pending requests with Accept/Decline buttons

#### Groups View
- **Create Group Button**: Large red button to create new groups
- **Groups List**: Display groups with:
  - Group icon
  - Group name and status
  - Member count
  - Description
  - Weekly activity stats

### Color Scheme
- Background: Black (#000) / Dark Gray (#111)
- Primary: Red (#B90009)
- Text: White (#fff) / Gray (#aaa)
- Borders: Red left border on cards
- Badges: Color-coded by rank/status

---

## Common Elements (Both Pages)

### Top Toolbar
- **Left Side**: Profile, Groups, Friends icons
- **Center**: "RepX" title
- **Right Side**: Settings icon
- **Background**: Red (#B90009)

### Bottom Navigation
- **4 Buttons**: Home, Phy, Work, Leader
- **Style**: Equal width, red background, white text
- **Height**: 45px

---

## Design Notes

1. **Consistency**: Both pages use the same toolbar structure as Home and Profile pages
2. **Color Palette**: Black/dark gray backgrounds with red (#B90009) accents
3. **Typography**: Bold headings, clear hierarchy
4. **Spacing**: Generous padding and margins for readability
5. **Cards**: Rounded corners (12px), subtle shadows with red tint
6. **Icons**: Ionic icons used throughout
7. **Responsive**: Mobile-first design, scales well on tablets

---

## Navigation Flow

```
Login → Home ⟷ Profile
         ↓
    Routine Page
         ↓
  Friends & Groups Page
         ↓
    (Other pages: Physique, Workout, Leaderboard)
```

---

## Implementation Notes

- **No Chat Functionality**: Chat buttons are visual placeholders only (as requested)
- **Static Data**: All data is hardcoded for demonstration
- **Routing**: All navigation uses Angular Router
- **Standalone Components**: All pages are standalone Angular components
- **Ionic Framework**: Uses Ionic UI components and styling

---

## Future Enhancements (Not Implemented)

- Database integration for dynamic data
- Real chat functionality
- Create/Edit routine forms
- Group creation and management
- Friend request system
- Search functionality
- Pull-to-refresh
- Infinite scroll for large lists

---

**Created by**: AI Assistant  
**Date**: November 26, 2024  
**Version**: 1.0
