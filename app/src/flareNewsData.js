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
export const FLARE_NEWS_ENTRIES = [
  { ms: Date.UTC(2018, 9, 26, 21, 0, 0), label: "Oct 26", text: "MrBeast advertises PewDiePie in a viral video", windowHours: 168 },
  { ms: Date.UTC(2018, 9, 17, 0, 0, 0), label: "", text: "PewDiePie - 20 - 30k subs per day, T-Series - 130k - 150k", windowHours: 237 },
  { ms: Date.UTC(2018, 9, 17, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, however PewDiePie will still be the most subscribed individual", windowHours: 72 },
  { ms: Date.UTC(2018, 9, 20, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, however PewDiePie will still be the most subscribed individual", windowHours: 72 },
  { ms: Date.UTC(2018, 9, 23, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 4 days, however PewDiePie will still be the most subscribed individual", windowHours: 48 },
  { ms: Date.UTC(2018, 9, 25, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 days, however PewDiePie will still be the most subscribed individual", windowHours: 24 },
  { ms: Date.UTC(2018, 9, 26, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 day, however PewDiePie will still be the most subscribed individual", windowHours: 24 },
  { ms: Date.UTC(2018, 9, 27, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 72 },
  { ms: Date.UTC(2018, 9, 30, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 72 },
  { ms: Date.UTC(2018, 10, 2, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 6, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 10, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 weeks, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 14, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 18, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 72 },
  { ms: Date.UTC(2018, 10, 21, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 4 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 48 },
  { ms: Date.UTC(2018, 10, 23, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 48 },
  { ms: Date.UTC(2018, 10, 25, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 day, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24 },
  { ms: Date.UTC(2018, 10, 28, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 week, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24 },
  { ms: Date.UTC(2018, 10, 29, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 4 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24 },
  { ms: Date.UTC(2018, 10, 30, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 3 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24 },
  { ms: Date.UTC(2018, 11, 1, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 2 days, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 24 },
  { ms: Date.UTC(2018, 11, 2, 0, 0, 0), label: "", text: "T-Series is predicted to pass PewDiePie in approximately 1 day, depending on how PewDiePie's gains change, however PewDiePie will still be the most subscribed individual", windowHours: 21 },
  { ms: Date.UTC(2018, 10, 2, 0, 0, 0), label: "", text: "Nov 2 - PewDiePie reaches 69 million subscribers", windowHours: 168 },
  { ms: Date.UTC(2018, 10, 8, 0, 0, 0), label: "", text: "Nov 7 - T-Series reaches 69 million subscribers", windowHours: 96 },
  { ms: Date.UTC(2018, 10, 11, 0, 0, 0), label: "", text: "Nov 10 - PewDiePie reaches 70 million subscribers", windowHours: 168 },
  { ms: Date.UTC(2018, 10, 15, 0, 0, 0), label: "", text: "Nov 14 - T-Series reaches 70 million subscribers", windowHours: 96 },
  { ms: Date.UTC(2018, 11, 2, 21, 0, 0), label: "", text: "Dec 2 - Markiplier does a livestream titled 'I Literally Won't Shut Up Until You Subscribe To PewDiePie', leading to a huge increase in PewDiePie's sub count", windowHours: 96 },
  { ms: Date.UTC(2018, 11, 2, 21, 0, 0), label: "", text: "T-Series was under 20,000 subscribers away from overtaking PewDiePie", windowHours: 96 },
  { ms: Date.UTC(2018, 11, 3, 16, 0, 0), label: "", text: "PewDiePie gained over 540k subscribers on Dec 2", windowHours: 77 },
  { ms: Date.UTC(2018, 11, 11, 23, 0, 0), label: "", text: "Dec 11 - PewDiePie is 1,000,000 subscribers ahead of T-Series", windowHours: 666 },
  { ms: Date.UTC(2018, 11, 14, 4, 0, 0), label: "", text: "YouTube has announced that they will conduct a purge to remove inactive subscribers later today", windowHours: 16 },
  { ms: Date.UTC(2018, 11, 14, 20, 0, 0), label: "", text: "Dec 14 - YouTube removes inactive accounts - PewDiePie: -59k, T-Series: -226k", windowHours: 96 },
  { ms: Date.UTC(2018, 11, 28, 0, 0, 0), label: "", text: "Dec 27 - PewDiePie uploads 'YouTube Rewind 2018 but it's actually good'", windowHours: 144 },
  { ms: Date.UTC(2019, 0, 1, 20, 0, 0), label: "", text: "Jan 1 - CarryMinati uploads 'Bye Pewdiepie'", windowHours: 144 },
  { ms: Date.UTC(2019, 0, 4, 0, 0, 0), label: "", text: "Jan 3 - The subscriber gap drops under 1,000,000'", windowHours: 144 },
  { ms: Date.UTC(2019, 0, 7, 2, 0, 0), label: "", text: "Jan 6 - PewDiePie reaches 80 million subscribers", windowHours: 168 },
  { ms: Date.UTC(2019, 0, 13, 0, 0, 0), label: "", text: "Jan 12 - T-Series reaches 80 million subscribers", windowHours: 96 },
  { ms: Date.UTC(2019, 0, 22, 20, 0, 0), label: "", text: "Jan 22 - PewDiePie uploads 'This is the end...'", windowHours: 72 },
  { ms: Date.UTC(2019, 1, 3, 20, 0, 0), label: "", text: "Feb 3 - PewDiePie livestreams Fortnite", windowHours: 72 },
  { ms: Date.UTC(2019, 1, 10, 20, 0, 0), label: "", text: "Feb 10 - PewDiePie livestreams Roblox", windowHours: 72 },
  { ms: Date.UTC(2019, 1, 13, 18, 0, 0), label: "", text: "Feb 13 - The subscriber gap drops under 10k", windowHours: 96 },
  { ms: Date.UTC(2019, 1, 17, 20, 0, 0), label: "", text: "Feb 17 - PewDiePie livestreams Minecraft", windowHours: 72 },
  { ms: Date.UTC(2019, 1, 22, 22, 0, 0), label: "", text: "T-Series passed PewDiePie for 8 minutes on Feb 22 due to a YouTube audit", windowHours: 168 },
  { ms: Date.UTC(2019, 1, 22, 22, 0, 0), label: "", text: "Feb 22 - Elon Musk hosts Meme Review", windowHours: 168 },
  { ms: Date.UTC(2019, 2, 3, 18, 0, 0), label: "", text: "Mar 3 - T-Series comes within 700 subscribers of passing PewDiePie", windowHours: 72 },
  { ms: Date.UTC(2019, 2, 6, 18, 0, 0), label: "", text: "Mar 6 - T-Series chairman Bhushan Kumar starts #BharatWinsYoutube campaign", windowHours: 96 },
  { ms: Date.UTC(2019, 2, 9, 18, 0, 0), label: "", text: "Mar 9 - T-Series passed PewDiePie for 3 minutes due to a livestream by MaximilianMus", windowHours: 144 },
  { ms: Date.UTC(2019, 2, 11, 23, 0, 0), label: "", text: "Mar 11 - T-Series passed PewDiePie by 7.3k subscribers", windowHours: 144 },
  { ms: Date.UTC(2019, 2, 13, 23, 0, 0), label: "", text: "Mar 13 - T-Series passed PewDiePie by 4.7k subscribers", windowHours: 96 },
  { ms: Date.UTC(2019, 2, 16, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 17, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 18, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 18, 21, 0, 0), label: "", text: "Mar 18 - PewDiePie and T-Series reach 90 million subscribers", windowHours: 144 },
  { ms: Date.UTC(2019, 2, 19, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 20, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 20, 20, 0, 0), label: "", text: "Mar 20 - T-Series passed PewDiePie by 11.2k subscribers", windowHours: 20 },
  { ms: Date.UTC(2019, 2, 21, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 21, 20, 0, 0), label: "", text: "Mar 21 - T-Series passed PewDiePie for 12 hours and was 34k subscribers ahead", windowHours: 48 },
  { ms: Date.UTC(2019, 2, 22, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 23, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21, Mar 22", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 24, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21, Mar 22", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 25, 0, 0, 0), label: "", text: "Dates on which T-Series passed PewDiePie: Feb 22, Mar 9, Mar 11, Mar 13, Mar 15, Mar 17, Mar 18, Mar 19, Mar 20, Mar 21, Mar 22, Mar 24", windowHours: 24 },
  { ms: Date.UTC(2019, 2, 28, 6, 0, 0), label: "", text: "T-Series has been ahead of PewDiePie for over 24 hours", windowHours: 18 },
  { ms: Date.UTC(2019, 2, 29, 0, 0, 0), label: "", text: "T-Series has been ahead of PewDiePie since Mar 27", windowHours: 72 },
  { ms: Date.UTC(2019, 2, 31, 22, 0, 0), label: "", text: "Apr 1 - PewDiePie uploads 'Congratulations'", windowHours: 144 },
  { ms: Date.UTC(2019, 3, 1, 15, 0, 0), label: "", text: "Apr 1 - PewDiePie regains the lead", windowHours: 1000 },
  { ms: Date.UTC(2019, 3, 7, 2, 0, 0), label: "", text: "Apr 6 - PewDiePie is 500k ahead of T-Series", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 7, 2, 0, 0), label: "", text: "PewDiePie's two disstracks have been banned in India due to an injuction order by the Indian High Court", windowHours: 96 },
  { ms: Date.UTC(2019, 3, 14, 11, 0, 0), label: "", text: "Apr 14 - T-Series takes the lead again", windowHours: 1000 },
  { ms: Date.UTC(2019, 3, 14, 11, 0, 0), label: "", text: "T-Series's subscriber growth greatly increased on Apr 14 due to a collaboration with Pepsi being displayed on the front page of YouTube in India", windowHours: 48 },
  { ms: Date.UTC(2019, 3, 26, 20, 0, 0), label: "", text: "Apr 26 - T-Series leads PewDiePie by 1,000,000 subscribers", windowHours: 600 },
  { ms: Date.UTC(2019, 3, 28, 20, 0, 0), label: "", text: "Apr 28 - PewDiePie announces the end of the 'Subscribe to Pewdiepie' meme", windowHours: 600 },
];

// Promotion summaries are hidden before this date regardless of entries.
export const PROMO_DISPLAY_START_MS = Date.UTC(2018, 10, 1, 0, 0, 0); // Nov 1 2018 00:00 UTC

// Channel promotion events.
// channel: 'pdp' = PewDiePie, 'ts' = T-Series
// If T-Series has no promotions in the last 2 days the block is hidden entirely.
// If PewDiePie has none it says "PewDiePie has received no promotions lately".
export const FLARE_PROMOTIONS = [
  // ── PewDiePie ──────────────────────────────────────────────────────────────
  { ms: Date.UTC(2018,  9, 26, 21,  0, 0), channel: 'pdp', by: 'MrBeast' },          // Oct 26  5PM EDT
  { ms: Date.UTC(2018, 10,  2, 18,  0, 0), channel: 'pdp', by: 'VoiceOverPete' },    // Nov  2  2PM EDT
  { ms: Date.UTC(2018, 10,  6, 23,  0, 0), channel: 'pdp', by: 'FBE' },              // Nov  6  6PM EST
  { ms: Date.UTC(2018, 10, 11, 14,  0, 0), channel: 'pdp', by: 'Saiman Says' },      // Nov 11  9AM EST
  { ms: Date.UTC(2018, 10, 25, 22,  0, 0), channel: 'pdp', by: 'MrBeast' },          // Nov 25  5PM EST
  { ms: Date.UTC(2018, 10, 28, 13,  0, 0), channel: 'pdp', by: 'Davie504' },         // Nov 28  8AM EST
  { ms: Date.UTC(2018, 10, 30, 23,  0, 0), channel: 'pdp', by: 'Justin Roberts' },   // Nov 30  6PM EST
  { ms: Date.UTC(2018, 11,  1, 21,  0, 0), channel: 'pdp', by: 'Ninja' },            // Dec  1  4PM EST
  { ms: Date.UTC(2018, 11,  2, 18,  0, 0), channel: 'pdp', by: 'jacksepticeye' },    // Dec  2  1PM EST
  { ms: Date.UTC(2018, 11,  2, 22,  0, 0), channel: 'pdp', by: 'Markiplier' },       // Dec  2  5PM EST
  { ms: Date.UTC(2018, 11,  2, 22,  0, 0), channel: 'pdp', by: 'boogie2988' },       // Dec  2  5PM EST
  { ms: Date.UTC(2018, 11,  6, 23,  0, 0), channel: 'pdp', by: 'Logan Paul Vlogs' }, // Dec  6  6PM EST
  { ms: Date.UTC(2018, 11, 10, 23,  0, 0), channel: 'pdp', by: 'Miniminter' },       // Dec 10  6PM EST
  { ms: Date.UTC(2018, 11, 16, 22,  0, 0), channel: 'pdp', by: 'MrBeast' },
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
  { ms: Date.UTC(2019, 2, 11, 22,  0, 0), channel: 'pdp', by: 'Voce Sabia?' },                                  
  { ms: Date.UTC(2019, 2, 14, 20,  0, 0), channel: 'pdp', by: 'h3h3 Productions' },                                 
  { ms: Date.UTC(2019, 2, 19, 14,  0, 0), channel: 'pdp', by: 'RedhoodVN' },                     
  { ms: Date.UTC(2019, 2, 20, 22,  0, 0), channel: 'pdp', by: 'Michou' },                                
  { ms: Date.UTC(2019, 2, 22, 22,  0, 0), channel: 'pdp', by: 'Bigorneaux & Coquillages' },                                            
  { ms: Date.UTC(2019, 2, 23, 15,  0, 0), channel: 'pdp', by: 'RedhoodVN' },                                     
  { ms: Date.UTC(2019, 2, 23, 17,  0, 0), channel: 'pdp', by: 'Farod Games' },                                   
  { ms: Date.UTC(2019, 2, 25, 16,  0, 0), channel: 'pdp', by: 'Alan Walker' },                                   
  { ms: Date.UTC(2019, 2, 31, 20,  0, 0), channel: 'pdp', by: 'MrBeast' },                                      
  { ms: Date.UTC(2019, 3, 1, 16,  0, 0), channel: 'pdp', by: 'Kwebbelkop' },                                    
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
  { ms: Date.UTC(2019, 2,  9, 18,  0, 0), channel: 'ts',  by: 'MaximilianMus' },
];
