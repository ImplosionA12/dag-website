# How DAG Polls Work (and how to run one)

The /polls page reads from `NEXT_PUBLIC_SHEETS_POLLS_URL` — a URL that must return
JSON shaped like `{ "polls": [...] }`. The page auto-refreshes every 30 seconds,
so vote bars move live. Until that env var is set, the site shows built-in mock polls.

This guide gives you a real pipeline: **Google Form (voting) → Google Sheet
(responses) → Apps Script (live JSON) → website**.

---

## One-time setup (~10 minutes)

### 1. Create the polls spreadsheet
Create a Google Sheet named **DAG Polls**. Add a tab named exactly `polls` with
these headers in row 1:

| id | type | title | description | season | status | ends_at | form_url | responses_tab | question |
|----|------|-------|-------------|--------|--------|---------|----------|---------------|----------|

Column meanings:
- **id** — short slug, e.g. `best-game-s1`
- **type** — `event`, `general`, or `animation` (controls the card accent)
- **status** — `open` or `closed` (closed polls show gold winner + no vote button)
- **ends_at** — optional date, e.g. `2026-07-01`
- **form_url** — the Google Form link people vote with
- **responses_tab** — name of the tab in THIS spreadsheet holding that form's responses
- **question** — the exact question title in the form (used to find the answer column)

### 2. Create a Google Form per poll
- One question, multiple choice (single answer), options = your poll options.
- In the Form: **Responses → Link to Sheets → Select existing spreadsheet → DAG Polls.**
  This creates a tab like `Form Responses 1` — put that tab name in `responses_tab`.
- Copy the form's share link into `form_url`.

### 3. Add the Apps Script
In the DAG Polls sheet: **Extensions → Apps Script**, delete the boilerplate,
paste the script below, save.

### 4. Deploy as a web app
**Deploy → New deployment → type: Web app**
- Execute as: **Me**
- Who has access: **Anyone**
- Deploy, authorize, copy the **Web app URL** (ends in `/exec`).

### 5. Point the site at it
In `.env.local`:
```
NEXT_PUBLIC_SHEETS_POLLS_URL=https://script.google.com/macros/s/XXXX/exec
```
Rebuild/redeploy the site. Done — votes now appear within ~30 seconds.

---

## Running a poll after setup (~2 minutes each)
1. Make a Form, link its responses into DAG Polls (step 2 above).
2. Add one row to the `polls` tab.
3. Share the form link / let people vote on the site's CAST VOTE button.
4. When it's over, change `status` to `closed` — the winner goes gold on the site.

To remove a poll from the site, delete its row.

---

## The Apps Script

```javascript
// DAG Polls — serves { polls: [...] } JSON for the website.
// Tabs: 'polls' (config, one row per poll) + one responses tab per form.

const CONFIG_TAB = 'polls'

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const config = ss.getSheetByName(CONFIG_TAB)
  if (!config) return jsonOut({ polls: [] })

  const rows = config.getDataRange().getValues()
  const headers = rows.shift().map(h => String(h).trim().toLowerCase())
  const col = name => headers.indexOf(name)

  const polls = rows
    .filter(r => String(r[col('id')] || '').trim())
    .map(r => {
      const responsesTab = String(r[col('responses_tab')] || '').trim()
      const question = String(r[col('question')] || '').trim()
      const tally = countVotes(ss, responsesTab, question)

      return {
        id: String(r[col('id')]).trim(),
        type: normalizeType(r[col('type')]),
        title: String(r[col('title')] || '').trim(),
        description: String(r[col('description')] || '').trim() || undefined,
        season: String(r[col('season')] || 'S1').trim(),
        status: String(r[col('status')] || 'open').trim().toLowerCase() === 'closed' ? 'closed' : 'open',
        ends_at: toIsoDate(r[col('ends_at')]),
        form_url: String(r[col('form_url')] || '').trim() || undefined,
        options: tally.options,
        total_voters: tally.total,
      }
    })

  return jsonOut({ polls })
}

function countVotes(ss, tabName, questionTitle) {
  const sheet = tabName ? ss.getSheetByName(tabName) : null
  if (!sheet) return { options: [], total: 0 }

  const data = sheet.getDataRange().getValues()
  if (data.length < 2) return { options: [], total: 0 }

  const headers = data.shift().map(h => String(h).trim())
  let qCol = questionTitle ? headers.indexOf(questionTitle) : -1
  if (qCol === -1) qCol = 1 // fall back to first question after Timestamp

  const counts = {}
  let total = 0
  data.forEach(row => {
    const answer = String(row[qCol] || '').trim()
    if (!answer) return
    total++
    counts[answer] = (counts[answer] || 0) + 1
  })

  const options = Object.keys(counts)
    .map(label => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: label,
      votes: counts[label],
      percentage: total ? Math.round((counts[label] / total) * 100) : 0,
    }))
    .sort((a, b) => b.votes - a.votes)

  return { options: options, total: total }
}

function normalizeType(v) {
  const t = String(v || '').trim().toLowerCase()
  return t === 'event' || t === 'animation' ? t : 'general'
}

function toIsoDate(v) {
  if (!v) return undefined
  const d = new Date(v)
  if (isNaN(d.getTime())) return undefined
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd')
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
```

---

## Notes
- Use **single-answer multiple choice** questions. (Checkbox questions return
  comma-joined answers and would be counted as one combined option.)
- Options with zero votes won't appear until someone votes for them — that's
  fine; bars are computed from actual responses.
- After editing the script, you must **Deploy → Manage deployments → Edit →
  New version** for changes to go live (the /exec URL stays the same).
- The site fetch happens server-side with a 30s cache, so the sheet is never
  hammered no matter how many people are on the page.
