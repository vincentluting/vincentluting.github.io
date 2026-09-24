---
title: "Cutting vendor ticket resolution from 18 days to 8 across four European marketplaces"
summary: "Vendors on Amazon were waiting weeks for answers. I used my own SQL analysis to find out why, rebuilt how tickets were handled, and wrote the process down. It stayed in use after I left."
company: Amazon
role: Vendor Service Consultant
period: 2019 – 2021
order: 2
job: amazon
tldr:
  context: "External vendors selling on Amazon in Europe raised support tickets for problems with their products and listings. Too many tickets took too long, and many came back again."
  myRole: "I did the analysis, proposed the new way of working, and rolled it out with the teams handling the tickets."
  team: "Vendor service teams across four European marketplaces."
  stakeholders: "External vendors, internal operations teams, and my manager, who had to approve the change."
  numbers:
    - value: "18 → 8"
      label: days to resolve 90% of tickets (TP90)
    - value: "−21%"
      label: tickets coming in
    - value: "4"
      label: European marketplaces
  skills:
    - SQL analysis
    - Process design
    - Vendor management
    - SOPs and training
---

<!-- TODO(Vincent): Claude drafted this from your CV. Facts from the CV: own SQL analysis, ticket handling rebuilt across 4 European marketplaces, TP90 from 18 to 8 days, inflow down 21%, SOP stayed in use after you left. Also from the CV: 10+ vendors advised, Amazon.nl launch with 2 web tools and SOPs, 10+ new hires trained. Everything else is a guess and marked with TODO. -->

## The situation

At Amazon I worked with external vendors: companies that sell their products to Amazon, which then sells them to customers. When something went wrong with their products, prices or listings, they opened a ticket, and teams like mine had to solve it.

The problem was time. For 90% of tickets to be resolved took around 18 days. For a vendor that is a long time. A wrong listing or a blocked product can mean weeks of lost sales, and a vendor who waits that long stops trusting you.

It was also the time when Amazon was getting ready to launch its Dutch marketplace, Amazon.nl. I was part of that work too: I helped build two web tools and the standard operating procedures (SOPs) for choosing which products to offer and removing defects. More vendors were coming, so the ticket problem was only going to get bigger.

## The hard part

Everyone had an opinion about why tickets were slow. The vendors were unclear. The tools were bad. There were not enough people. Some of that was true, but nobody had actually looked at the data across all four marketplaces together.

The second problem was that the teams worked in different ways. Each marketplace had built its own habits. Changing that meant asking experienced people to work differently, and that only works if they believe the change is better.

## What I did

**I looked at the data myself.** I wrote SQL queries on the ticket data to see where the time went: which types of tickets took longest, where they waited, and which ones came back after being closed. <!-- TODO(Vincent): what did you find? E.g. a few ticket types causing most of the delay, or tickets bouncing between teams? The real finding would make this story much stronger. -->

**I focused on the tickets that should never exist.** A large part of the inflow was the same problems again and again. <!-- TODO(Vincent): confirm, and give an example. --> Fixing the cause, or giving vendors a clear answer the first time, was better than handling the same ticket faster.

**I redesigned the flow and wrote it down.** I proposed a new way to sort and handle tickets and wrote it as an SOP, with clear steps that any new team member could follow. <!-- TODO(Vincent): what were the main changes? Routing, templates, ownership, escalation rules? -->

**I rolled it out with the teams, not to them.** I trained people in the four marketplaces and adjusted the process based on their feedback. I had trained more than ten new hires by then, so I knew how to explain a process so it sticks.

## What came out of it

The time to resolve 90% of tickets went from 18 days to 8. The number of tickets coming in dropped by 21%, because more problems were solved properly the first time.

The SOP stayed in use after I left Amazon. For me that is the real test of a process change: it keeps working when the person who designed it is gone.

## What I would do differently

<!-- TODO(Vincent): this reflection is Claude's guess. Replace it with what you really learned. -->

I would share the data with the teams earlier. Once people saw the numbers, the discussion changed from opinions to facts, and agreement came much faster. If I had shown the analysis in week one instead of presenting a finished proposal, the rollout would have been even smoother.

## Why this matters for the work I want to do next

Supplier and customer projects in high-tech run into the same pattern. Everybody is busy, everybody has a theory, and the real cause is hidden in the data. I like finding it, fixing the process around it, and writing it down so it lasts.
