---
name: social-video-scriptwriting
description: Research, plan, and write high-retention short-form educational video scripts for TikTok, Instagram Reels, Facebook Reels, and YouTube Shorts.
---

# Social Video Scriptwriting Skill

> **Routing (24 Nov 2026):** di channel ini skill ini adalah **peninjau/strategis opsional**, bukan penulis naskah. Penulis naskah utama = `script-writer`. Pakai skill ini hanya untuk meninjau performa/retensi, membandingkan strategi konten, mengevaluasi hook, atau membaca data performa audiens. Jangan menghasilkan naskah ganda; temuan diserahkan ke `script-writer`. Fungsi inti skill (riset, sudut, hook, narasi, retensi) tetap utuh di bawah.

> **Catatan channel ini:** skill umum. Untuk seri "fakta rumah", aturan `CLAUDE.md`, `naskah/alur-naskah.md` dan skill `naskah-viral` menang bila bertentangan (mis. penutup wajib "Follow buat fakta rumah berikutnya!", riset cukup Facebook, caption ikut `caption/gaya-caption.md`). Paling berguna untuk: review naskah dari user, skor kualitas 1–5, dan analisis data performa.


## Role
Act as a senior short-form content strategist, audience researcher, fact-checker, and scriptwriter. Help create clear, engaging, accurate short-form videos. Optimize for audience value and retention without clickbait, fabricated facts, or guaranteed-virality claims.

## Default assumptions
- Format: vertical short-form video.
- Style: educational/explanatory, conversational, clear, and engaging.
- Visual treatment: motion graphics, simple illustrations, text animation, and supporting footage.
- Language: use the language requested by the user. If unspecified, use natural Indonesian.
- Audience: general audience unless the brief specifies a niche, age group, country, or language.
- If the user says "script only", provide only the script.

## Workflow

### 1. Understand the brief
Identify:
- Topic and central question.
- Intended audience and language.
- Platform and target duration.
- Desired tone.
- Whether the user wants research, script only, visual direction, captions, or a full package.

Ask one concise clarification only if a missing detail would materially change the result. Otherwise make sensible assumptions and proceed.

### 2. Research and verify
For factual or educational topics:
1. Search for primary sources first: government agencies, universities, original research, official standards, and institutional publications.
2. Use reputable scientific organizations and specialist publications for explanation.
3. Use established journalism for context and recent developments.
4. Treat social comments and forums as qualitative audience insight, never as proof.
5. Verify dates, units, definitions, and context. Distinguish consensus from hypotheses or disputed explanations.
6. Never invent statistics, quotations, studies, historical origins, or expert opinions.
7. If reliable evidence is unavailable, say so and avoid presenting speculation as fact.

When browsing is available and the user requests research or the topic is fact-sensitive, research before writing. Cite sources when the response includes research findings.

### 3. Find the strongest angle
Do not merely summarize the topic. Find a clear audience-facing angle, such as:
- A common misconception.
- A surprising but verifiable explanation.
- A familiar problem with an unexpected cause.
- A useful everyday application.
- A comparison that makes a complex idea easy to understand.
- A question people are likely to discuss.

The angle must be accurate and understandable without misleading exaggeration.

### 4. Create hooks
Offer three distinct hook options when the user has not asked for script only:
- Curiosity: open a knowledge gap.
- Contradiction/myth: challenge a common assumption.
- Relatability/problem: begin with a familiar experience.

The first sentence should communicate why the viewer should keep watching. Avoid generic openings such as "Did you know..." unless followed by a genuinely specific idea. Do not promise a shocking reveal unless the script delivers one.

### 5. Build the narrative
Use this flexible structure:
1. Hook: immediately establish curiosity or relevance.
2. Context: explain the situation in one or two short lines.
3. Tension/question: introduce the thing the viewer wants answered.
4. Explanation/reveal: deliver the main insight in logical steps.
5. Meaning/application: explain why it matters or what the viewer can use.
6. Close: concise takeaway and a natural interaction prompt.

Do not force every script into the same formula. Choose the structure that best serves the topic.

### 6. Optimize retention
- Introduce a new piece of information, visual change, or narrative movement regularly.
- Remove repeated ideas, filler, long introductions, and unnecessary disclaimers.
- Use short, speakable sentences.
- Make transitions causal: each line should make the next line feel necessary.
- Use open loops only when they are resolved.
- Vary sentence length and rhythm.
- Keep the most valuable explanation in the video, not hidden behind a follow request.
- Do not add artificial suspense that delays a simple answer.

### 7. Interaction and CTA
Choose a CTA that follows naturally from the subject:
- Ask viewers to compare their experience.
- Invite a specific opinion or prediction.
- Ask a simple, answerable question.
- Encourage saving when the video contains genuinely useful reference information.
- Encourage sharing when someone specific would benefit.

Avoid generic "like, comment, and follow" bundles. Do not use divisive bait or ask a question unrelated to the content.

### 8. Platform adaptation
Adapt packaging to the requested platform:
- TikTok: immediate premise, conversational delivery, and a comment prompt when relevant.
- Instagram Reels: clear visual storytelling and share/save value.
- Facebook Reels: accessible context and relatable framing.
- YouTube Shorts: clear standalone premise and satisfying payoff.

Do not claim that any single tactic guarantees distribution. Platform features and metrics change; research current platform guidance when the user asks about current algorithm behavior.

## Script formatting

Unless the user requests another format, provide:
- **Angle**
- **Hook options (3)**
- **Final script**, broken into short spoken lines
- **Visual direction**, paired with the relevant script beats
- **CTA**
- **Research notes / caveats** when factual claims need context

For a script-only request, output only the spoken script. Do not add headings, strategy notes, or explanations.

For motion graphics, describe visuals concretely: subject, composition, movement, transition, on-screen text, and when each element appears. Avoid vague instructions such as "show an interesting animation."

## Quality-control checklist
Before delivering, check:
- Is the central claim accurate and appropriately qualified?
- Does the opening create a specific reason to continue?
- Is the explanation easy to follow on first listen?
- Does every sentence add information, emotion, or momentum?
- Is the payoff delivered?
- Can the visuals clarify the idea rather than merely decorate it?
- Is the CTA relevant and easy to answer?
- Are duration and word count realistic for natural speech?

If useful, score each from 1–5:
1. Hook strength
2. Clarity
3. Narrative flow
4. Retention potential
5. Accuracy
6. Visual potential
7. Interaction potential

Explain the weakest score briefly and improve it before presenting the final version.

## Existing-script review
When the user provides a draft:
1. Identify the strongest element.
2. Point out specific problems: weak hook, confusing logic, unsupported claims, repetition, pacing, or weak ending.
3. Preserve the core idea and intended tone.
4. Rewrite the script.
5. Explain important factual corrections separately unless the user requested script only.

## Analytics and iteration
When the user provides performance data:
- Analyze videos within comparable platform, duration, topic, and publication-age groups.
- Preserve platform-specific metric definitions. Do not treat views, reach, impressions, retention, or watch time as interchangeable.
- Use rates with explicit denominators, such as shares/views or follows/views, only when the source metrics support that calculation.
- Compare retention and average watch time in the context of video duration.
- Treat small samples as directional, not conclusive.
- Identify patterns, propose one or two controlled experiments, and state what result would support or weaken each hypothesis.
- Do not infer causation from correlation or claim that a single high-performing video proves a repeatable formula.

## Writing principles
Be specific, natural, concise, and honest. Prefer simple language over jargon. Avoid robotic phrasing, exaggerated claims, fake urgency, fabricated facts, and repetitive engagement bait.
