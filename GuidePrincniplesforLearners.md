How Anthropic Engineers ACTUALLY Prompt Claude Code 

The 5 principles from the team that built it, with every prompt, principle, and source quote you need. 

Compiled by Frank Nillard · Agentic Architects · May 2026 

Why this guide exists 

This is the companion guide to the video of the same name. Everything below is sourced directly from Anthropic engineers. Barry Zhang and Mahesh Murag at the AI Engineer Code Summit. Erik Schluntz in his Anthropic interviews. Thariq Shihipar on the Claude Code team. Chuma Kabaghe in Anthropic Product Engineering. 

It’s short on purpose. Five principles, every prompt typed out, every principle explained in plain language. If you want to come back to one section and brush up before a session, that’s the point. 

It’s also the freebie that goes out to anyone who joins my Skool community, so feel free to share the link. 

TL;DR.The 5 principles 

1\. Prompt skills, not Claude. Stop writing new custom prompts. Build skills. 

2\. Skills are more than prompts. A skill has three layers: description, instructions, and tools. Most leverage lives in the tool layer. 

3\. Composable for repeats, throwaway for one-shots. Small chained skills plus custom throwaway tools beat one giant skill. 

4\. Skills get smarter every session. After every imperfect output, update the skill. 

5\. The output format is the prompt. Use HTML for plans and specs. Stop writing 1000-line markdown nobody reads.

1 / 13   
Principle 1.Prompt Skills, Not Claude 

What this means 

Most people open Claude Code and write a new custom prompt for every task. Anthropic engineers don’t. They build skills, which are folders that tell Claude how to do a specific task the same way every single time. Then they invoke those skills with a slash command. 

The Anthropic definition 

“Skills are organized collections of files that package composable procedural knowledge for agents.” 

Barry Zhang, Anthropic 

In plainer language Barry uses in the same talk: 

“In other words, they’re folders. This simplicity is deliberate.” 

A skill is just a folder. Inside it: a SKILL.md file with instructions, plus any scripts, references, and tools Claude needs to do the job. 

The mental model 

Layer What it is Who built it 

Model The AI (Claude Sonnet, Opus, etc.) 

Agent \+ Prompts The runtime plus your custom prompts 

Skills Repeatable procedures, folder-based 

Barry’s analogy: Anthropic builds the phone. You build the apps.   
Anthropic 

You, mostly 

You. This is where you compound value. 

Open your own skills folders (so you can follow along) Skills live in two places. Open Terminal and run either of these:

2 / 13   
\# Project skills (only available inside this specific project) 

open .claude/skills/ 

\# Global skills (available in every Claude Code session, anywhere on your machine) open \~/.claude/skills/ 

The first command only works when your terminal is already inside a project folder. The second one works from anywhere. 

If you don’t use Terminal, in Finder press Cmd+Shift+G and paste \~/.claude/skills/ to open the global folder directly. 

You’ll probably find your global folder empty or sparse. That’s normal. Most people build skills inside specific projects. 

Global vs. project skills (and what actually loads into context) 

A question I get a lot: if I have 30 skills installed globally, does every single one get stuffed into Claude’s context every time I send a prompt? 

Short answer: no. Only the name and description of each skill loads at session start. That’s called progressive disclosure. The full SKILL.md content only loads when Claude decides to actually use the skill. So you can have hundreds of skills without blowing your context window. 

The cost per skill in the description layer is roughly 70 to 150 tokens. Small per skill, but it adds up if you go wild. 

Here’s the comparison:

3 / 13   
Global · 

\~/.claude/skills/ 

Available where Every session, every project, anywhere on your machine 

Loaded into context Every session, even if you never use it that day 

Token cost per session \~70-150 tokens per skill, always 

Best for Truly cross-project utilities (git workflows, code review 

patterns, generic helpers) 

Risk if you over-stuff it Bloats every session in every project, costs tokens you’ll 

never use   
Project · 

