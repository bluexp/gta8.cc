/**
 * Idiomatic English descriptions & guide content keyed by entity ID/slug.
 * Used when locale === "en" (default). Chinese remains in src/data/*.ts.
 */

export const MARKER_DESC_EN: Record<string, string> = {
  "mk-waink-01":
    "Located on the 3rd-floor terrace of the pink neon hotel on Ocean Drive. Climb the rear alley fire escape and scan with WAiNK for a graffiti unlock and \$2,500.",
  "mk-waink-02":
    "At the end of the abandoned fisherman pier south of the Keys Causeway. Easiest to spot after 18:00 when the neon signage lights up. Reach by bike or speedboat.",
  "mk-waink-03":
    "Second-floor walkway corner of the rundown motel off Highway 27. Scanning unlocks a local black-market vendor discount.",
  "mk-waink-04":
    "Hidden next to a stilt shack deep in Grassrivers. Watch out for swamp alligators—approach quickly via airboat.",
  "mk-stunt-01":
    "Hit the marina loading ramp at 220+ km/h (Cheetah Classic or Banshee GTS recommended) to clear the main channel onto the opposite lot.",
  "mk-stunt-02":
    "Natural launch ramp on the collapsed section of the old Keys bridge. Take a 300 m full-throttle run west-to-east to clear the 65 m gap.",
  "mk-stunt-03":
    "Industrial freight ramp launching straight over the railroad overpass. Time your jump to avoid the hourly cargo train.",
  "mk-pkg-01":
    "Submerged ~12 m inside the stern cabin of a sunken coral-reef wreck. Rewards \$15,000 cash and counts toward 100% completion.",
  "mk-pkg-02":
    "Follow the northern dirt trail up to the Mount Kalaga fire lookout tower. The waterproof case sits on the top wooden platform.",
  "mk-mag-01":
    "Sitting on the newsstand outside the retro vinyl shop along Vice Beach boardwalk. Collecting the full set unlocks safehouse neon posters.",
  "mk-mag-02":
    "Inside B2 of the Downtown financial district parking garage near the midnight car-meet corner. Rare tuned coupes often spawn after 22:00.",
  "mk-veh-01":
    "Frequent night spawn in the upscale beach club valet lot. Equipped with Tier-4 anti-theft—bring a signal jammer to avoid a 3-star wanted level.",
  "mk-veh-02":
    "Spawns in the VIP bays north of the Downtown glass supercar showroom. Neon Blue and Carbon Black variants appear most often on weekday mornings.",
  "mk-veh-03":
    "Reliable spawn outside the sheet-metal auto garage on Port Gellhorn's south side. Only Tier-2 security—an easy early-game pickup.",
  "mk-veh-04":
    "Skims across shallow sawgrass flats and mudbanks at high speed. Essential utility craft for Grassrivers 100% exploration.",
  "mk-veh-05":
    "Permanent spawn on the Keys seaplane dock helipad. Amphibious floats let you land directly on water for fast island hopping.",
  "mk-veh-06":
    "Parked at the Ambrosia dirt oval track entrance. Features a reinforced ramming bumper and heavy chassis durability.",
  "mk-heist-01":
    "Major dual-protagonist heist target. Scout the underground HVAC vent and breaker box during prep for a silent \$2.4M+ gross take.",
  "mk-heist-02":
    "Fences stolen watches, jewelry, and rare collectibles, and can be hit as a fast smash-and-grab (\$18k–\$35k take).",
  "mk-heist-03":
    "Armored convoys patrol the coastal causeway daily between 09:00 and 16:00. Blow the rear doors with sticky bombs for quick cash bags.",
  "mk-srv-01":
    "Rotating black-market Gun Van tucked between shipping containers. Stocks the Tactical Carbine Mk II, Sweeper Shotgun, and thermal/suppressor mods.",
  "mk-srv-02":
    "Northern timber-yard supply spot stocking the Heavy Precision Sniper and night-vision optic upgrades.",
  "mk-srv-03":
    "Starter 4-car garage safehouse with wardrobe, weapon locker customization, and quick save.",
  "mk-srv-04":
    "Full neon underglow, turbo tuning, stance suspension, bulletproof tires, and instant wanted-level respray.",
  "mk-srv-05":
    "Free prototype Vice Compact SMG and Tier-3 armor plates inside the abandoned dock warehouse (4 guards—stealth recommended).",
  "mk-wild-01":
    "Highest spawn rate during rain and dawn. Capture a clear wildlife photo for the Leonida Naturalist trophy.",
  "mk-wild-02":
    "Large flamingo flocks gather in the lagoon at golden hour—prime photography spot.",
  "mk-wild-03":
    "Rare nocturnal apex predator along the wooded ridge. Bring a tranquilizer dart or long lens from high ground.",
};

