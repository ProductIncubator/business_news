# Configuration Guide

Complete guide to configuring the Azerbaijan News Summarizer.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Telegram Configuration](#telegram-configuration)
- [Test Mode](#test-mode)
- [Gemini API Configuration](#gemini-api-configuration)
- [GitHub Actions](#github-actions)
- [Troubleshooting](#troubleshooting)

## Environment Variables

### Required Variables

#### `DATABASE_URL`
PostgreSQL connection string.

```env
DATABASE_URL=postgresql://username:password@hostname:port/database_name?sslmode=require
```

**Format:**
- `username`: Your database username
- `password`: Your database password
- `hostname`: Database host (e.g., `your-db.neon.tech`)
- `port`: Database port (default: `5432`)
- `database_name`: Name of your database
- `sslmode=require`: SSL connection mode (recommended for cloud databases)

**Example:**
```env
DATABASE_URL=postgresql://myuser:mypassword@db.example.com:5432/news_db?sslmode=require
```

#### `GEMINI_API_KEY`
Google Gemini API key for AI summarization.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy and paste into `.env`

**Rate Limits (Free Tier):**
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day

#### `TELEGRAM_BOT_TOKEN`
Telegram bot authentication token.

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**Get your token:**
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow instructions
3. Copy the token provided

### Telegram Chat Configuration

#### `NOTIFICATION_CHAT`
**Purpose:** System monitoring and admin notifications
**Receives:** Performance metrics, errors, health status
**Frequency:** Every run (success or failure)

```env
NOTIFICATION_CHAT=123456789,987654321
```

**Format:** Comma-separated list of chat IDs

**Get your chat ID:**
1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. It will reply with your chat ID
3. For multiple admins, collect all IDs

**Example:**
```env
# Single admin
NOTIFICATION_CHAT=123456789

# Multiple admins
NOTIFICATION_CHAT=123456789,987654321,555555555
```

#### `CHANNEL_CHAT_ID`
**Purpose:** Public channel for end-user news
**Receives:** Clean banking intelligence summaries
**Frequency:** Only on successful scraping

```env
CHANNEL_CHAT_ID=-1001234567890
```

**Get channel ID:**
1. Create a public or private channel
2. Add your bot as administrator
3. Use [@userinfobot](https://t.me/userinfobot) or forward a message to get the ID
4. Channel IDs start with `-100`

**Example:**
```env
CHANNEL_CHAT_ID=-1001234567890
```

### Test Mode

#### `TEST_MODE`
**Purpose:** Safe testing without spamming public channel
**Default:** `false`

```env
TEST_MODE=true   # For development/testing
TEST_MODE=false  # For production
```

**When `TEST_MODE=true`:**
- ✅ All messages go to `NOTIFICATION_CHAT` only
- ✅ User reports include `[TEST MODE]` label
- ❌ `CHANNEL_CHAT_ID` receives nothing
- Perfect for: Development, debugging, testing changes

**When `TEST_MODE=false`:**
- ✅ Monitoring reports → `NOTIFICATION_CHAT`
- ✅ User reports → `CHANNEL_CHAT_ID`
- Production mode, normal operation

**Recommended Workflow:**
1. Development: `TEST_MODE=true` in local `.env`
2. Testing: `TEST_MODE=true` in GitHub Secrets
3. Production: `TEST_MODE=false` in GitHub Secrets

### Gemini API Retry Configuration

Optional configuration for handling API overload errors (503).

#### `GEMINI_MAX_RETRIES`
**Purpose:** Number of retry attempts
**Default:** `3`
**Range:** `0-10`

```env
GEMINI_MAX_RETRIES=3
```

**Recommended values:**
- `0`: No retries (fail immediately)
- `3`: Default (balanced)
- `5`: Aggressive (more resilient)

#### `GEMINI_INITIAL_RETRY_DELAY`
**Purpose:** Initial delay before first retry (seconds)
**Default:** `2`
**Range:** `1-30`

```env
GEMINI_INITIAL_RETRY_DELAY=2
```

**How it works:**
- First retry: wait `INITIAL_RETRY_DELAY` seconds
- Second retry: wait `INITIAL_RETRY_DELAY * 2` seconds
- Third retry: wait `INITIAL_RETRY_DELAY * 4` seconds
- And so on (exponential backoff)

#### `GEMINI_MAX_RETRY_DELAY`
**Purpose:** Maximum delay cap (seconds)
**Default:** `30`
**Range:** `5-120`

```env
GEMINI_MAX_RETRY_DELAY=30
```

**Example retry sequence with defaults:**
```
Attempt 1: fail → wait 2s
Attempt 2: fail → wait 4s
Attempt 3: fail → wait 8s
Attempt 4: fail → give up
```

### Complete .env Example

```env
# Database
DATABASE_URL=postgresql://user:pass@db.example.com:5432/newsdb?sslmode=require

# Google Gemini AI
GEMINI_API_KEY=your_api_key_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Test Mode (true for testing, false for production)
TEST_MODE=true

# Telegram Destinations
NOTIFICATION_CHAT=123456789,987654321      # Admin chats
CHANNEL_CHAT_ID=-1001234567890             # Public channel

# Optional: Gemini Retry Configuration
GEMINI_MAX_RETRIES=3
GEMINI_INITIAL_RETRY_DELAY=2
GEMINI_MAX_RETRY_DELAY=30
```

## GitHub Actions Configuration

Configure secrets in your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

| Secret Name | Value | Notes |
|-------------|-------|-------|
| `DATABASE_URL` | Your PostgreSQL URL | Required |
| `GEMINI_API_KEY` | Your Gemini API key | Required |
| `TELEGRAM_BOT_TOKEN` | Your bot token | Required |
| `NOTIFICATION_CHAT` | Admin chat IDs | Required |
| `CHANNEL_CHAT_ID` | Public channel ID | Required |
| `TEST_MODE` | `false` | Set to `false` for production |
| `GEMINI_MAX_RETRIES` | `3` | Optional |
| `GEMINI_INITIAL_RETRY_DELAY` | `2` | Optional |
| `GEMINI_MAX_RETRY_DELAY` | `30` | Optional |

**⚠️ Important:**
- Set `TEST_MODE=false` in GitHub Secrets for production
- Keep `TEST_MODE=true` in local `.env` for safe development

## Troubleshooting

### Issue: Messages not arriving

**Check:**
1. Bot is administrator in the channel
2. Chat IDs are correct (use [@userinfobot](https://t.me/userinfobot))
3. `TELEGRAM_BOT_TOKEN` is valid
4. Check console logs for errors

### Issue: Messages going to wrong channel

**Check:**
1. `TEST_MODE` setting:
   - If `true`: all messages go to `NOTIFICATION_CHAT`
   - If `false`: messages split between chats
2. Verify chat IDs are not swapped

### Issue: Gemini API errors

**Check:**
1. `GEMINI_API_KEY` is valid
2. Daily quota not exceeded (1,500 requests/day)
3. Rate limit not exceeded (15 requests/minute)
4. Retry configuration is reasonable

**Solutions:**
- Increase `GEMINI_MAX_RETRIES` for more resilience
- Increase `GEMINI_INITIAL_RETRY_DELAY` for slower retry
- Wait 24 hours if quota exhausted

### Issue: Database connection failed

**Check:**
1. `DATABASE_URL` format is correct
2. Database server is accessible
3. Credentials are valid
4. SSL mode is compatible with your database

**Common fixes:**
```env
# Try without channel_binding
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Try with explicit SSL mode
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=prefer
```

## Security Best Practices

1. **Never commit `.env` file** (already in `.gitignore`)
2. **Use GitHub Secrets** for production credentials
3. **Rotate API keys** periodically
4. **Limit bot permissions** to only what's needed
5. **Use `TEST_MODE`** for all development work
6. **Monitor `NOTIFICATION_CHAT`** for security alerts

## Further Help

- **Issues**: Check [CHANGELOG.md](CHANGELOG.md) for breaking changes
- **Examples**: See [README.md](../README.md) for usage examples
- **Support**: Open an issue on GitHub

---

**Last Updated:** 2026-01-11 (v2.0.0)
