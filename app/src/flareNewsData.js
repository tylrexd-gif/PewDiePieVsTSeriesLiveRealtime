// ─ FLARE NEWS DATA ──────────────────────────────────────────────────────────
// Edit this file to add/change news entries and channel promotions.
// Rebuild (npm run build) after editing.
//
// All timestamps are UTC. US Eastern offsets for reference:
//   EDT (UTC−4): through Nov 4 2018
//   EST (UTC−5): Nov 4 2018 onwards

// News entries shown in the ticker.
// Required: ms (UTC when visible), label ("Mon DD"), text
// Optional: windowHours - how long (in hours) the entry stays in the feed.
//           Defaults to 336 (2 weeks) if omitted.
//           passInfo: true - Pass Information (pass predictions and lists of pass dates):
//           shown only in the Flare feed, not SocialBlade.
export const FLARE_NEWS_ENTRIES = [
  { ms: Date.UTC(2018, 9, 26, 21, 0, 0), label: "Oct 26", text: "MrBeast advertises PewDiePie in a viral video", windowHours: 168 },
  { ms: Date.UTC(2018, 9, 17, 0, 0, 0), label: "", text: "PewDiePie - 20 - 30k subs per day, T-Series - 130k - 150k", windowHours: 237 },
  { ms: Date.UTC(2018, 9, 17, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, however PewDiePie will still be the most subscribed individual", windowHours: 72, passInfo: true },
  { ms: Date.UTC(2018, 9, 20, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, however PewDiePie will still be the most subscribed individual", windowHours: 72, passInfo: true },
  { ms: Date.UTC(2018, 9, 23, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 4 days, however PewDiePie will still be the most subscribed individual", windowHours: 48, passInfo: true },
  { ms: Date.UTC(2018, 9, 25, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 days, however PewDiePie will still be the most subscribed individual", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2018, 9, 26, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 day, however PewDiePie will still be the most subscribed individual", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2018, 9, 27, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 72, passInfo: true },
  { ms: Date.UTC(2018, 9, 30, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 72, passInfo: true },
  { ms: Date.UTC(2018, 10, 2, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96, passInfo: true },
  { ms: Date.UTC(2018, 10, 6, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96, passInfo: true },
  { ms: Date.UTC(2018, 10, 10, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96, passInfo: true },
  { ms: Date.UTC(2018, 10, 14, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96, passInfo: true },
  { ms: Date.UTC(2018, 10, 18, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 72, passInfo: true },
  { ms: Date.UTC(2018, 10, 21, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 4 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 48, passInfo: true },
  { ms: Date.UTC(2018, 10, 23, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 48, passInfo: true },
  { ms: Date.UTC(2018, 10, 25, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 day, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2018, 10, 28, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2018, 10, 29, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 4 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2018, 10, 30, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 3 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2018, 11, 1, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2018, 11, 2, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 day, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 21, passInfo: true },
  { ms: Date.UTC(2018, 9, 29, 18, 45, 0), label: "", text: "Oct 29 - PewDiePie uploads \"I need your help...\"", windowHours: 72 },   // 14:45 EDT
  { ms: Date.UTC(2018, 10, 2, 0, 0, 0), label: "", text: "Nov 2 - PewDiePie reaches 69 million subscribers", windowHours: 168 },
  { ms: Date.UTC(2018, 10, 2, 19, 30, 0), label: "", text: "Nov 2 - PewDiePie uploads \"This Is Epic (Bonus Meme ft. Ben Shapiro)\"", windowHours: 72 },   // 15:30 EDT
  { ms: Date.UTC(2018, 10, 6, 19, 0, 0), label: "", text: "Nov 6 - PewDiePie uploads \"We made history!!!\"", windowHours: 72 },   // 14:00 EST
  { ms: Date.UTC(2018, 10, 8, 0, 0, 0), label: "", text: "Nov 7 - T-Series reaches 69 million subscribers", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 9, 20, 15, 0), label: "", text: "Nov 9 - PewDiePie uploads \"Reacting to Youtubers Reacting to Pewdiepie vs Tseries\"", windowHours: 72 },   // 15:15 EST
  { ms: Date.UTC(2018, 10, 11, 0, 0, 0), label: "", text: "Nov 10 - PewDiePie reaches 70 million subscribers", windowHours: 168 },
  { ms: Date.UTC(2018, 10, 13, 19, 0, 0), label: "", text: "Nov 13 - PewDiePie uploads \"We made history!!! (again)\"", windowHours: 72 },   // 14:00 EST
  { ms: Date.UTC(2018, 10, 15, 0, 0, 0), label: "", text: "Nov 14 - T-Series reaches 70 million subscribers", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 18, 19, 10, 0), label: "", text: "Nov 18 - PewDiePie uploads \"The secret to stopping T Series... (Book Review)\"", windowHours: 72 },   // 14:10 EST
  { ms: Date.UTC(2018, 10, 21, 18, 45, 0), label: "", text: "Nov 21 - PewDiePie uploads \"The last hope for my channel...\". MrBeast promises he has something in the works for PewDiePie.", windowHours: 72 },   // 13:45 EST
  { ms: Date.UTC(2018, 10, 22, 17, 30, 0), label: "", text: "Nov 22 - PewDiePie uploads \"Bich Lasagna V2 (Beat Saber)\"", windowHours: 72 },   // 12:30 EST
  { ms: Date.UTC(2018, 10, 23, 6, 30, 0), label: "", text: "Nov 23 - T-Series releases Mere Naam Tu", windowHours: 48 },   // 1:30 EST
  { ms: Date.UTC(2018, 10, 24, 9, 35, 0), label: "", text: "Nov 24 - The subscriber gap falls under 100,000 for the first time", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 27, 5, 30, 0), label: "", text: "Nov 27 - T-Series releases Tere Te", windowHours: 48 },   // 0:30 EST
  { ms: Date.UTC(2018, 10, 28, 21, 20, 0), label: "", text: "Nov 28 - PewDiePie uploads \"Watch this video in 2X SPEED!!\"", windowHours: 72 },   // 16:20 EST
  { ms: Date.UTC(2018, 10, 29, 17, 0, 0), label: "", text: "Nov 29 - A hacker makes a claimed 50,000 printers print messages telling people to subscribe to PewDiePie", windowHours: 72 },   // 12:00 EST (exact time unknown)
  { ms: Date.UTC(2018, 10, 30, 10, 0, 0), label: "", text: "Nov 30 - T-Series releases Dilbar Arabic Version", windowHours: 48 },   // 5:00 EST
  { ms: Date.UTC(2018, 11, 2, 18, 15, 0), label: "", text: "Dec 2 - PewDiePie uploads \"SUBSCRIBE GODDAMMIT\"", windowHours: 72 },   // 13:15 EST
  { ms: Date.UTC(2018, 11, 2, 21, 0, 0), label: "", text: "Dec 2 - Markiplier does a livestream titled \"I Literally Won't Shut Up Until You Subscribe To PewDiePie\", leading to a huge increase in PewDiePie's sub count", windowHours: 96 },
  { ms: Date.UTC(2018, 11, 2, 21, 0, 0), label: "", text: "T-Series was under 20,000 subscribers away from overtaking PewDiePie", windowHours: 96 },
  { ms: Date.UTC(2018, 11, 3, 16, 0, 0), label: "", text: "PewDiePie gained over 540k subscribers on Dec 2", windowHours: 77 },
  { ms: Date.UTC(2018, 11, 3, 17, 45, 0), label: "", text: "Dec 3 - PewDiePie uploads \"This is getting out of control...\"", windowHours: 72 },   // 12:45 EST
  { ms: Date.UTC(2018, 11, 4, 7, 30, 0), label: "", text: "Dec 4 - T-Series releases ISSAQBAAZI", windowHours: 48 },   // 2:30 EST
  { ms: Date.UTC(2018, 11, 4, 17, 0, 0), label: "", text: "Dec 4 - PewDiePie does a livestream raising $246,000 for CRY", windowHours: 72 },   // 12:00 EST
  { ms: Date.UTC(2018, 11, 5, 19, 15, 0), label: "", text: "Dec 5 - PewDiePie uploads \"CONFIRMED PewDiePie is in Fortnite.\"", windowHours: 72 },   // 14:15 EST
  { ms: Date.UTC(2018, 11, 6, 5, 30, 0), label: "", text: "Dec 6 - T-Series releases Aankh Marey", windowHours: 48 },   // 0:30 EST
  { ms: Date.UTC(2018, 11, 7, 18, 15, 0), label: "", text: "Dec 7 - PewDiePie uploads \"Youtube Rewind 2018 review\"", windowHours: 72 },   // 13:15 EST
  { ms: Date.UTC(2018, 11, 9, 19, 20, 0), label: "", text: "Dec 9 - PewDiePie uploads \"DON'T Subscribe to Pewdiepie\"", windowHours: 72 },   // 14:20 EST
  { ms: Date.UTC(2018, 11, 10, 17, 0, 0), label: "", text: "PewDiePie is criticized after one of the 28 channels he shouted out, E;R, was found to contain antisemitic content", windowHours: 26 },   // 12:00 EST, until the response below
  { ms: Date.UTC(2018, 11, 11, 16, 30, 0), label: "", text: "Dec 11 - PewDiePie uploads \"Bitch Lasagna v1.2\"", windowHours: 72 },   // 11:30 EST
  { ms: Date.UTC(2018, 11, 11, 19, 0, 0), label: "", text: "PewDiePie responds to the backlash surrounding E;R", windowHours: 36 },   // 14:00 EST
  { ms: Date.UTC(2018, 11, 11, 23, 0, 0), label: "", text: "Dec 11 - PewDiePie is 1,000,000 subscribers ahead of T-Series", windowHours: 666 },
  { ms: Date.UTC(2018, 11, 12, 8, 30, 0), label: "", text: "Dec 12 - T-Series releases Husn Parcham", windowHours: 48 },   // 3:30 EST
  { ms: Date.UTC(2018, 11, 13, 18, 30, 0), label: "", text: "Dec 13 - PewDiePie uploads \"The Youtube Rewind 2018 made HISTORY!\"", windowHours: 72 },   // 13:30 EST
  { ms: Date.UTC(2018, 11, 14, 4, 0, 0), label: "", text: "YouTube has announced that they will conduct a purge to remove inactive subscribers later today", windowHours: 16 },
  { ms: Date.UTC(2018, 11, 14, 17, 0, 0), label: "", text: "Dec 14 - Hackers target printers again in support of PewDiePie, claiming to reach 100,000 more", windowHours: 72 },   // 12:00 EST (exact time unknown)
  { ms: Date.UTC(2018, 11, 14, 20, 0, 0), label: "", text: "Dec 14 - YouTube removes inactive accounts - PewDiePie: -59k, T-Series: -226k", windowHours: 96 },
  { ms: Date.UTC(2018, 11, 17, 16, 35, 0), label: "", text: "Hackers replace a Wall Street Journal page with a fake apology to PewDiePie", windowHours: 72 },   // 11:35 EST
  { ms: Date.UTC(2018, 11, 21, 8, 0, 0), label: "", text: "Dec 21 - T-Series releases MAKHNA", windowHours: 48 },   // 3:00 EST
  { ms: Date.UTC(2018, 11, 28, 0, 0, 0), label: "", text: "Dec 27 - PewDiePie uploads \"YouTube Rewind 2018 but it's actually good\"", windowHours: 144 },
  { ms: Date.UTC(2018, 11, 30, 20, 50, 0), label: "", text: "Dec 30 - PewDiePie uploads \"We broke a world record!\"", windowHours: 72 },   // 15:50 EST
  { ms: Date.UTC(2019, 0, 1, 20, 0, 0), label: "", text: "Jan 1 - CarryMinati uploads \"Bye Pewdiepie\"", windowHours: 144 },
  { ms: Date.UTC(2019, 0, 4, 0, 0, 0), label: "", text: "Jan 3 - The subscriber gap drops under 1,000,000", windowHours: 144 },
  { ms: Date.UTC(2019, 0, 7, 2, 0, 0), label: "", text: "Jan 6 - PewDiePie reaches 80 million subscribers", windowHours: 168 },
  { ms: Date.UTC(2019, 0, 7, 19, 20, 0), label: "", text: "Jan 7 - PewDiePie uploads \"I'm not afraid to say it...\"", windowHours: 72 },   // 14:20 EST
  { ms: Date.UTC(2019, 0, 13, 0, 0, 0), label: "", text: "Jan 12 - T-Series reaches 80 million subscribers", windowHours: 96 },
  { ms: Date.UTC(2019, 0, 14, 19, 45, 0), label: "", text: "Jan 14 - PewDiePie shares a post telling fans to make alt accounts in his latest video", windowHours: 72 },   // 14:45 EST
  { ms: Date.UTC(2019, 0, 22, 19, 45, 0), label: "", text: "Jan 22 - PewDiePie uploads \"This is the end...\"", windowHours: 72 },   // 14:45 EST
  { ms: Date.UTC(2019, 0, 25, 5, 30, 0), label: "", text: "Jan 25 - T-Series releases BHARAT Teaser", windowHours: 48 },   // 0:30 EST
  { ms: Date.UTC(2019, 0, 29, 18, 15, 0), label: "", text: "Jan 29 - PewDiePie uploads \"What is happening?\". Elon Musk teases the possibility of hosting Meme Review.", windowHours: 72 },   // 13:15 EST
  { ms: Date.UTC(2019, 1, 3, 20, 0, 0), label: "", text: "Feb 3 - PewDiePie livestreams Fortnite to stop T-Series", windowHours: 72 },
  { ms: Date.UTC(2019, 1, 4, 8, 30, 0), label: "", text: "Feb 4 - T-Series releases Coca Cola Song", windowHours: 48 },   // 3:30 EST
  { ms: Date.UTC(2019, 1, 6, 17, 30, 0), label: "", text: "Feb 6 - PewDiePie uploads \"We broke ANOTHER world record!\"", windowHours: 72 },   // 12:30 EST
  { ms: Date.UTC(2019, 1, 10, 20, 0, 0), label: "", text: "Feb 10 - PewDiePie livestreams Roblox to stop T-Series", windowHours: 72 },
  { ms: Date.UTC(2019, 1, 13, 17, 30, 0), label: "", text: "Feb 13 - PewDiePie uploads \"I've made a huge mistake...\"", windowHours: 72 },   // 12:30 EST
  { ms: Date.UTC(2019, 1, 13, 18, 0, 0), label: "", text: "Feb 13 - The subscriber gap dropped under 10,000", windowHours: 96 },
  { ms: Date.UTC(2019, 1, 17, 20, 0, 0), label: "", text: "Feb 17 - PewDiePie livestreams Minecraft to stop T-Series", windowHours: 72 },
  { ms: Date.UTC(2019, 1, 22, 17, 53, 0), label: "", text: "Feb 22 - PewDiePie livestreams CoolMathGames to stop T-Series", windowHours: 72 },   // 12:53 EST
  { ms: Date.UTC(2019, 1, 22, 22, 0, 0), label: "", text: "T-Series passed PewDiePie for 8 minutes on Feb 22 due to a YouTube audit", windowHours: 168 },
  { ms: Date.UTC(2019, 1, 22, 22, 0, 0), label: "", text: "Feb 22 - Elon Musk hosts Meme Review", windowHours: 168 },
  { ms: Date.UTC(2019, 1, 24, 19, 15, 0), label: "", text: "Feb 24 - PewDiePie uploads \"We LOST?\"", windowHours: 72 },   // 14:15 EST
  { ms: Date.UTC(2019, 2, 2, 10, 0, 0), label: "", text: "T-Series fans are doing \"Plan U\" in an attempt to surpass PewDiePie. Plan U is a strategy where T-Series fans subscribe to PewDiePie, then once the gap decreases under 10k, unsubscribe from PewDiePie and subscribe to T-Series to rapidly decrease the gap in a few minutes, repeating this in waves every 15 or 30 minutes.", windowHours: 72 },   // 5:00 EST
  { ms: Date.UTC(2019, 2, 3, 13, 38, 0), label: "", text: "Mar 3 - The subscriber gap drops under 1,000, reaching a low of 676", windowHours: 72 },   // 8:38 EST
  { ms: Date.UTC(2019, 2, 4, 19, 0, 0), label: "", text: "Mar 4 - PewDiePie uploads \"Try not to CRY challenge\", assuming he will have been overtaken by the time of upload.", windowHours: 72 },   // 14:00 EST
  { ms: Date.UTC(2019, 2, 5, 19, 0, 0), label: "", text: "Mar 5 - PewDiePie does a sponsored PUBG Mobile stream to stop T-Series.", windowHours: 72 },   // 14:00 EST
  { ms: Date.UTC(2019, 2, 6, 18, 0, 0), label: "", text: "Mar 6 - T-Series chairman Bhushan Kumar starts #BharatWinsYoutube campaign", windowHours: 96 },
  { ms: Date.UTC(2019, 2, 9, 16, 22, 0), label: "", text: "Mar 9 - T-Series passed PewDiePie for 3 minutes due to a livestream by MaximilianMus. This is the first time T-Series passed PewDiePie not because of an audit.", windowHours: 144 },   // 11:22 EST
  { ms: Date.UTC(2019, 2, 9, 19, 0, 0), label: "", text: "Mar 9 - PewDiePie uploads \"What do Indians think of Pewdiepie vs Tseries?\"", windowHours: 72 },   // 14:00 EST
  { ms: Date.UTC(2019, 2, 11, 23, 0, 0), label: "", text: "Mar 11 - T-Series passed PewDiePie by 7.3k subscribers", windowHours: 144 },
  { ms: Date.UTC(2019, 2, 13, 23, 0, 0), label: "", text: "Mar 13 - T-Series passed PewDiePie by 4.7k subscribers", windowHours: 96 },
  { ms: Date.UTC(2019, 2, 15, 2, 0, 0), label: "", text: "Mar 14 - A gunman attacks two mosques in Christchurch, New Zealand, killing 51 people and livestreaming part of the attack. Before opening fire, he told viewers to subscribe to PewDiePie", windowHours: 3 },   // 22:00 EDT, until the expanded one below replaces it
  { ms: Date.UTC(2019, 2, 15, 5, 0, 0), label: "", text: "Mar 14 - A gunman attacks two mosques in Christchurch, New Zealand, killing 51 people and livestreaming part of the attack. Before opening fire, he told viewers to subscribe to PewDiePie. PewDiePie has stated that he feels \"absolutely sickened having my name uttered by this person\"", windowHours: 72 },   // Mar 15 1:00 EDT
  { ms: Date.UTC(2019, 2, 16, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 17, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 18, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 18, 21, 0, 0), label: "", text: "Mar 18 - PewDiePie and T-Series reach 90 million subscribers", windowHours: 144 },
  { ms: Date.UTC(2019, 2, 19, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 20, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 20, 20, 0, 0), label: "", text: "Mar 20 - T-Series passed PewDiePie by 11.2k subscribers", windowHours: 20 },
  { ms: Date.UTC(2019, 2, 21, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 21, 4, 0, 0), label: "", text: "Holi festival in India + the release of PM Narendra Modi Trailer are significantly boosting T-Series's subscriber growth", windowHours: 24 },   // 0:00 EDT
  { ms: Date.UTC(2019, 2, 21, 20, 0, 0), label: "", text: "Mar 21 - T-Series passed PewDiePie for 12 hours and was 34k subscribers ahead", windowHours: 48 },
  { ms: Date.UTC(2019, 2, 22, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 22, 18, 30, 0), label: "", text: "Mar 22 - PewDiePie uploads \"Reacting to Tseries passing Live\"", windowHours: 72 },   // 14:30 EDT
  { ms: Date.UTC(2019, 2, 23, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21, Mar 22", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 24, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21, Mar 22", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 25, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21, Mar 22, Mar 24", windowHours: 24, passInfo: true },
  { ms: Date.UTC(2019, 2, 28, 6, 0, 0), label: "", text: "T-Series has been ahead of PewDiePie for over 24 hours", windowHours: 18 },
  { ms: Date.UTC(2019, 2, 29, 0, 0, 0), label: "", text: "T-Series has been ahead of PewDiePie since Mar 27", windowHours: 72 },
  { ms: Date.UTC(2019, 2, 30, 18, 0, 0), label: "", text: "Mar 30 - PewDiePie uploads \"We lost (not happy)\"", windowHours: 72 },   // 14:00 EDT
  { ms: Date.UTC(2019, 2, 31, 22, 0, 0), label: "", text: "Mar 31 - PewDiePie uploads \"Congratulations\"", windowHours: 144 },
  { ms: Date.UTC(2019, 3, 1, 15, 0, 0), label: "", text: "Apr 1 - PewDiePie regains the lead", windowHours: 1000 },
  { ms: Date.UTC(2019, 3, 6, 18, 0, 0), label: "", text: "Apr 6 - PewDiePie uploads \"Congratulations, but to whom?\"", windowHours: 72 },   // 14:00 EDT
  { ms: Date.UTC(2019, 3, 7, 2, 0, 0), label: "", text: "Apr 6 - PewDiePie is 500k ahead of T-Series", windowHours: 336 },
  { ms: Date.UTC(2019, 3, 7, 10, 45, 0), label: "", text: "Apr 7 - T-Series releases Har Ghoont Mein Swag", windowHours: 48 },   // 6:45 EDT
  { ms: Date.UTC(2019, 3, 7, 12, 0, 0), label: "", text: "Apr 7 - T-Series releases Vaaste", windowHours: 48 },   // 8:00 EDT
  { ms: Date.UTC(2019, 3, 8, 5, 30, 0), label: "", text: "Apr 8 - T-Series releases Kabir Singh Official Teaser", windowHours: 48 },   // 1:30 EDT
  { ms: Date.UTC(2019, 3, 11, 2, 0, 0), label: "", text: "PewDiePie's two disstracks have been banned in India due to an injunction order by the Indian High Court", windowHours: 96 },
  { ms: Date.UTC(2019, 3, 12, 4, 30, 0), label: "", text: "Apr 12 - T-Series releases De De Pyaar De and SURMA KAALA", windowHours: 48 },   // 0:30 EDT
  { ms: Date.UTC(2019, 3, 14, 11, 0, 0), label: "", text: "Apr 14 - T-Series takes the lead again", windowHours: 1000 },
  { ms: Date.UTC(2019, 3, 14, 11, 0, 0), label: "", text: "T-Series's subscriber growth greatly increased on Apr 14 due to a collaboration with Pepsi being displayed on the front page of YouTube in India", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 19, 4, 0, 0), label: "", text: "Apr 19 - T-Series releases Slowly Slowly with Pitbull", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 22, 10, 0, 0), label: "", text: "Apr 22 - T-Series releases BHARAT trailer", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 25, 10, 0, 0), label: "", text: "Apr 25 - T-Series releases BHARAT: Slow Motion Song", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 26, 20, 0, 0), label: "", text: "Apr 26 - T-Series leads PewDiePie by 1,000,000 subscribers", windowHours: 600 },
  { ms: Date.UTC(2019, 3, 28, 20, 0, 0), label: "", text: "Apr 28 - PewDiePie announces the end of the \"Subscribe to Pewdiepie\" meme", windowHours: 600 },
  { ms: Date.UTC(2019, 3, 29, 16, 0, 0), label: "", text: "Apr 29 - \"International PewDiePie Day\" is celebrated", windowHours: 48 },   // Apr 29 12:00 EDT
  { ms: Date.UTC(2019, 4, 29, 10, 0, 0), label: "", text: "May 29 - T-Series reaches 100M subscribers", windowHours: 6000 },   // May 29 06:00 EDT
];

// Promotion summaries are hidden before this date regardless of entries.
export const PROMO_DISPLAY_START_MS = Date.UTC(2018, 10, 1, 0, 0, 0); // Nov 1 2018 00:00 UTC

// Channel promotion events.
// channel: 'pdp' = PewDiePie, 'ts' = T-Series
// If T-Series has no promotions in the last 2 days the block is hidden entirely.
// If PewDiePie has none it says "PewDiePie has received no promotions lately" - unless
// neither channel has had a promotion in the last 7 days, then nothing is shown.
export const FLARE_PROMOTIONS = [
  // ── PewDiePie ──────────────────────────────────────────────────────────────
  { ms: Date.UTC(2018,  9, 26, 21,  0, 0), channel: 'pdp', by: 'MrBeast' },          // Oct 26  5PM EDT
  { ms: Date.UTC(2018, 10,  2, 18,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },    // Nov  2  2PM EDT
  { ms: Date.UTC(2018, 10,  6, 23,  0, 0), channel: 'pdp', by: 'FBE' },              // Nov  6  6PM EST
  { ms: Date.UTC(2018, 10, 11, 14,  0, 0), channel: 'pdp', by: 'Saiman Says' },      // Nov 11  9AM EST
  { ms: Date.UTC(2018, 10, 19, 23,  0, 0), channel: 'pdp', by: 'CaptainSparklez' },  // Nov 19  6PM EST
  { ms: Date.UTC(2018, 10, 25, 17,  0, 0), channel: 'pdp', by: 'Leo Otaco' },        // Nov 25 12PM EST
  { ms: Date.UTC(2018, 10, 25, 22,  0, 0), channel: 'pdp', by: 'MrBeast' },          // Nov 25  5PM EST
  { ms: Date.UTC(2018, 10, 27,  0,  0, 0), channel: 'pdp', by: 'DramaAlert' },       // Nov 26  7PM EST
  { ms: Date.UTC(2018, 10, 28, 13,  0, 0), channel: 'pdp', by: 'Davie504' },         // Nov 28  8AM EST
  { ms: Date.UTC(2018, 10, 30, 23,  0, 0), channel: 'pdp', by: 'Justin Roberts' },   // Nov 30  6PM EST
  { ms: Date.UTC(2018, 11,  1, 21,  0, 0), channel: 'pdp', by: 'Ninja' },            // Dec  1  4PM EST
  { ms: Date.UTC(2018, 11,  2, 18,  0, 0), channel: 'pdp', by: 'jacksepticeye' },    // Dec  2  1PM EST
  { ms: Date.UTC(2018, 11,  2, 19,  0, 0), channel: 'pdp', by: 'Dawko' },            // Dec  2  2PM EST
  { ms: Date.UTC(2018, 11,  2, 22,  0, 0), channel: 'pdp', by: 'Markiplier' },       // Dec  2  5PM EST
  { ms: Date.UTC(2018, 11,  2, 22,  0, 0), channel: 'pdp', by: 'boogie2988' },       // Dec  2  5PM EST
  { ms: Date.UTC(2018, 11,  6, 23,  0, 0), channel: 'pdp', by: 'Logan Paul Vlogs' }, // Dec  6  6PM EST
  { ms: Date.UTC(2018, 11, 10, 23,  0, 0), channel: 'pdp', by: 'Miniminter' },       // Dec 10  6PM EST
  { ms: Date.UTC(2018, 11, 11, 22,  0, 0), channel: 'pdp', by: 'TGFBro' },           // Dec 11  5PM EST
  { ms: Date.UTC(2018, 11, 16, 22,  0, 0), channel: 'pdp', by: 'MrBeast' },
  { ms: Date.UTC(2018, 11, 17,  3,  0, 0), channel: 'pdp', by: 'ERB2' },             // Dec 16 10PM EST
  { ms: Date.UTC(2018, 11, 17, 13,  0, 0), channel: 'pdp', by: 'FavijTV' },          // Dec 17  8AM EST
  { ms: Date.UTC(2018, 11, 18, 22,  0, 0), channel: 'pdp', by: 'JuegaGerman' },       
  { ms: Date.UTC(2018, 11, 19, 21,  0, 0), channel: 'pdp', by: 'QuackityHQ' },         
  { ms: Date.UTC(2019, 0, 20, 15,  0, 0), channel: 'pdp', by: 'Davie504' },           
  { ms: Date.UTC(2019, 0, 20, 21,  0, 0), channel: 'pdp', by: 'Andrei Terbea' },        
  { ms: Date.UTC(2019, 0, 21, 22,  0, 0), channel: 'pdp', by: 'Dude Perfect' },         
  { ms: Date.UTC(2019, 0, 21, 23,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },         
  { ms: Date.UTC(2019, 0, 24, 0,  0, 0), channel: 'pdp', by: 'JuegaGerman' },            
  { ms: Date.UTC(2019, 1, 3, 17,  0, 0), channel: 'pdp', by: 'DramaAlert' },              
  { ms: Date.UTC(2019, 1, 3, 19,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },              
  { ms: Date.UTC(2019, 1, 4, 23,  0, 0), channel: 'pdp', by: 'MrBeast' },                    
  { ms: Date.UTC(2019, 1, 6, 14,  0, 0), channel: 'pdp', by: 'OneLeDay' },                    
  { ms: Date.UTC(2019, 1, 9, 20,  0, 0), channel: 'pdp', by: 'Jesus Christ' },                       
  { ms: Date.UTC(2019, 1, 10, 20,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },                       
  { ms: Date.UTC(2019, 1, 13, 17,  0, 0), channel: 'pdp', by: 'jacksepticeye' },                        
  { ms: Date.UTC(2019, 1, 15, 23,  0, 0), channel: 'pdp', by: 'LubaTV' },                            
  { ms: Date.UTC(2019, 1, 20, 21,  0, 0), channel: 'pdp', by: 'Philip DeFranco' },                   
  { ms: Date.UTC(2019, 1, 22, 4,  0, 0), channel: 'pdp', by: 'Mini Ladd' },                        
  { ms: Date.UTC(2019, 1, 22, 4,  0, 0), channel: 'pdp', by: 'ItsYeBoi' },                          
  { ms: Date.UTC(2019, 2, 1, 18,  0, 0), channel: 'pdp', by: 'KSI' },                               
  { ms: Date.UTC(2019, 2, 2, 22,  0, 0), channel: 'pdp', by: 'jacksfilms' },                                
  { ms: Date.UTC(2019, 2, 3, 22,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },
  { ms: Date.UTC(2019, 2, 4, 12,  0, 0), channel: 'pdp', by: 'Captain India' },
  { ms: Date.UTC(2019, 2, 5, 22,  0, 0), channel: 'pdp', by: 'REACT' },
  { ms: Date.UTC(2019, 2, 11, 22,  0, 0), channel: 'pdp', by: 'Voce Sabia?' },                                  
  { ms: Date.UTC(2019, 2, 14, 20,  0, 0), channel: 'pdp', by: 'h3h3 Productions' },                                 
  { ms: Date.UTC(2019, 2, 19, 14,  0, 0), channel: 'pdp', by: 'RedhoodVN' },                     
  { ms: Date.UTC(2019, 2, 20, 22,  0, 0), channel: 'pdp', by: 'Michou' },                                
  { ms: Date.UTC(2019, 2, 22, 22,  0, 0), channel: 'pdp', by: 'Bigorneaux & Coquillages' },                                            
  { ms: Date.UTC(2019, 2, 23, 15,  0, 0), channel: 'pdp', by: 'RedhoodVN' },                                     
  { ms: Date.UTC(2019, 2, 23, 17,  0, 0), channel: 'pdp', by: 'Farod Games' },                                   
  { ms: Date.UTC(2019, 2, 25, 16,  0, 0), channel: 'pdp', by: 'Alan Walker' },                               
  { ms: Date.UTC(2019, 3, 1, 16,  0, 0), channel: 'pdp', by: 'Kwebbelkop' },                               
  { ms: Date.UTC(2019, 3, 5, 22,  0, 0), channel: 'pdp', by: 'FBE' },                                       
  { ms: Date.UTC(2019, 3, 8, 14,  0, 0), channel: 'pdp', by: 'Slimecicle' },                                    
  { ms: Date.UTC(2019, 3, 23, 23,  0, 0), channel: 'pdp', by: 'Jake Paul' },       

  // ── T-Series ───────────────────────────────────────────────────────────────
  { ms: Date.UTC(2018, 10,  10, 22,  0, 0), channel: 'ts',  by: 'JusReign' },  
  { ms: Date.UTC(2018, 11,  4, 16,  0, 0), channel: 'ts',  by: 'Mumbiker Nikhil' },  // Dec  4 11AM EST
  { ms: Date.UTC(2019, 0,  1, 16,  0, 0), channel: 'ts',  by: 'CarryMinati' },  
  { ms: Date.UTC(2019, 1,  13, 14,  0, 0), channel: 'ts',  by: 'Bakchodi Wala Tech' },  
  { ms: Date.UTC(2019, 1,  13, 15,  0, 0), channel: 'ts',  by: 'Sirf True' },  
  { ms: Date.UTC(2019, 1,  18, 20,  0, 0), channel: 'ts',  by: 'CarryIsLive' },  
  { ms: Date.UTC(2019, 1,  19, 20,  0, 0), channel: 'ts',  by: 'Dynamo Gaming' },   
  { ms: Date.UTC(2019, 1,  23, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },   
  { ms: Date.UTC(2019, 2,  2, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },   
  { ms: Date.UTC(2019, 2,  3, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },   
  { ms: Date.UTC(2019, 2,  4, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },   
  { ms: Date.UTC(2019, 2,  5, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },   
  { ms: Date.UTC(2019, 2,  8, 16,  0, 0), channel: 'ts',  by: 'Sirf True' },   
  { ms: Date.UTC(2019, 2,  9, 16, 22, 0), channel: 'ts',  by: 'MaximilianMus' },
];

// ── ALT SCENARIO ONLY ────────────────────────────────────────────────────────
// Shown only when the AltScen flag is on. From the Alt Scenario start (Apr 11 2019
// 12:00 EDT = 16:00 UTC) these REPLACE the real entries above; real entries dated
// earlier still show. Same shapes as FLARE_NEWS_ENTRIES / FLARE_PROMOTIONS.
export const ALT_NEWS_ENTRIES = [
  { ms: Date.UTC(2019, 3, 12, 4, 30, 0), label: "", text: "Apr 12 - T-Series releases De De Pyaar De and SURMA KAALA", windowHours: 48 },   // 0:30 EDT
  { ms: Date.UTC(2019, 3, 14, 11, 0, 0), label: "", text: "T-Series's subscriber growth greatly increased on Apr 14 due to a collaboration with Pepsi being displayed on the front page of YouTube in India", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 19, 4, 0, 0), label: "", text: "Apr 19 - T-Series releases Slowly Slowly with Pitbull", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 22, 10, 0, 0), label: "", text: "Apr 22 - T-Series releases BHARAT trailer", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 25, 10, 0, 0), label: "", text: "Apr 25 - T-Series releases BHARAT: Slow Motion Song", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 29, 14, 0, 0), label: "", text: "Apr 29 - \"International PewDiePie Day\" is celebrated", windowHours: 48 },
  { ms: Date.UTC(2019, 4, 9, 19, 0, 0), label: "", text: "May 9 - PewDiePie and T-Series reach 98M subscribers within 5 seconds of each other", windowHours: 48 },
  { ms: Date.UTC(2019, 4, 15, 10, 0, 0), label: "", text: "May 15 - T-Series uploads a video asking people to subscribe", windowHours: 48 },
  { ms: Date.UTC(2019, 4, 19, 6, 0, 0), label: "", text: "PewDiePie is predicted to hit 100M today", windowHours: 12 },
  { ms: Date.UTC(2019, 4, 19, 18, 0, 0), label: "", text: "May 19 - PewDiePie reaches 100M", windowHours: 6000 },
  { ms: Date.UTC(2019, 4, 21, 21, 0, 0), label: "", text: "May 21 - T-Series reaches 100M", windowHours: 6000 },
  { ms: Date.UTC(2019, 5, 6, 15, 0, 0), label: "", text: "June 6 - T-Series takes the lead", windowHours: 6000 },
];

export const ALT_PROMOTIONS = [                                   
  { ms: Date.UTC(2019, 3, 11, 18,  0, 0), channel: 'pdp', by: 'Aleksander' },  
  { ms: Date.UTC(2019, 3, 12, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },  
  { ms: Date.UTC(2019, 3, 13, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },  
  { ms: Date.UTC(2019, 3, 14, 18,  0, 0), channel: 'pdp', by: 'Aleksander' },  
  { ms: Date.UTC(2019, 3, 15, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },  
  { ms: Date.UTC(2019, 3, 16, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },
  { ms: Date.UTC(2019, 3, 17, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },
  { ms: Date.UTC(2019, 3, 18, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },   
  { ms: Date.UTC(2019, 3, 19, 19,  0, 0), channel: 'pdp', by: 'JackSucksAtLife' },         
  { ms: Date.UTC(2019, 3, 19, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },   
  { ms: Date.UTC(2019, 3, 20, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },      
  { ms: Date.UTC(2019, 3, 21, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },    
  { ms: Date.UTC(2019, 3, 22, 2,  0, 0), channel: 'pdp', by: 'Skeppy' },            
  { ms: Date.UTC(2019, 3, 22, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },      
  { ms: Date.UTC(2019, 3, 23, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },                              
  { ms: Date.UTC(2019, 3, 23, 23,  0, 0), channel: 'pdp', by: 'Jake Paul' },         
  { ms: Date.UTC(2019, 3, 24, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },
  { ms: Date.UTC(2019, 3, 25, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },     
  { ms: Date.UTC(2019, 3, 26, 0,  0, 0), channel: 'pdp', by: 'Technoblade' },         
  { ms: Date.UTC(2019, 3, 26, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },
  { ms: Date.UTC(2019, 3, 27, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },          
  { ms: Date.UTC(2019, 3, 28, 2,  0, 0), channel: 'pdp', by: 'JuegaGerman' },  
  { ms: Date.UTC(2019, 3, 29, 18,  0, 0), channel: 'pdp', by: 'Aleksander' },    
  { ms: Date.UTC(2019, 3, 29, 18,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },  
  { ms: Date.UTC(2019, 3, 30, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },     
  { ms: Date.UTC(2019, 4, 4, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },      
  { ms: Date.UTC(2019, 4, 5, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },       
  { ms: Date.UTC(2019, 4, 6, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 7, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 8, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 9, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 10, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 11, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },    
  { ms: Date.UTC(2019, 4, 12, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 13, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 14, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },         
  { ms: Date.UTC(2019, 4, 15, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },         
  { ms: Date.UTC(2019, 4, 16, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 17, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },        
  { ms: Date.UTC(2019, 4, 18, 21,  0, 0), channel: 'pdp', by: 'Aleksander' },  
  { ms: Date.UTC(2019, 4, 19, 15,  0, 0), channel: 'pdp', by: 'Aleksander' },     
  { ms: Date.UTC(2019, 4, 19, 15,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },       
  // ── T-Series ───────────────────────────────────────────────────────────────  
  { ms: Date.UTC(2019, 3,  18, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },   
  { ms: Date.UTC(2019, 3,  20, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },    
  { ms: Date.UTC(2019, 3,  28, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },  
  { ms: Date.UTC(2019, 4,  5, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },    
  { ms: Date.UTC(2019, 4,  11, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },    
  { ms: Date.UTC(2019, 4,  13, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },    
  { ms: Date.UTC(2019, 4,  14, 12,  0, 0), channel: 'ts',  by: 'Sirf True' },                         
];
