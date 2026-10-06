---
title: "Building my own career test, from the first question to the last line of code"
shortTitle: "Building my own career test"
summary: "My MBA thesis became a live product: a career assessment with 147 questions and 30 career archetypes I designed myself, plus an AI coach that works from your own results. I did everything, which taught me a lot about scope."
company: Deep Dive · University of Amsterdam
role: Founder and builder, MBA thesis
period: 2025 – 2026
order: 6
links:
  - label: Try it at deepdivecareer.com
    href: https://www.deepdivecareer.com
tldr:
  context: "Most career tests give you a label and stop there, and few of them ask about the cross-cultural side of who you are."
  myRole: "Everything: research, questionnaire, scoring model, product design, code and launch."
  team: "Just me, with feedback from test users and my thesis supervisor."
  stakeholders: "Test users, my MBA programme at the University of Amsterdam."
  numbers:
    - value: "147"
      label: assessment questions
    - value: "30"
      label: original career archetypes
    - value: "2"
      label: languages, English and Chinese
  skills:
    - Product design
    - Next.js and TypeScript
    - PostgreSQL
    - Claude API
    - Psychometrics
---

## The problem

I have taken a lot of career tests. Most of them give you a label and stop there. You are an "INTJ" or a "Builder", and then what?

As someone who moved from China to the Netherlands, I also noticed that they rarely ask about the cross-cultural side of who you are. For me that was the biggest factor in every career decision I made. So for my MBA thesis in AI, Data and Analytics at the University of Amsterdam, I decided to build something that goes further and helps you decide what to do next.

## What I built

**A questionnaire with 147 questions.** It covers personality, what kind of work you are interested in, how you think, and your cross-cultural identity. It draws on well-known frameworks such as Holland RIASEC, the Big Five, Career Anchors, CliftonStrengths, MBTI Step II, DISC and HBDI.

**Thirty career archetypes of my own.** From my research I designed 30 archetypes, in English and Chinese, that describe patterns you can recognise yourself in.

**A scoring pipeline in five layers.** It turns raw answers into a career profile. I wrote down the rules for every layer, so the scoring stays consistent and can be explained.

**An AI coach.** It gives advice based on your own results instead of general tips.

**A real product.** Next.js, TypeScript and PostgreSQL, running on Vercel. Bilingual from day one. <!-- TODO(Vincent): which AI tools helped you write the code, and what did you design and check yourself? One honest sentence here makes the story stronger. -->

## The hard part

Scope. When you are the only person on a project, every idea sounds possible, and there is nobody to say no. The first version of my plan was far too big.

I had to act as my own project manager: write down what "done" means for the thesis, cut features that were nice but not needed, and test with real people early, even when it felt too soon.

## What came out of it

Deep Dive is live at [deepdivecareer.com](https://www.deepdivecareer.com), and it was my thesis for the MBA. <!-- TODO(Vincent): how many people have completed the assessment so far? -->

## What I learned

Building it alone gave me a lot of respect for every engineer and designer I have worked with. It also changed how I work as a project manager. I understand much better what "a small change" costs, why testing with real users matters, and why a clear scope is kind to the people doing the work.
