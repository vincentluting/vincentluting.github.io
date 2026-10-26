---
title: "From one small dashboard idea to four dashboards for Philips"
shortTitle: "From one idea to four dashboards"
summary: "At Philips, through OMD, I was the product owner for the Amazon advertising dashboards. I turned what the media teams needed into clear requirements, found the right data source, and guided the engineers who built them. One small idea grew into four dashboards and a team."
company: Philips (via OMD)
role: Analyst (contract via OMD), functional product owner for Amazon Ads dashboards
period: 2021 – 2023
order: 3
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

From November 2021 I worked in Philips' global Amazon media team. Formally I was employed by OMD, the media agency, on a fixed-term contract. I started as an outsider, working remotely. About three months in, my director brought me into the team's daily catch-up, and in autumn 2022 OMD extended my contract by twelve months.

My manager hired me to build media dashboards for the team's advertising on Amazon.

## Finding the right data

The first plan was to build the dashboards on Amazon Marketing Cloud (AMC). I found that for real-time data, the Amazon Ads APIs were the better source. So I worked out the data flow with the developers: pull the Amazon Ads reports from the API on a schedule, and store them in Azure (Delta Lake and Synapse), where the dashboards could read them.

## Product owner for the dashboards

A small team of engineers in India built the dashboards. My job was to understand what the marketing and media people needed, and turn that into something the engineers could build. Two examples were a global media dashboard and a checker for campaign naming rules.

With the analytics lead I planned the AMC roadmap for 2022 and asked for developer time. When the DSP dashboard went live, I wrote the launch email and thanked each person who had helped.

## Getting more out of AMC

AMC was still very useful for analysis. I wrote my own SQL queries on it: customer journeys, audiences, how often people should see an ad, and how people converted around Prime Day. On the customer side I also worked with AWS and Amazon Ads. We explored AWS Clean Rooms, and I helped test the new Ads API V3 and Amazon Marketing Stream.

## Finding the real cause

At one point the business side and IT disagreed about why some dashboard data was wrong or late. I looked into it and found two causes: campaigns were often not named according to the rules, and some server scripts failed. I explained both causes to both sides, so both sides could see the full picture.

Then I proposed a longer-term package: two extra data refreshes, an alert when a script failed, a joint clean-up of naming, a small tool to flag wrongly named campaigns, and a quality report.

## What came out of it

The developer team delivered four dashboards. When I left in August 2023, a colleague wrote that what "started with a simple idea to optimize SA dashboard" had grown "to such large scale and team". Another colleague wrote that my work had made "a significant impact on AMC project".

That is the result I am happiest with. I helped a small idea grow into four dashboards and a real team around them.