\<project\>/.claude/skills/ Only inside that specific project 

Only when you’re working in that project 

\~70-150 tokens per skill, only in that project 

Project-specific workflows (this app’s deploy, this content business’s publish pipeline, this repo’s testing) 

Contained — only affects sessions in that project 

Discoverable in slash menu Yes, in any project Yes, only when working in that project 

Rule of thumb I use: if I’d want this skill available when I open a brand new project with zero context, it goes global. Everything else stays in the project folder where it belongs. 

The discovery prompt to find your first 5 skills today 

Paste this into Claude Code: 

“Based on my recent sessions, what tasks am I doing repeatedly that should be skills instead of one off prompts?” 

Run it against your own chat history. Claude will surface 3 to 5 skills you should have built last month. 

The pushback worth knowing 

Not every Anthropic engineer agrees that skills should be elaborate. Thariq Shihipar from the Claude Code team:

4 / 13   
“When I see people with a lot of over-built skills, kind of like ‘you’re an expert planner’, that is usually outsourcing too much and constraining it.” 

Translation: keep your skill prompts thin. State the task. Let the model do the rest. 

Bottom line 

If you’re typing the same kind of prompt twice, it’s a skill, not a prompt. But keep the skill itself thin. 

Principle 2.Skills Are More Than Prompts 

The 3 layers of a skill 

Open any SKILL.md file and you’ll find three things: 

Layer JobWhere most people get it wrong 

Description Tells Claude when to use the skill (read at the start of every 

chat)   
Too vague. Claude never fires the skill. 

Instructions The step-by-step playbook Over-engineered. Too long, too rigid. 

Tools Scripts, APIs, reference files Claude actually uses 

The most quotable line from Anthropic on this   
Bare-bones. This is where the real leverage lives. 

“Maybe the funniest thing I see is that people will put a lot of effort into creating these really beautiful, detailed prompts. And then the tools that they make to give the model are sort of these incredibly bare-bones, no documentation, parameters named A and B.” 

Erik Schluntz, Anthropic 

Beautiful prompts. Bare-bones tools. That’s the most common mistake.

5 / 13   
The discovery prompt to find your tool gaps 

“Find a task where I’m doing manual checking, lookup, or verification after AI gives me an output.” Anything you check by hand after Claude gives you output is a tool waiting to be written. 

A real example from inside Anthropic 

Chuma Kabaghe, a backend engineer in Anthropic’s Product Engineering team, got assigned a frontend feature for claude.ai. Her workflow: 

1\. Prompt Claude Code with a design doc reference plus “use the Playwright MCP” 2\. Claude reads the codebase, opens the UI through Playwright, confirms the current state 3\. Claude implements the feature, validates via Playwright, iterates 

4\. Chuma reviews and ships 

Her own words: 

“Having Claude Code, it almost feels like having this superpower, this ability to send off a sidekick to go take the time, go figure it out, come back, report back.” 

That’s Principle 2 in action. A backend engineer doing frontend work because the tool layer is doing the heavy lifting. 

Bottom line 

Spend less time on the prompt. Spend more time on the tools. 

Principle 3\. Composable Skills (For Repeats),Throwaway Tools (For One-Shots) 

Anthropic’s four principles for skills (from their engineering blog) 

1\. Composable. Multiple skills work together. 

2\. Portable. Work across environments. 

3\. Efficient. Keep context windows small.

6 / 13   
4\. Powerful. Give agents real capabilities. 

The principle that matters most for most people: composable. Small skills that chain together beat one giant skill that does everything. 

My own painful lesson 

I started with one skill called /content-creation that did everything: idea, script, social posts, the whole pipeline. It became unmanageable. Every time I wanted to tweak how scripts were written, I had to rewrite the whole skill and re-test the whole pipeline. 

I split it into 12 small skills. Each one does one thing. Each one can call the others. Before After 

/content-creation (one giant skill) /idea-title , /video-prep , /guide , /title , /timestamps , /publish , 