export const VEHICLE_COPY_EN: Record<
  string,
  { summary: string; acquisition: string }
> = {
  "grotti-cheetah-classic": {
    summary:
      "Iconic widebody mid-engine tribute to Vice City heritage with pop-up headlights and razor-sharp coastal highway speed.",
    acquisition:
      "Purchase via Legendary Motorsport or boost at night from the Vice Beach club valet lot using a Signal Jammer (Tier-4 anti-theft).",
  },
  "bravado-banshee-gts": {
    summary:
      "Next-gen widebody V10 track weapon sitting in the S-tier top speed bracket—ideal for stunt jumps and outrunning interceptors.",
    acquisition:
      "Spawns at the Downtown supercar showroom (Tier-5 security requires advanced bypass) or buy at 15% off after the Bay Heist.",
  },
  "declasse-tulip-m100": {
    summary:
      "Classic two-door American muscle with punchy low-end torque, generous trunk storage, and huge tuning potential.",
    acquisition:
      "Common spawn around Port Gellhorn and the south-side repair garage. Tier-2 security makes it an easy starter car.",
  },
  "imponte-dukes-obsidian": {
    summary:
      "Reinforced armored muscle car with slatted windows that blasts straight through police roadblocks with minimal speed loss.",
    acquisition:
      "Win the weekend Ambrosia dirt-track street race to unlock free, or steal directly outside the track gate.",
  },
  "everglade-fanboat": {
    summary:
      "Rear-prop airboat engineered for Grassrivers wetlands—glides over mud, weeds, and shallow water away from alligators.",
    acquisition:
      "Free 24/7 spawn at the Grassrivers southeast dock, or order custom camo liveries via DockTease.",
  },
  "sea-sparrow": {
    summary:
      "Compact twin-seat amphibious helicopter capable of landing on rooftops and open water—the fastest vehicle for map completion.",
    acquisition:
      "Spawns permanently at the Leonida Keys seaplane base, or purchase via Elitás Travel for hangar call-ins.",
  },
  "nagasaki-shinobi-neon": {
    summary:
      "Featherweight superbike with ferocious acceleration and cornering—unmatched for Vice Beach alleys and stunt ramps.",
    acquisition:
      "Complete 5 Vice Beach Stunt Jumps to unlock trade-price purchase at Leonida Moto.",
  },
  "vapid-kalaga-trx": {
    summary:
      "Full-time AWD heavy off-road pickup with high clearance and snorkel intake for Mount Kalaga trails and swamp crossings.",
    acquisition:
      "Spawns frequently at Mount Kalaga Ranger Station and Ambrosia highway fuel stops.",
  },
};

export const WEAPON_COPY_EN: Record<
  string,
  { summary: string; acquisition: string; attachments: string[] }
