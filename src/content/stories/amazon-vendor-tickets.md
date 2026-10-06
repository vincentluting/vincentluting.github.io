---
title: "Why vendors on Amazon waited so long for an answer"
shortTitle: "Why vendors waited so long"
summary: "Vendors on Amazon were waiting weeks for answers. I analysed the tickets myself with SQL, rebuilt how they were handled, and wrote the process down. The time to resolve 90% of tickets went from 18 days to 8, and the process stayed in use after I left."
company: Amazon
role: Vendor Service Consultant
period: 2019 – 2021
order: 1
job: amazon
tldr:
  context: "External vendors selling on Amazon in Europe raised support tickets for problems with their products and listings. Too many tickets took too long, and many came back again."
  myRole: "I did the analysis, proposed the new way of working, and rolled it out with the teams handling the tickets."
  team: "Vendor service teams across four European marketplaces."
  stakeholders: "External vendors, internal operations teams, and my manager, who had to approve the change."
  numbers:
    - value: "18 → 8"
      label: days to resolve 90% of tickets (TP90)
      how: ""
    - value: "−21%"
      label: tickets coming in
      how: ""
    - value: "4"
      label: European marketplaces
      how: ""
  skills:
    - Supplier management
    - Root-cause analysis
    - Process improvement
    - KPIs
    - SQL
---

<!-- TODO(Vincent): Claude drafted this from your CV. Facts from the CV: own SQL analysis, ticket handling rebuilt across 4 European marketplaces, TP90 from 18 to 8 days, inflow down 21%, SOP stayed in use after you left. Also from the CV: 10+ vendors advised, Amazon.nl launch with 2 web tools and SOPs, 10+ new hires trained. Everything else is a guess. The TL;DR "team" line is also a guess. Please confirm each marked sentence, or delete it. -->

## The situation

At Amazon I worked with external vendors: companies that sell their products to Amazon, which then sells them to customers. When something went wrong with their products, prices or listings, they opened a ticket, and teams like mine had to solve it.

The problem was time. It took around 18 days before 90% of tickets were resolved. We called this number TP90. For a vendor that is a long time. A wrong listing or a blocked product can mean weeks of lost sales, and a vendor who waits that long stops trusting you.

It was also the time when Amazon was getting ready to launch its Dutch marketplace, Amazon.nl. I was part of that work too: I helped build two web tools and the standard operating procedures (SOPs) for choosing which products to offer and removing defects. More vendors were coming, so the ticket problem was only going to get bigger.

## The hard part

Nobody had looked at the ticket data across all four marketplaces together. <!-- TODO(Vincent): true? --> Each marketplace also had its own habits, so a change meant asking experienced people to work differently. <!-- TODO(Vincent): true? -->

## What I did

**I looked at the data myself.** I wrote SQL queries on the ticket data to see where the time went: which types of tickets took longest, where they waited, and which ones came back after being closed. <!-- TODO(Vincent): what did you find? E.g. a few ticket types causing most of the delay, or tickets bouncing between teams? The real finding would make this story much stronger. -->

**I focused on the tickets that should never exist.** A large part of the inflow was the same problems again and again. <!-- TODO(Vincent): confirm, and give an example. --> Fixing the cause, or giving vendors a clear answer the first time, was better than handling the same ticket faster.

**I redesigned the flow and wrote it down.** I proposed a new way to sort and handle tickets and wrote it as an SOP, with clear steps that any new team member could follow. <!-- TODO(Vincent): what were the main changes? Routing, templates, ownership, escalation rules? Who approved the change? -->

**I rolled it out with the teams.** I trained people in the four marketplaces and adjusted the process based on their feedback. <!-- TODO(Vincent): true? --> I also trained more than ten new hires at Amazon, so I knew how to explain a process so it sticks.

## What came out of it

The time to resolve 90% of tickets went from 18 days to 8. The number of tickets coming in dropped by 21%, because more problems were solved properly the first time.

The SOP stayed in use after I left Amazon. For me that is the real test of a process change: it keeps working when the person who designed it is gone.
