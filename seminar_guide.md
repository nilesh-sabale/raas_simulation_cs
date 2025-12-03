---
description: Guide for presenting the RaaS Simulation seminar demonstration
---

# RaaS Simulation - Seminar Presentation Guide

## Preparation Checklist (Before Seminar)

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run seed-db` to populate with realistic demo data
- [ ] Run `npm run dev` to start the application
- [ ] Open browser to `http://localhost:5173`
- [ ] Test all three role experiences quickly
- [ ] Have backup screenshots/recordings ready
- [ ] Clear browser cache if needed

## Presentation Flow (15-20 minutes)

### Introduction (2 minutes)

**Opening Hook:**
"Today I'll demonstrate how Ransomware-as-a-Service operates as a criminal business model, showing you three distinct perspectives: the victim experiencing an attack, an affiliate partner who distributes the ransomware, and the core operator who manages the entire infrastructure."

**Educational Disclaimer:**
"This is a completely safe educational simulation. No real files are encrypted, no actual payments are involved, and no genuine security threats exist. Everything you'll see is designed purely for cybersecurity education."

### Part 1: Victim Experience (5 minutes)

**Navigate to:** `http://localhost:5173`

#### Landing Page Demo
1. Point out the professional landing page design
2. Scroll to features section
3. Click "Enter Simulation" or navigate directly to victim portal

**Navigate to:** `http://localhost:5173/victim-portal`

#### Victim Portal Walkthrough
1. **Show the ransomware notice:**
   - Point out the threatening red color scheme
   - Highlight the "FILES ENCRYPTED" message
   - Explain the psychological pressure tactics

2. **Countdown timer:**
   - "Notice the 72-hour countdown creating urgency"
   - "Price doubles if not paid in time - classic pressure tactic"

3. **Encrypted files list:**
   - Scroll through the list of "encrypted" files
   - "See how personal and business-critical files are targeted"
   - "This creates panic and desperation"

4. **Payment instructions:**
   - Show the Bitcoin wallet address
   - Explain cryptocurrency usage for anonymity
   - Point out the specific ransom amount

5. **Simulate payment:**
   - Click "I Have Made Payment"
   - Wait for "processing" simulation (3 seconds)
   - Show the success message and file "decryption"

**Key Talking Points:**
- "This demonstrates why paying ransom is discouraged - you're funding criminal operations"
- "Victims often pay out of desperation, not understanding the broader implications"
- "This is why backups and incident response plans are critical"

### Part 2: Affiliate Experience (6 minutes)

**Navigate to:** `http://localhost:5173/app/affiliate`

Or use the role switcher in the sidebar

#### Affiliate Dashboard Walkthrough
1. **Earnings highlight:**
   - "Affiliates earn 70% of ransom payments - huge financial incentive"
   - Point out the purple professional theme
   - Show total lifetime and monthly earnings

2. **Success metrics:**
   - Success rate (92.3%)
   - Active campaigns
   - Total conversions
   - Leaderboard ranking

3. **Earnings trend chart:**
   - "Shows weekly growth in Bitcoin earnings"
   - "Visual proof of the profitability driving this model"

4. **Commission breakdown:**
   - "70% to affiliate, 20% to operator, 10% for infrastructure"
   - "This revenue split model makes RaaS highly scalable"

5. **Active campaigns:**
   - Show different sectors targeted (Finance, Healthcare, Education)
   - Infection rates and conversion metrics
   - Individual campaign revenue

6. **Leaderboard:**
   - "Gamification encourages competition among affiliates"
   - "Top performers get recognition and potentially better rates"

7. **Payout system:**
   - Click "Request Payout"
   - Show the simulated processing
   - "This makes it easy for affiliates to cash out regularly"

**Key Talking Points:**
- "The affiliate model allows ransomware operators to scale massively without directly distributing malware"
- "Affiliates handle the risky work of infecting systems"
- "This business structure mirrors legitimate affiliate marketing - which is disturbing"

### Part 3: Operator/Developer Experience (5 minutes)

**Navigate to:** `http://localhost:5173/app/dashboard`

Or use role switcher to select "Operator"

