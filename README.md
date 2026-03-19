# tidskalkulator

[![Deploy to GitHub Pages](https://github.com/mmsge/tidskalkulator/actions/workflows/deploy.yml/badge.svg)](https://github.com/mmsge/tidskalkulator/actions/workflows/deploy.yml)

A simple workday end-time calculator. Enter your start time, how long you work, and an optional break — it tells you when you're done.

## Usage

1. Open the [live site](https://mmsge.github.io/tidskalkulator/)
2. Enter the time you started work
3. Set how many hours (and minutes) you need to work
4. Optionally check **Include a break** and enter its duration in minutes
5. Click **Calculate** (or press Enter) — your finish time appears instantly

No installation or account needed. Everything runs in the browser.

## GitHub Pages publishing

The site is deployed automatically to GitHub Pages on every push to the `hovud` branch via the workflow at `.github/workflows/deploy.yml`.

To enable it on a fork:
1. Go to **Settings → Pages** in your repository
2. Set the source to **GitHub Actions**
3. Push to `hovud` — the workflow will build and publish the site

## Development

The entire app is a single `index.html` file with no dependencies or build step. Edit the file and push to `hovud` to publish changes.
