# Athar

A UAE-focused website that helps people find safe, official ways to donate money, donate items, or volunteer, with a points and levels game. Built with HTML, CSS and JavaScript.

Athar does not collect donations. It only links to official resources.

## Team

| Member | Name | Responsibility |
|---|---|---|
| 1 | [Mariam] | Home page, shared navigation and design, profile form, giver quiz |
| 2 | [Khadeeja] | Points engine, "Real or Scam?" game, My Journey page |
| 3 | [Tala] | Volunteer page and finder, Find a Cause page |
| 4 | [Mahra] | Money, Donate Items, Safe Giving and About pages |

## File ownership

Only edit your own files. If you need a change in someone else's file, message them.

| Member | Files                                                                                        |
|--------|----------------------------------------------------------------------------------------------|
| 1      | `index.html`, `css/style.css`, `js/quiz.js`                                                  |
| 2      | `js/athar.js`, `js/game.js`, `js/journey.js`, `game.html`, `journey.html`, `css/journey.css` |
| 3      | `volunteer.html`, `causes.html`                                                              |
| 4      | `money.html`, `items.html`, `safe-giving.html`, `about.html`                                 |

## How to work on GitHub (VS Code)

1. **Pull first** every time you start: Source Control, **...** menu, **Pull**.
2. Edit your own files and save.
3. Type a short message, click **Commit**, then **Sync Changes**.

When you update this README, only change your own section, and pull first.

## Every page should include

Before `</body>`:

```html
<script src="js/athar.js"></script>
```

In the navigation bar, so the user's level shows on every page:

```html
<span id="athar-level"></span>
```

Link to every page from the navigation: `index.html`, `money.html`, `items.html`, `volunteer.html`, `causes.html`, `safe-giving.html`, `game.html`, `journey.html`, `about.html`.

## Points system (for everyone to use)

| Function | What it does |
|---|---|
| `addPoints(5)` | Gives the user 5 points |
| `awardOnce("some-key", 5)` | Gives points only the first time for that key |
| `markExplored("money")` | 5 points once. Use `"money"`, `"items"` or `"volunteer"` on those pages (counts toward the Triple Giver badge) |
| `markExplored("cause-education")` | 5 points once for exploring a cause |
| `giveBadge("Badge Name")` | Gives a badge (names are listed in `js/athar.js`) |
| `getLevel()` | Returns Seed, Sprout, Branch or Tree |

Saved data uses the browser key `athar_points`. Please don't use that key for anything else.

## Progress

Each member ticks their own boxes.

### Member 1: [Mariam]
- [ ] Shared navigation and design (`css/style.css`)
- [ ] Home page
- [ ] Profile form and personalised welcome
- [ ] Giver quiz
- [ ] Points connected (`athar.js` added, level chip in nav)
- [ ] Tested on phone and laptop

### Member 2: [Khadeeja]
- [x] Points, levels and badges (`js/athar.js`)
- [x] "Real or Scam?" game (`game.html`)
- [x] My Journey page: level, badges, 7-day challenge, giving log
- [X] Tested on phone and laptop

### Member 3: [Tala]
- [ ] Volunteer page
- [ ] Volunteer finder (interest + emirate)
- [ ] Find a Cause page and cause filter
- [ ] Official links checked
- [ ] Points connected (`markExplored`)
- [ ] Tested on phone and laptop

### Member 4: [Mahra]
- [ ] Money Donations page with official links
- [ ] Donate Items page and checklist builder
- [ ] Safe Giving page (tips, link to `game.html`)
- [ ] About page and feedback form with validation
- [ ] Points connected (`markExplored`)
- [ ] Tested on phone and laptop

### Whole team
- [ ] All navigation links work
- [ ] All external links work and go to official sites
- [ ] Every page has the same colors, navigation and tone
- [ ] Site published on GitHub Pages
- [ ] Presentation prepared

## Notes

- All quiz and game examples are made up for learning.
- Points, badges and the giving log are self-reported and not verified.
- Athar is an information directory, not an endorsing or certifying authority. Check official links before publishing.