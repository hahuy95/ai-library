/*
 * Library seed data.
 *
 * To add an item permanently, append an object to this array:
 *   id          unique slug
 *   name        display name
 *   url         link to the resource
 *   category    one of: models | plugins | skills | references | inspiration | components | tools
 *   description one or two sentences
 *   tags        array of short lowercase tags
 *   source      (optional) { label, url } where you found it
 *   thumbnail   (optional) image path or URL; defaults to thumbs/<id>.png,
 *               then a live screenshot of the site if that file is missing
 *
 * Items added through the "Add resource" button are saved in your browser.
 * Use More (⋮) → Export JSON to copy them here.
 */
window.LIBRARY_SOURCES = {
  craftwork: { label: '@craftwork.design', url: 'https://www.threads.com/share/FHFZZiHMX' },
  toools: { label: '@toools.design', url: 'https://www.threads.com/share/FQ-U7n_pk' },
  heytanzil: { label: '@heytanzil', url: 'https://www.threads.com/share/F7GtaveKT' },
  postspark: { label: '@postspark_app', url: 'https://www.threads.com/share/GjmKO9mne' },
};

window.LIBRARY_DATA = [
  // AI models / assistants
  {
    id: 'meta-ai',
    name: 'Meta AI',
    url: 'https://www.meta.ai',
    category: 'models',
    description: "Meta's assistant built on Llama, also inside WhatsApp, Instagram and Messenger.",
    tags: ['meta', 'llama', 'chat'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://www.deepseek.com',
    category: 'models',
    description: 'Open-weight reasoning and chat models with a free assistant app.',
    tags: ['chat', 'open weights', 'reasoning'],
  },
  {
    id: 'le-chat',
    name: 'Le Chat',
    url: 'https://chat.mistral.ai',
    category: 'models',
    description: "Mistral AI's assistant, built on its open and commercial models.",
    tags: ['mistral', 'chat', 'open weights'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    category: 'models',
    description: 'AI answer engine that searches the web and cites its sources.',
    tags: ['search', 'research', 'chat'],
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com',
    category: 'models',
    description: "Microsoft's everyday AI companion, built into Windows, Edge and Office.",
    tags: ['microsoft', 'chat'],
  },
  {
    id: 'grok',
    name: 'Grok',
    url: 'https://grok.com',
    category: 'models',
    description: "xAI's assistant with real-time access to posts on X.",
    tags: ['xai', 'chat'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com',
    category: 'models',
    description: "Google's multimodal assistant, connected to Search and Workspace.",
    tags: ['google', 'chat', 'multimodal'],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    category: 'models',
    description: "OpenAI's assistant for chat, images, voice and research.",
    tags: ['openai', 'chat', 'images'],
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai',
    category: 'models',
    description: "Anthropic's AI assistant for writing, analysis, coding and long documents.",
    tags: ['anthropic', 'chat', 'coding'],
  },

  {
    id: 'material-design-3',
    name: 'Material Design 3',
    url: 'https://m3.material.io/',
    category: 'references',
    description: "Google's open design system: color roles, typography, shape, motion and component guidelines.",
    tags: ['design system', 'guidelines', 'components'],
  },

  // Threads: @craftwork.design, "Skills that teach your agent taste. Part 1"
  {
    id: 'impeccable',
    name: 'Impeccable',
    url: 'https://impeccable.style',
    category: 'skills',
    description: 'Agent skill for shaping, critiquing and polishing interface design.',
    tags: ['agent', 'ui', 'critique'],
    source: 'craftwork',
  },
  {
    id: 'taste-skill',
    name: 'Taste Skill',
    url: 'https://tasteskill.dev',
    category: 'skills',
    description: 'Gives your agent adjustable dials for visual variance and motion.',
    tags: ['agent', 'ui', 'motion'],
    source: 'craftwork',
  },
  {
    id: 'hallmark',
    name: 'Hallmark',
    url: 'https://usehallmark.com',
    category: 'skills',
    description: 'Design skill bundling 21 themes and 58 quality checks for generated UI.',
    tags: ['agent', 'themes', 'qa'],
    source: 'craftwork',
  },
  {
    id: 'ui-ux-pro-max',
    name: 'UI UX Pro Max',
    url: 'https://uupm.cc',
    category: 'skills',
    description: 'Design intelligence skill with 192 color palettes and 119 UX rules.',
    tags: ['agent', 'color', 'ux rules'],
    source: 'craftwork',
  },
  {
    id: 'craftwork-skills',
    name: 'Craftwork Skills',
    url: 'https://craftwork.design/skills',
    category: 'skills',
    description: 'Directory of 114 vetted design skills for AI agents.',
    tags: ['agent', 'directory'],
    source: 'craftwork',
  },

  // Threads: @toools.design, "4 tools on the radar this week"
  {
    id: 'pixlpin',
    name: 'Pixlpin',
    url: 'https://pixlpin.com',
    category: 'inspiration',
    description: 'Inspiration library of real app screens, websites, ads, UI elements and motion work.',
    tags: ['ui', 'web', 'motion', 'mobile'],
    source: 'toools',
  },
  {
    id: 'typebook',
    name: 'Typebook',
    url: 'https://typebook.com',
    category: 'tools',
    description: 'AI-assisted lettering studio that turns text into original lettering, styled from a curated archive.',
    tags: ['typography', 'lettering', 'generative'],
    source: 'toools',
  },
  {
    id: 'stageshow',
    name: 'Stageshow',
    url: 'https://benji.org/stageshow',
    category: 'skills',
    description: 'Teaches coding agents to build polished faux product UI demos.',
    tags: ['agent', 'demo', 'ui'],
    source: 'toools',
  },
  {
    id: 'blocks-so',
    name: 'Blocks',
    url: 'https://blocks.so',
    category: 'components',
    description: 'Free, open-source copy-paste React UI blocks built with shadcn/ui and Tailwind CSS.',
    tags: ['react', 'shadcn', 'tailwind', 'open source'],
    source: 'toools',
  },

  // Threads: @heytanzil, "Stop designing slop with AI"
  {
    id: 'jiro',
    name: 'Jiro',
    url: 'https://jiro.build',
    category: 'plugins',
    description: '1,400+ designs your agent can pull in as references through MCP.',
    tags: ['mcp', 'agent', 'ui'],
    source: 'heytanzil',
  },
  {
    id: 'design-spells',
    name: 'Design Spells',
    url: 'https://designspells.com',
    category: 'inspiration',
    description: 'Collection of delightful micro-interactions and small design details.',
    tags: ['micro-interactions', 'motion'],
    source: 'heytanzil',
  },
  {
    id: 'refero-styles',
    name: 'Refero Styles',
    url: 'https://styles.refero.design',
    category: 'references',
    description: 'Real-world color and type systems pulled from shipped products.',
    tags: ['color', 'typography', 'design system'],
    source: 'heytanzil',
  },
  {
    id: 'supahero',
    name: 'Supahero',
    url: 'https://supahero.io',
    category: 'inspiration',
    description: 'Curated gallery of website hero sections.',
    tags: ['web', 'hero', 'landing page'],
    source: 'heytanzil',
  },
  {
    id: 'mobbin',
    name: 'Mobbin',
    url: 'https://mobbin.com',
    category: 'references',
    description: 'Library of real app screens and complete user flows.',
    tags: ['mobile', 'web', 'flows', 'ux'],
    source: 'heytanzil',
  },

  // Threads: @postspark_app, "5 design resources you'll want to bookmark"
  {
    id: 'postspark',
    name: 'PostSpark',
    url: 'https://postspark.app',
    category: 'tools',
    description: 'Create animated mockups and product shots.',
    tags: ['mockups', 'animation', 'marketing'],
    source: 'postspark',
  },
  {
    id: 'landdding',
    name: 'Landdding',
    url: 'https://landdding.com',
    category: 'inspiration',
    description: 'Showcase of award-winning landing pages.',
    tags: ['web', 'landing page'],
    source: 'postspark',
  },
  {
    id: 'inspora',
    name: 'Inspora',
    url: 'https://inspora.design',
    category: 'inspiration',
    description: 'Creative design ideas and visual inspiration.',
    tags: ['visual', 'moodboard'],
    source: 'postspark',
  },
  {
    id: 'grainient',
    name: 'Grainient',
    url: 'https://grainient.supply',
    category: 'components',
    description: 'Grainy gradients and animated backgrounds ready to drop into designs.',
    tags: ['gradients', 'backgrounds', 'assets'],
    source: 'postspark',
  },
  {
    id: 'posts-design',
    name: 'Posts.design',
    url: 'https://posts.design',
    category: 'references',
    description: 'How major brands design their social media posts.',
    tags: ['social', 'marketing', 'brands'],
    source: 'postspark',
  },
];
