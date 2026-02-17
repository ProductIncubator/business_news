# Changelog

All notable changes to the Azerbaijan News Summarizer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-11

### Added - Major System Overhaul

#### 🔄 Dual Telegram Messaging System
- **NOTIFICATION_CHAT**: New environment variable for system monitoring
  - Receives detailed performance metrics
  - Source-by-source breakdown
  - Error reporting
  - System health indicators
  - Always sent on every run (success or failure)

- **CHANNEL_CHAT_ID**: New environment variable for end users
  - Replaces old `TELEGRAM_CHAT_ID`
  - Receives only clean banking intelligence
  - Only sent on successful scraping
  - Professional presentation without technical details

- **Separation of Concerns**: End users never see errors, tests, or debugging information

#### 🧪 TEST_MODE Feature
- New `TEST_MODE` environment variable for safe testing
- When enabled (`TEST_MODE=true`):
  - All messages route to NOTIFICATION_CHAT only
  - Public channel receives NOTHING
  - User reports include `[TEST MODE]` label
  - Perfect for development and testing without spamming users
- When disabled (`TEST_MODE=false`):
  - Normal production routing
  - Monitoring → NOTIFICATION_CHAT
  - User news → CHANNEL_CHAT_ID

#### 🔄 Gemini API Retry Logic (Issue #18 Fix)
- Automatic retry with exponential backoff for 503/overload errors
- Configurable retry parameters:
  - `GEMINI_MAX_RETRIES` (default: 3 attempts)
  - `GEMINI_INITIAL_RETRY_DELAY` (default: 2 seconds)
  - `GEMINI_MAX_RETRY_DELAY` (default: 30 seconds)
- Retry sequence: 2s → 4s → 8s → fail
- Distinguishes between transient errors (503) and quota errors (429)
- Falls back gracefully on persistent failures

#### 📊 Enhanced Monitoring Reports
- Comprehensive performance metrics
- Per-source breakdown with new/total/duplicate counts
- AI processing status
- System health indicators
- Error tracking and reporting

### Changed

#### Environment Variables
- **DEPRECATED**: `TELEGRAM_CHAT_ID` (still works but not recommended)
- **NEW**: `NOTIFICATION_CHAT` - for monitoring and admin notifications
- **NEW**: `CHANNEL_CHAT_ID` - for end-user news delivery
- **NEW**: `TEST_MODE` - for safe testing
- **NEW**: `GEMINI_MAX_RETRIES` - optional retry configuration
- **NEW**: `GEMINI_INITIAL_RETRY_DELAY` - optional retry configuration
- **NEW**: `GEMINI_MAX_RETRY_DELAY` - optional retry configuration

#### Telegram Module (telegram.py)
- Complete refactor to support dual messaging
- New methods:
  - `send_monitoring_report()` - detailed stats for admins
  - `send_user_report()` - clean news for end users
- Removed: `send_scraping_report()` (replaced by above two methods)
- Test mode detection and routing
- Smart message destination selection

#### Main Scraper (main.py)
- Added dotenv loading for local development
- Dual report sending in finally block
- Separate success tracking for routing decisions

#### Summarizer (summarizer.py)
- New `_call_with_retry()` method for resilient API calls
- Exponential backoff implementation
- Error type detection (transient vs. permanent)
- Retry logging with attempt tracking

### Fixed
- **Issue #18**: Model overload (503) errors now auto-retry
- Database connection handling with proper .env loading
- Unicode encoding issues for Azerbaijani characters

### Security
- Removed all hardcoded credentials from documentation
- All examples now use placeholder values
- Environment variable names documented, not values

### Documentation
- New CHANGELOG.md (this file)
- Updated README.md with:
  - TEST_MODE documentation
  - Dual messaging system explanation
  - Retry configuration guide
  - Message routing table
- New configuration examples
- Updated GitHub Actions workflow documentation

### Migration Guide

#### For Existing Users

**Step 1: Update Environment Variables**

Old `.env`:
```env
TELEGRAM_CHAT_ID=your_chat_id_here
```

New `.env`:
```env
# For testing (recommended initial setup)
TEST_MODE=true
NOTIFICATION_CHAT=your_admin_chat_ids_here
CHANNEL_CHAT_ID=your_public_channel_id_here

# Optional: Gemini retry configuration
GEMINI_MAX_RETRIES=3
GEMINI_INITIAL_RETRY_DELAY=2
GEMINI_MAX_RETRY_DELAY=30
```

**Step 2: Update GitHub Secrets**

Add these new secrets:
- `NOTIFICATION_CHAT`
- `CHANNEL_CHAT_ID`
- `TEST_MODE` (set to `false` for production)
- `GEMINI_MAX_RETRIES` (optional)
- `GEMINI_INITIAL_RETRY_DELAY` (optional)
- `GEMINI_MAX_RETRY_DELAY` (optional)

**Step 3: Test Before Production**

1. Set `TEST_MODE=true` locally
2. Run `python scraper/main.py`
3. Verify both reports arrive in NOTIFICATION_CHAT
4. Verify CHANNEL_CHAT_ID receives nothing
5. Set `TEST_MODE=false` for production

### Breaking Changes

⚠️ **TELEGRAM_CHAT_ID is deprecated**
- Old variable still works but will be removed in v3.0.0
- Please migrate to NOTIFICATION_CHAT and CHANNEL_CHAT_ID

⚠️ **Message format changed**
- Monitoring reports now more detailed
- User reports now cleaner and more professional
- No more mixed technical/user content in one message

---

## [1.0.0] - Previous Version

### Features
- Async scraping from 10 Azerbaijani news sources
- Google Gemini AI summarization
- PostgreSQL storage with transactional saves
- Telegram notifications
- GitHub Actions automation (3x daily)
- Banking news filtering
- Duplicate detection
