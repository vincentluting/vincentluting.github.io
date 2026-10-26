---
title: "Our Dutch tickets were slow, and another country had already solved it"
shortTitle: "Slow tickets, and a solution next door"
summary: "At Amazon our Dutch ticket process took more than 18 days against a goal of 14. Before inventing anything new, I looked at how other countries did it. The fix already existed. We brought it to the Netherlands, and within five weeks it took 7.9 days."
company: Amazon
role: Acting SME, catalog team
period: "2020"
order: 1
job: amazon
tldr:
  context: "From week 39 of 2020, the Dutch Andon Cord team needed 18.18 days to close 90% of its tickets (TP90). The goal was 14 days. Assigning tickets, bin checks and prior-pull checks were all done by hand."
  myRole: "I did the benchmark, met the contacts in other countries, wrote the SQL query for the Dutch warehouses and set up the tool. An engineer implemented the automations."
  team: "A software development engineer and the automation contacts, plus contacts in other marketplaces."
  stakeholders: "The Dutch Andon Cord team and the worldwide contacts for these automations."
  numbers:
    - value: "18.18 → 7.9"
      label: days to close 90% of tickets (TP90), weeks 45 to 50 of 2020
      how: "From my promotion document."
    - value: "9 min"
      label: saved per ticket
      how: "1 minute on prior pull, 8 minutes from fully automatic bin checks."
  skills:
    - Benchmarking
    - SQL
    - Working with engineers
    - Process improvement
---

## The situation

In 2020 I worked in Amazon's catalog team in the Netherlands. One of the ticket queues we handled for the Dutch store was called Andon Cord. Every ticket had to be checked and closed by someone on the team.

In the autumn the process got slow. From week 39, it took us 18.18 days to close 90% of the tickets. The goal was 14 days. Everything was done by hand: giving tickets to people, checking the warehouse bins, checking earlier cases.

## First, look around

My first question was simple: is this only our problem, or everybody's?

So I compared our numbers with the US, the big European stores and Turkey. Turkey was the most interesting one. Like the Netherlands, it was a new marketplace, and it had the same 14-day goal. Turkey closed 90% of its tickets in 8 days.

The big difference: other countries already had automations for the steps we did by hand. We just did not use them yet.

## Then, bring it home

I collected what I could about these automations and met the contacts in other countries, so that the Dutch setup would work the same way as theirs. A software engineer and the automation contacts did the implementation with me.

One part did not fit straight away. The Netherlands had a large local selection, and the automatic bin check did not cover all the warehouses we used. I wrote an SQL query to separate the Dutch retail warehouses from the third-party ones, so the automation could cover them. I also set up the skills, agents and profiles in our ticket tool, Zeus.

## What came out of it

With the new workflow, people saved 9 minutes per ticket: 1 minute on the prior-pull check and 8 minutes because the bin checks were now fully automatic. Between week 45 and week 50, the time to close 90% of tickets went from 18.18 days to 7.9 days, well under the goal.

That is five weeks of data, and I do not have the numbers from after that. But I still think about this story when a problem looks new. The best fix was not something I designed. It was something another team had already built, and my job was to notice it and bring it home.