> = {
  "tactical-carbine-mk2": {
    summary:
      "All-purpose mid-range assault rifle with smooth recoil control. Paired with armor-piercing rounds and a holo sight, it shreds SWAT units.",
    acquisition:
      "Available at the Container Yard Black Market Gun Van or looted from armed convoy guards during the Maze Bank prep.",
    attachments: ["Tactical Suppressor", "Holographic Sight", "45-Rd Extended Mag", "Vertical Foregrip", "AP Rounds"],
  },
  "vice-compact-smg": {
    summary:
      "High-RPM compact SMG usable one-handed from the driver's seat—the undisputed king of drive-by chases and CQB room clearing.",
    acquisition:
      "Loot a free prototype from the Port Gellhorn dockside armory or purchase at Ammu-Nation.",
    attachments: ["Fast-Swap Mag", "Laser Sight", "Compact Suppressor", "Neon Finish"],
  },
  "heavy-precision-sniper": {
    summary:
      "Large-caliber bolt-action anti-materiel rifle capable of disabling helicopter tail rotors and armored truck engines.",
    acquisition:
      "Stocked by the Mount Kalaga Timber Yard Gun Van once Rep Level 15 is reached.",
    attachments: ["Thermal Scope", "Heavy Muzzle Brake", "Armor-Piercing Rounds", "Precision Barrel"],
  },
  "vice-9mm-tactical": {
    summary:
      "Stealth-ready suppressed sidearm with snappy draw speed and crisp headshot accuracy for silent camera and guard takedowns.",
    acquisition:
      "Unlocked automatically in your safehouse weapon locker after the Prologue.",
    attachments: ["Whisper Suppressor", "Tactical Flashlight", "18-Rd Extended Mag", "Chrome Neon Slide"],
  },
  "sweeper-tactical-shotgun": {
    summary:
      "Semi-auto 12-round drum shotgun delivering devastating corridor stopping power against tactical squads and swamp predators.",
    acquisition:
      "Purchase at the Container Yard Gun Van or clear the Grassrivers smuggler camp.",
    attachments: ["12-Rd Drum Mag", "Dragon's Breath Shells", "Weapon Light", "Choke Tube"],
  },
  "compact-emp-launcher": {
    summary:
      "Disables vehicle electronics for 8 seconds without destroying the target—essential for clean armored convoy stops and supercar heists.",
    acquisition:
      "Unlocked permanently at the Gun Van after completing the Armored Convoy ambush side job.",
    attachments: ["Quick-Reload Sling", "Digital Rangefinder"],
  },
};

export const CHEAT_EFFECT_EN: Record<string, string> = {
  "cheat-invincible":
    "Become immune to bullets, explosions, and fall damage for 5 minutes (re-enter to refresh).",
  "cheat-max-health":
    "Instantly restores health and body armor to 100% and repairs your current vehicle.",
  "cheat-lower-wanted":
    "Drops your Wanted Level by 1 star immediately; repeat to clear completely.",
  "cheat-raise-wanted":
    "Adds 1 star to your Wanted Level for high-speed pursuit testing.",
  "cheat-all-weapons":
    "Grants a full loadout of handguns, SMG, rifle, shotgun, sniper, and explosives with extra ammo.",
  "cheat-spawn-super":
    "Drops a fully tuned two-door supercar right in front of your character.",
  "cheat-spawn-heli":
    "Spawns a compact twin-seat attack helicopter for rapid cross-map traversal.",
  "cheat-spawn-moto":
    "Spawns a high-acceleration stunt superbike built for ramp jumps.",
  "cheat-weather":
    "Cycles dynamic Leonida weather: clear sun, tropical rain, neon fog, and hurricane storm.",
  "cheat-moon-gravity":
    "Reduces vehicle and player gravity dramatically for double airtime off stunt jumps.",
  "cheat-super-jump":
    "Hold jump to leap onto low rooftops and reach elevated WAiNK scan points effortlessly.",
  "cheat-slow-aim":
    "Triggers bullet-time while aiming (stacks up to 3 levels; 4th entry toggles off).",
};

export const CHECKLIST_DESC_EN: Record<string, string> = {
  "chk-story-01": "Unlock free roam, Ocean View safehouse garage, and instant dual-protagonist switching.",
  "chk-story-02": "Execute the silent or loud approach and escape via the Keys causeway.",
  "chk-story-03": "Clear fog of war across Vice Beach, Downtown, Keys, Grassrivers, Port Gellhorn, Ambrosia & Mount Kalaga.",
  "chk-col-01": "Scan the limited neon rooftop graffiti in Vice Beach using WAiNK.",
  "chk-col-02": "Located on the south pier off the Keys Causeway (X 1240, Y -850).",
  "chk-col-03": "Scanning also activates the local black-market vendor discount.",
  "chk-col-04": "Dive to the coral-reef shipwreck stern in Leonida Keys to recover the waterproof cash case.",
  "chk-col-05": "Pick up Issue #1 from the boardwalk vinyl-shop newsstand.",
  "chk-stunt-01": "Clear the Starfish Marina shipping channel at 220+ km/h with a clean landing.",
  "chk-stunt-02": "Jump the 65 m collapsed span on the old Leonida Keys bridge.",
  "chk-stunt-03": "Snap a clear wildlife photo of the albino alligator in Grassrivers.",
  "chk-gear-01": "Bypass Tier-4 security at the Vice Beach spawn or buy the Cheetah Classic.",
  "chk-gear-02": "Visit the Black Market Gun Van and install suppressor, AP rounds, and holo optic.",
  "chk-trophy-01": "Complete the flagship vault heist with zero extra alarms and under 5% take loss.",
  "chk-trophy-02": "Complete all story milestones, collectibles, stunt jumps, and wildlife requirements.",
};