#### Operator Dashboard Walkthrough
1. **Overview statistics:**
   - Total campaigns across all affiliates
   - Total revenue accumulation
   - Success rates across the platform
   - Network uptime metrics

2. **Real-time monitoring:**
   - Activity feed showing live events
   - Payment notifications
   - Campaign status updates

3. **Charts and analytics:**
   - Campaign activity over 24 hours
   - Revenue distribution pie chart
   - Geographic spread (if shown)

4. **Other operator features (if time permits):**
   - Navigate to Campaigns (`/app/campaigns`)
   - Show campaign creation workflow
   - Navigate to Payments (`/app/payments`)
   - Display payment tracking table

**Key Talking Points:**
- "Operators stay isolated from actual attacks"
- "They provide infrastructure, handle payments, manage affiliates"
- "This separation makes attribution and prosecution difficult"
- "The green command-center aesthetic reflects their control position"

### Conclusion & Q&A (2-3 minutes)

**Summary:**
"You've now seen all three perspectives in the RaaS ecosystem:
1. **Victims** face psychological pressure and data loss
2. **Affiliates** are financially motivated distributors
3. **Operators** run the business with minimal risk

This business model has made ransomware one of the most profitable cybercrimes."

**Defense Strategies to Mention:**
- Regular, offline backups
- Multi-factor authentication
- Security awareness training
- Incident response planning
- Never pay ransoms (funds criminal operations)
-Network segmentation
- Endpoint detection and response (EDR) tools

**Open for Questions**

## Technical Notes

### If Something Goes Wrong

**Application won't start:**
```bash
# Kill any existing process on port 3000 or 5173
# Restart: npm run dev
```

**Database issues:**
```bash
npm run seed-db
```

**Role not switching:**
- Use the sidebar role selector
- Or manually navigate to the specific URL

### Demo Mode (Future Feature)
If demo mode is enabled:
- Automatic activity generation every 3-5 seconds
- Live updates without manual interaction
- Great for background display during discussions

## Backup Plan

If live demo fails:
- Have screenshots of each major screen ready
- Record a video walkthrough beforehand
- Explain the architecture using diagrams

## Post-Presentation Resources

Share with audience:
- GitHub repository (if public)
- Documentation about RaaS threat landscape
- CISA/FBI ransomware guidance
- Recommended security frameworks (NIST, CIS Controls)

## Advanced Questions to Prepare For

1. **"How do real RaaS operations differ from this simulation?"**
   - Real operations use actual encryption (AES, RSA)
   - Double extortion (encryption + data exfiltration)
   - More sophisticated C2 infrastructure
   - Payment negotiations and customer support

2. **"What are law enforcement doing about this?"**
   - International cooperation (FBI, Europol, Interpol)
   - Takedown operations (e.g., REvil, Conti)
   - Cryptocurrency tracking and seizures
   - Indictments of operators and affiliates

3. **"Why don't companies pay the ransom?"**
   - Funding criminal operations
   - No guarantee of decryption
   - Potential for repeat attacks
   - Legal and regulatory concerns
   - Becomes target for other attackers

4. **"How much money do ransomware groups make?"**
   - Billions annually across the industry
   - Individual attacks: $10K to $40M+ ransoms
   - Average payment around $200K-$500K
   - Only 20-40% of victims actually pay

## Timing Adjustments

**If running short on time:**
- Skip detailed navigation within each role
- Focus on victim → affiliate → operator flow
- Use screenshots for operator section

**If have extra time:**
- Demonstrate the settings and role switcher
- Show the network visualization page
- Discuss the technical implementation
- Live code walkthrough of a feature

## Energy and Delivery Tips

- **Enthusiasm:** Show genuine interest in the cybersecurity topic
- **Clarity:** Speak clearly about technical terms
- **Pacing:** Don't rush - let the visuals sink in
- **Interaction:** Ask rhetorical questions to engage audience
- **Context:** Relate to real-world ransomware news (Change Healthcare, Colonial Pipeline, etc.)

## Follow-Up Materials

Consider creating:
- One-page handout with key RaaS facts
- List of defensive resources
- Architecture diagram of RaaS model
- Timeline of major ransomware attacks

Good luck with your seminar! 🎓🔒
