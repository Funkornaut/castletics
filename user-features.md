# Daily User Engagement PRD for Castletics

## Objective

Create a fun, sticky, and rewarding experience for daily users of the Castletics Farcaster mini-app. Leverage Web3-native elements like NFTs, social graph, and proof mechanics to promote consistency, social interaction, and user-generated content.

---

## Features

### 1. Streak System

* **Streak Meter:** Visual indicator (e.g., fire emoji) that increases daily.
* **Milestone Rewards:**

  * 3, 7, 14, 30-day streaks = token or NFT rewards
  * Unlock XP, cosmetics, or limited edition badges
* **Streak Freeze:**

  * One-time use item to protect streaks
  * Earned via challenges, guild contributions, or wheel spins

---

### 2. Proof-of-Workout System (v0.1 IMPLEMENTED)

**Current Implementation: Timer-Based Proof**
* **Check-in Flow:** User selects workout → starts timer → completes minimum time → claims workout
* **Minimum Time Validation:** 70% of target workout duration (minimum 5 minutes)
* **Privacy-First:** No photos/videos required - perfect for anons
* **Accountability:** Real-time timer with pause/resume functionality
* **Visual Feedback:** Progress bar and completion notifications

**Future Enhancements (v0.2+):**
* **"Proof of Sweat" AI Analysis:** Optional photo upload for sweat detection on clothing/equipment
* **Wearable Integration:** Apple Watch, Fitbit data verification
* **Social Proof:** Anonymous location check-ins, workout buddy verification

---

### 3. Workout Guilds

* **Guild Creation:**

  * Based on Farcaster friends/followers
  * Auto-suggested or user-created
* **Guild Leaderboards:**

  * Daily & weekly activity tracking (workouts, posts)
* **Group Bonuses:**

  * "3+ members complete daily = bonus XP for all"
* **Shared Casts:** Guild thread for motivation/memes

---

### 4. XP + Leveling System

* **Earn XP by:**

  * Completing workouts
  * Posting video proofs
  * Verifying others' workouts
  * Inviting users
* **Level Up Unlocks:**

  * New routines
  * Cosmetic badges or avatar upgrades
  * Access to rare workout cards

---

### 5. Post-Workout Mini Game: "Wheel of Gains"

* **Spin the Wheel after proof post**

  * Prizes:

    * XP boost
    * Small token tip
    * Streak freeze pass
    * Cosmetic NFTs
    * Workout remix cards

---

### 6. Daily Trivia + Polls

* **After workout complete:** Fun question or fitness trivia
* **Answer with guildmates:**

  * Voting gets bonus XP
  * Majority/minority stats shown

---

### 7. Custom Avatars / Fitness Cards

* **Minted NFTs:** Represent user journey
* **Dynamic elements:**

  * Level, streaks, favorite workouts
* **Guild Visuals:**

  * Themed based on guild (e.g., flames for "Cardio Killaz")

---

## Farcaster Integration

* **Channel Posting:** `#daily-workout`, `#guild-leaderboard`
* **Cast-to-Join Challenges:** reply to opt-in to streak contests
* **Inline Cast Previews:**

  * Show user streaks, latest proof post
  * Guild ranking previews

---

## Implementation Status

### ✅ Completed (v0.1)
* [x] **Timer-Based Proof System** - Privacy-friendly workout validation
* [x] **Streak System Backend** - Database tracking and API endpoints
* [x] **Basic Workout Library** - 40+ predefined workouts across categories
* [x] **User Authentication** - Farcaster Auth Kit integration
* [x] **Database Schema** - Users, streaks, workouts tables with Supabase

### 🔧 In Progress
* [ ] UI/UX Polish - Styling and responsive design
* [ ] Error Handling - Robust error states and loading indicators

### 📋 Next Steps (v0.2+)
* [ ] Develop XP/leveling backend logic 
* [ ] Design streak tracking UI enhancements
* [ ] Implement guild creation and leaderboard tracking
* [ ] Build "proof of sweat" AI photo analysis
* [ ] Add wearable device integration (Apple Watch, Fitbit)
* [ ] Define metadata schema for fitness card NFTs
* [ ] Create spin-the-wheel game logic
* [ ] Enhanced Farcaster cast integration

### 🚀 Ready to Ship (v0.1)
The current implementation provides a solid foundation with:
- **Privacy-first approach** suitable for anonymous users
- **Timer-based accountability** without invasive photo requirements  
- **Flexible architecture** ready for future AI and wearable enhancements
- **Proven database structure** handling users, streaks, and workouts

