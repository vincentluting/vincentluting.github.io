---
title: "I was hired to build dashboards on a platform that could not feed them"
shortTitle: "Dashboards on the wrong platform"
summary: "At Philips, through OMD, I was asked to build media dashboards on Amazon Marketing Cloud. It turned out the data we needed had to come from somewhere else. What started as a small idea became four dashboards, built by engineers in India with me as product owner."
company: Philips (via OMD)
role: Analyst (contract via OMD), functional product owner for Amazon Ads dashboards
period: 2021 – 2023
order: 5
job: philips
tldr:
  context: "Employed by OMD and placed in Philips' global Amazon media team. The team wanted better data on its Amazon advertising."
  myRole: "Functional product owner: requirements, roadmap and data flow. Engineers in India built the dashboards. I also wrote SQL on Amazon Marketing Cloud for ad-hoc analyses."
  team: "A small offshore developer team, the analytics lead, and the Amazon media team."
  stakeholders: "Global marketing and media teams at Philips, with Amazon Ads and AWS on the platform side."
  numbers:
    - value: "4"
      label: dashboards delivered by the developer team
  skills:
    - Requirements
    - Working with engineers
    - Root-cause analysis
    - SQL
---

## The situation

From November 2021 I worked in Philips' global Amazon media team. Formally I was employed by OMD, the media agency, on a fixed-term contract. I started as an outsider, working remotely. About three months in, my director pulled me into the team's daily catch-up, and in autumn 2022 OMD extended my contract by twelve months.

My manager hired me to build media dashboards on Amazon Marketing Cloud (AMC), a place where advertisers can analyse their Amazon campaigns.

## The surprise

Soon I found out that AMC could not give us the data in real time. For the dashboards the team wanted, the data had to come from the Amazon Ads APIs instead.

So the plan changed. I worked out the data flow with the developers: pull the Amazon Ads reports from the API on a schedule, and store them in Azure (Delta Lake and Synapse), where the dashboards could read them.

## Product owner, not builder

I did not write the dashboards myself. A small team of engineers in India built them. My job was to understand what the marketing and media people needed, and turn that into something the engineers could build. Two examples were a global media dashboard and a checker for campaign naming rules.

With the analytics lead I planned the AMC roadmap for 2022 and asked for developer time. When the DSP dashboard went live, I wrote the launch email and thanked each person who had helped.

AMC was still useful in other ways. I wrote my own SQL queries on it for quick analyses: customer journeys, audiences, how often people should see an ad, and how people converted around Prime Day. On the customer side I also worked with AWS and Amazon Ads. We explored AWS Clean Rooms, though it stayed an exploration, and I helped test the new Ads API V3 and Amazon Marketing Stream.

## The hard part

At one point the dashboards had data-quality problems, and the business side and IT blamed each other. When I looked closer, both were partly right. Campaigns were often not named according to the rules, and some server scripts failed, so data arrived late.

I explained both causes to both sides and proposed a longer-term fix: two extra data refreshes, an alert when a script failed, a joint clean-up of naming, a small tool to flag wrongly named campaigns, and a quality report. I have no record of how much of it was carried out.

## What came out of it

The developer team delivered four dashboards. When I left in August 2023, a colleague wrote that what "started with a simple idea to optimize SA dashboard" had grown "to such large scale and team". That is the result I am most happy with. I did not build it with my own hands, but I helped it grow.
