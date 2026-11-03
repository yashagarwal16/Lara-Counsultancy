export type Category = "Essay help" | "Assignment help" | "Research Topics";

export type Section = {
  id: string;
  heading: string;
  body: string[];
  list?: string[];
};

export type Post = {
  slug: string;
  title: string;
  category: Category;
  excerpt: string;
  date: string; // ISO: YYYY-MM-DD
  takeaways: string[];
  sections: Section[];
};

export const categories: Category[] = ["Essay help", "Assignment help", "Research Topics"];

export const posts: Post[] = [
  {
    slug: "essay-writing-guide",
    title: "Essay Writing Guide: From Question to Final Draft",
    category: "Essay help",
    excerpt: "A practical structure for planning, researching, drafting, and editing an academic essay.",
    date: "2025-05-12",
    takeaways: [
      "Read the question for command words before you research anything.",
      "A one-sentence answer (your thesis) makes the outline much easier.",
      "Edit in layers: structure first, sentences last.",
    ],
    sections: [
      {
        id: "understand-the-question",
        heading: "Understand the question first",
        body: [
          "Many marks are lost by answering a slightly different question from the one set. Underline the command word (analyse, evaluate, compare, discuss), the topic, and any limits on scope such as a time period or case study.",
          "Then check the practical details: word count, referencing style, the number of sources expected, and the marking criteria. These tell you what a strong answer looks like at your level.",
        ],
      },
      {
        id: "plan-your-argument",
        heading: "Plan your argument",
        body: [
          "Write a working thesis: one or two sentences that directly answer the question. You can refine it later, but drafting with a clear answer in mind keeps every paragraph purposeful.",
          "Then sketch three to five main points and note the evidence you will use for each.",
        ],
        list: [
          "Thesis: your direct answer to the question",
          "Main points: the reasons that support your answer",
          "Evidence: data, quotations, or examples for each point",
          "Counter-argument: the strongest objection and your response",
        ],
      },
      {
        id: "draft-with-purpose",
        heading: "Draft with purposeful paragraphs",
        body: [
          "A reliable paragraph pattern is point, evidence, explanation, link. State the point, support it with evidence, explain why it matters, and link back to the question.",
          "You do not have to write the introduction first. Many writers draft the body, then write the introduction and conclusion once they know exactly what the essay argues.",
        ],
      },
      {
        id: "edit-in-layers",
        heading: "Edit in layers",
        body: [
          "Review the essay several times, each with a different focus. Check structure and argument first, then paragraph flow, then sentences and word choice, and finally references and formatting.",
          "Reading the draft aloud, or leaving it for a few hours, helps you spot unclear sentences. Before submitting, compare the essay with the marking criteria one last time.",
        ],
      },
    ],
  },
  {
    slug: "how-long-is-an-essay",
    title: "How Long Is an Essay? A Guide to Word Counts",
    category: "Assignment help",
    excerpt: "Understand what word count includes and how to allocate space across an essay.",
    date: "2025-05-08",
    takeaways: [
      "Always follow the word count in your brief; some universities allow around 10% either way, others do not.",
      "Check whether references, appendices, and headings count toward the total.",
      "Plan roughly 10% introduction, 80% body, and 10% conclusion.",
    ],
    sections: [
      {
        id: "typical-lengths",
        heading: "Typical essay lengths",
        body: [
          "Lengths vary by level and subject, but common ranges are around 500 words for a short response, 1,000 to 1,500 words for a standard undergraduate essay, and 2,000 to 3,000 words or more for longer coursework.",
          "Your assignment brief always overrides these general ranges, so treat them only as a rough guide.",
        ],
      },
      {
        id: "what-counts",
        heading: "What counts toward the word count",
        body: [
          "Policies differ between institutions. Body text and in-text citations usually count, while the reference list, title page, and appendices often do not. Quotations, footnotes, tables, and headings are handled differently depending on the rules.",
          "If the brief does not say, ask your lecturer or check the course handbook rather than guessing.",
        ],
      },
      {
        id: "allocate-your-words",
        heading: "How to allocate your words",
        body: [
          "A simple starting point is about 10% for the introduction, 80% for the body, and 10% for the conclusion. For a 1,500-word essay that is roughly 150, 1,200, and 150 words.",
          "Divide the body by the number of main points. Four points in 1,200 words gives about 300 words each, which is enough for one or two well-developed paragraphs.",
        ],
      },
      {
        id: "over-or-under",
        heading: "If you are over or under the limit",
        body: [
          "If you are over, cut repetition, long quotations, and background the reader already knows. If you are under, you usually need deeper analysis rather than extra description: explain why your evidence matters and address a counter-argument.",
        ],
      },
    ],
  },
  {
    slug: "research-paper-outline",
    title: "How to Write a Research Paper Outline",
    category: "Research Topics",
    excerpt: "Turn a research question into a clear outline with connected sections and evidence.",
    date: "2025-04-29",
    takeaways: [
      "Start from a focused research question, not just a topic.",
      "Choose between a topic outline and a sentence outline.",
      "Attach evidence to each point while you outline.",
    ],
    sections: [
      {
        id: "start-with-a-question",
        heading: "Start with a research question",
        body: [
          "A topic such as social media is too broad. A question such as how social media use affects sleep quality in university students gives the paper a direction and a limit.",
          "Test your question: can it be answered with evidence you can access, and does it need analysis rather than a simple yes or no?",
        ],
      },
      {
        id: "choose-a-format",
        heading: "Choose an outline format",
        body: [
          "A topic outline uses short phrases and suits early planning. A sentence outline uses a full sentence for each point and makes drafting faster because the argument is already written down.",
        ],
      },
      {
        id: "use-a-clear-structure",
        heading: "Use a clear structure",
        body: ["Empirical papers commonly follow this order, though your department may prefer a different one:"],
        list: [
          "Introduction: context, problem, and research question",
          "Literature review: what is already known and the gap",
          "Methodology: how you gathered and analysed evidence",
          "Results or findings: what you found",
          "Discussion: what the findings mean and their limits",
          "Conclusion: the answer, implications, and further research",
        ],
      },
      {
        id: "attach-evidence",
        heading: "Attach evidence and revise",
        body: [
          "Under each heading, list the sources, data, or examples that support it. Gaps in the outline show where you still need to research.",
          "Revise the outline before drafting. Check that each section answers part of the research question and that the order builds logically.",
        ],
      },
    ],
  },
  {
    slug: "how-to-write-an-abstract",
    title: "How to Write an Abstract for Academic Work",
    category: "Research Topics",
    excerpt: "A concise guide to purpose, method, findings, and conclusion in an abstract.",
    date: "2025-04-20",
    takeaways: [
      "An abstract summarises the whole paper: purpose, method, findings, conclusion.",
      "Write it after the paper is finished.",
      "Follow the word limit; many abstracts are 150 to 250 words.",
    ],
    sections: [
      {
        id: "what-an-abstract-does",
        heading: "What an abstract does",
        body: [
          "An abstract is a short, self-contained summary that lets a reader decide whether to read the full paper. It should make sense on its own, without the paper alongside it.",
        ],
      },
      {
        id: "what-to-include",
        heading: "What to include",
        body: ["Most informative abstracts cover four elements, usually in this order:"],
        list: [
          "Background and purpose: the problem you address and why it matters",
          "Method: what you did, in a sentence or two",
          "Findings: the main results",
          "Conclusion: what the results mean or recommend",
        ],
      },
      {
        id: "how-to-write-it",
        heading: "How to write it",
        body: [
          "Write the abstract last, once you know exactly what the paper says. Use plain, specific language, and add the keywords if your journal or department asks for them.",
          "Avoid new information that does not appear in the paper, and avoid citations unless your style guide requires them.",
        ],
      },
      {
        id: "check-before-submitting",
        heading: "Check before submitting",
        body: [
          "Confirm the word limit, make sure every sentence earns its place, and check that the abstract matches the paper's final conclusions. Ask someone unfamiliar with the topic whether it makes sense to them.",
        ],
      },
    ],
  },
  {
    slug: "demonstration-speech-ideas",
    title: "Demonstration Speech Ideas and Examples",
    category: "Essay help",
    excerpt: "Choose a focused topic and organise a demonstration speech your audience can follow.",
    date: "2025-04-14",
    takeaways: [
      "Pick a process you can complete and explain in the time given.",
      "Structure: introduction, materials, steps, tips, conclusion.",
      "Rehearse with your props and a timer.",
    ],
    sections: [
      {
        id: "choose-a-focused-topic",
        heading: "Choose a focused topic",
        body: [
          "A good demonstration speech teaches the audience one process they can follow. Pick something you know well, that fits the time limit, and that is safe and practical to show in the room.",
        ],
      },
      {
        id: "topic-ideas",
        heading: "Topic ideas to start from",
        body: ["These are starting points. Check with your instructor about any rules on topics, props, or equipment."],
        list: [
          "How to build a simple monthly budget",
          "How to prepare for a job interview",
          "How to make a pour-over coffee",
          "How to create a study schedule that works",
          "How to edit a short video on a phone",
          "How to fold a paper airplane that flies far",
        ],
      },
      {
        id: "organise-the-speech",
        heading: "Organise the speech",
        body: [
          "Open with a hook and tell the audience what they will learn. Then list any materials, present the steps in order, and add tips on common mistakes. Close by recapping the steps and showing the result.",
        ],
      },
      {
        id: "practise-with-props",
        heading: "Practise with your props",
        body: [
          "Rehearse out loud with a timer and the real materials. Prepare for something going wrong by having a backup, such as a pre-made example of the finished result.",
          "Face the audience while demonstrating, and keep each step short so everyone can follow.",
        ],
      },
    ],
  },
  {
    slug: "capstone-project-ideas-topics",
    title: "Capstone Project Ideas and Topics",
    category: "Assignment help",
    excerpt: "Ways to narrow a capstone idea into a feasible academic project.",
    date: "2025-04-04",
    takeaways: [
      "Choose a problem you can finish in the time and with the data available.",
      "Narrow broad ideas into a specific question, audience, and scope.",
      "Get your supervisor's feedback early.",
    ],
    sections: [
      {
        id: "what-makes-a-good-idea",
        heading: "What makes a good capstone idea",
        body: [
          "A strong capstone connects what you studied to a real problem, can be completed in your timeframe, and has accessible data or a practical way to test the idea.",
        ],
      },
      {
        id: "narrow-your-idea",
        heading: "Narrow your idea",
        body: [
          "Start with an interest, then add a specific problem, the people affected, and a boundary on scope. A broad idea such as improving patient care becomes reducing missed follow-up appointments in a community clinic by using reminders.",
        ],
      },
      {
        id: "ideas-by-field",
        heading: "Ideas by field",
        body: ["Use these as prompts and adapt them to your course requirements."],
        list: [
          "Business: how small retailers can use customer data to improve repeat sales",
          "IT and data: a dashboard that tracks course completion for a training team",
          "Nursing and health: education materials that support medication adherence",
          "Education: a study of peer tutoring and exam confidence",
          "Engineering: a low-cost monitoring system for energy use in a building",
        ],
      },
      {
        id: "check-feasibility",
        heading: "Check feasibility",
        body: [
          "Before committing, confirm that you can access the data or participants, that the project fits the time available, and whether it needs ethical approval. Share a one-page proposal with your supervisor and adjust based on their feedback.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function readingMinutes(post: Post) {
  const text = [
    post.excerpt,
    ...post.takeaways,
    ...post.sections.flatMap((s) => [s.heading, ...s.body, ...(s.list ?? [])]),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

export function categorySlug(category: Category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}