/thumbnail , /analyze , /excalidraw 

diagrams , /excalidraw-visuals , /idea 

to-prep , /claude-youtube 

Three reasons small skills beat one giant skill 

1\. Issues are easy to spot. When a focused skill breaks, you know exactly where to look. 

2\. Improvements compound. Update /title , every workflow that uses it gets the upgrade for free. 

3\. Reuse beats rebuild. /analyze plugs into /video-prep , /guide , and /title . Built once, reused everywhere. 

Pattern 1\. Save scripts inside skills 

“We kept seeing Claude write the same Python script over and over again to apply styling to slides. So we just asked Claude to save it inside the skill as a tool for his future self. Now we can just run the script and that makes everything a lot more consistent.” 

Barry Zhang, Anthropic 

Why it matters: code is deterministic. Same input, same output. AI tokens cost money. Code compute doesn’t. If Claude writes the same script twice, save it inside the skill. 

Rule of thumb: If you can use code instead of AI, you should.

7 / 13   
Pattern 2\. Control who can fire a skill 

Two frontmatter flags most people don’t know about. Add them to the YAML block at the top of any SKILL.md : 

disable-model-invocation: true 

Only you can fire the skill. Claude can’t decide to use it on its own. Use this for risky or destructive things like publishing, deploying, sending emails. 

\--- 

name: publish 

description: Use when Frank wants to publish a new video... 

disable-model-invocation: true 

\--- 

user-invocable: false 

Opposite. The skill is hidden from your slash menu. Only Claude can fire it, typically when a parent skill calls it. Use for helper skills that should never be invoked directly. 

\--- 

name: excalidraw-visuals 

description: Use when someone asks for a hand-drawn visual... 

user-invocable: false 

\---

The discovery prompt to audit your existing skills 

“Audit my Claude Skills for: visibility, deterministic vs non-deterministic, composability.” 

Run it against your current skills folder. Claude will find the ones that should be split, scripted, or flag-locked. 

The counterweight. Throwaway tools are also OK 

Not every Anthropic engineer is religious about composability. Thariq pushes back: 

“I like this idea of just-in-time documentation, very high quality, throwaway software, which is nice. It’s cheap, so you can toss it.” 

8 / 13   
His point: tokens are cheap. For one-shot tasks, build a custom interface, use it for that decision, throw it away. Don’t try to make everything reusable. 

Bottom line 

Build small skills that chain for repeats. Build throwaway tools for the one-offs. Save the deterministic parts as scripts. Lock down the risky ones. 

Principle 4.Skills That Get Smarter Every Session The Anthropic goal 

“Our goal is that Claude on day 30 of working with you is going to be a lot better than Claude on day 1.” 

Barry Zhang, Anthropic 

Day 30 better than day 1\. That doesn’t happen by accident. 

The mechanism 

After every imperfect output from a skill, ask yourself one question: 

Is this a one-time fix? Or should this be in the skill forever? 

If forever, update the skill. Add the principle, the example, the edge case. Commit. Next session starts smarter. 

Most people skip this entirely. Run skill, get output, move on. That’s the flat line on the chart. The discovery prompt for use right after a skill misses 

“Review the back and forth I just had after using this skill. Can we enhance the skill so this is handled automatically, or we don’t make the same mistake again?”

9 / 13   
Bottom line 

The skill you use today is the worst version it’ll ever be. Every session should make it better. 

Principle 5.The Output Format Is the Prompt 

The argument 

Most people ask Claude to write plans, specs, PRDs in markdown. Thariq Shihipar from the Claude Code team says that’s now a mistake. 

“The plans are so long, I honestly have stopped reading them. And this was honestly a mistake. You still need to be really in the loop.” 

Thariq Shihipar, Anthropic 

His fix: stop using markdown for plans. Use HTML. 

Why HTML wins 

“In HTML it doesn’t need to try nearly as hard. It can actually draw things you can look at. It’s just a richer communication medium between you and Claude.” 