export const GUIDE_COPY_EN: Record<
  string,
  {
    category: string;
    summary: string;
    highlights: string[];
    sections: { heading: string; body: string }[];
  }
> = {
  "leonida-heist-optimal-crew": {
    category: "Heist Guide",
    summary:
      "Step-by-step blueprint to keep crew cuts under 11%, bypass infrared sensors, and extract cleanly across the bay.",
    highlights: [
      "Unlock the Port Gellhorn WAiNK scan first to drop the black-market hacker cut from 9% to 5%.",
      "Stage a Sea Sparrow or Everglade Fanboat at the dock to bypass highway police blockades completely.",
      "Use the Compact EMP Launcher on perimeter patrol units so gunfire never damages your cash bags.",
    ],
    sections: [
      {
        heading: "1. Three Mandatory Pre-Heist Recon Points",
        body: "Photograph the northern HVAC duct, basement breaker box, and guard shift roster during scouting. Unlocking the duct skips the lobby shootout and adds 45+ seconds inside the vault.",
      },
      {
        heading: "2. Payout-Maximizing Crew Split",
        body: "Pick a budget 5% gunman carrying an EMP device since stealth avoids open firefights, and invest in a 7%+ elite hacker for an extra 35 seconds of vault looting time.",
      },
    ],
  },
  "vice-city-anti-theft-system": {
    category: "Game Mechanics",
    summary:
      "Why smashing a supercar window in Vice Beach triggers an instant 3-star alert and engine kill-switch—plus how to bypass Tiers 1–5.",
    highlights: [
      "Tier 1–2 (Classic Muscle / Trucks): Traditional window break and hotwire.",
      "Tier 3–4 (Sports & Cheetah Classic): Requires a Key Relay or Signal Jammer or the engine locks in 15 seconds.",
      "Tier 5 (Exotic Supercars like Banshee GTS): Must re-flash the VIN at Vice Customs before storing in a personal garage.",
    ],
    sections: [
      {
        heading: "Where to Get the Signal Jammer Fast",
        body: "Visit the Container Yard Black Market Gun Van (X 420, Y -180) and purchase the reusable Signal Jammer for \$12,000.",
      },
    ],
  },
  "leonida-story-branches": {
    category: "Story Branches",
    summary:
      "Spoiler-safe overview of key dialogue and loot-split decisions that shape the dual-protagonist Trust Meter and true ending.",
    highlights: [
      "Splitting side-heist payouts fairly steadily boosts synergy and unlocks shared slow-motion takedowns.",
      "Choosing 'Cover the Extraction' during the Chapter 3 harbor standoff is required for the everyone-survives true ending.",
    ],
    sections: [
      {
        heading: "Branching Save Tip",
        body: "Keep a dedicated manual save slot before major heist decision boards and track completed branches in the GTA8.cc 100% Checklist.",
      },
    ],
  },
  "vice-city-classic-easter-eggs": {
    category: "Easter Eggs",
    summary:
      "From Ocean View Hotel's iconic pastel neon lobby to a secret 1986 synthwave radio frequency during rainy nights.",
    highlights: [
      "Ocean View Safehouse (X 1350, Y 110) preserves the classic pink-and-cyan art-deco colonnade.",
      "Driving across Starfish Bridge at 02:00 during rain briefly tunes your car radio into a hidden 1986 retro synthwave broadcast.",
    ],
    sections: [
      {
        heading: "Fast Tour Route",
        body: "Toggle Collectibles + Neon Magazines on the interactive map to hit every Vice City throwback along Ocean Drive in one run.",
      },
    ],
  },
};