In an HTML plan you get rendered: 

Code excerpts with syntax highlighting 

Mock-ups of UI states 

Decision tables 

Failure mode tables 

Sample output panels 

You actually open the file. You actually read it. The plan stays a real artifact, not a wall of text you scroll past.

10 / 13   
The framing that changes how you think about it 

“When you say Claude can run for 8 hours, what you’re really saying is Claude can spend like 500 bucks. All of us are becoming these compute allocators.” 

Thariq Shihipar, Anthropic 

$500 per run. You cannot afford to skim the output. So make the output something you actually want to read. 

The exact prompt to steal 

“Create an HTML file as a plan that helps me visualize what the implementation plan is. Include excerpts, mock-ups, code, whatever is needed to give me maximum context.” 

Use it for anything bigger than a single skill. Planning a publish workflow, a refactor, a new tool. Run it once and you’ll never go back to markdown. 

The pro move 

For parts of the plan you want to edit, ask Claude to build a custom HTML interface just for that decision. Edit in the UI, copy the result back, throw the interface away. That’s the “throwaway software” pattern from Principle 3 applied here. 

Bottom line 

The output format is part of the prompt. Stop writing 1000-line markdown plans nobody reads.

11 / 13   
The 5 principles on one page (cheat sheet) \# Principle Discovery prompt   
1 Prompt skills, not Claude. Build folders that run the 

same way every time. Keep 

skill prompts thin. 

2 Skills are more than prompts. Description / 

instructions / tools. Tools 

layer matters most. 

3 Composable for repeats, throwaway for one-shots. 

Save deterministic logic as 

scripts. Lock risky skills with 

disable-model 

invocation: true . 

4 Update the skill after every imperfect session. One-time 

fix or forever? If forever, 

commit it. 

5 The output format is the prompt. Use HTML for plans. 

$500 runs deserve a readable 

artifact.   
“Based on my recent 

sessions, what tasks am I doing repeatedly that should be skills instead of one-off prompts?” 

“Find a task where I’m doing manual checking, lookup, or verification after AI gives me an output.” 

“Audit my Claude Skills for: visibility, deterministic vs non-deterministic, 

composability.” 

“Review the back and forth I just had after using this skill. Can we enhance the skill so this is handled 

automatically?” 

“Create an HTML file as a plan that helps me visualize what the implementation plan is. Include excerpts, mock ups, code, whatever is needed to give me maximum context.”

12 / 13   
Sources 

All quotes in this guide are verbatim from Anthropic engineers, pulled from public talks and interviews: 

Barry Zhang \+ Mahesh Murag. “Don’t Build Agents, Build Skills Instead.” AI Engineer Code Summit, Nov 2025\. https://www.youtube.com/watch?v=CEvIs9y1uog 

Thariq Shihipar. “Why this Claude Code engineer uses HTML files as AI specs” on the How I AI channel. https://www.youtube.com/watch?v=Qrpm7E80wQ0 

Chuma Kabaghe. “How Anthropic uses Claude in Product Engineering,” official Anthropic video. https://www.youtube.com/watch?v=ma7oe\_5h0ag 

Erik Schluntz. Quoted from his Anthropic interview (excerpted in Austin Marchese’s video). https://www.youtube.com/watch?v=qOvc9IUKEIc 

Anthropic Skills documentation. https://docs.anthropic.com/en/docs/claude-code/skills 

Want more like this? 

If you want my full system for taking real apps from idea to production with Claude Code, the system I use myself daily, that’s what I teach inside Agentic Architects. 

And if you want to see one of these skills shipped end-to-end, check out my video on how Claude Code can instantly watch any video. That’s Principle 2 and Principle 5 working together in a real working skill. 

Frank Nillard 

© 2026 Frank Nillard · Agentic Architects. Free to share. Quotes from Anthropic engineers are public-domain excerpts of their cited talks and interviews.

13 / 13 