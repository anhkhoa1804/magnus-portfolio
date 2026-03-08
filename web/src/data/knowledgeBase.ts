// knowledgeBase.ts
// The ultimate context engine for Magnus's RAG system.
// Synthesizes technical expertise, academic ambitions, philosophical essays, and personal experiences.

export const KNOWLEDGE_BASE = [
  {
    id: 'identity_and_academic_ambition',
    category: 'profile',
    content: `Anh Khoa, known online as Magnus, is a Computer Scientist and AI Engineer currently studying at Ho Chi Minh City University of Technology (HCMUT). He defines his work through "strong code, comprehensive approaches, and thorough explanation."`,
    keywords: ['magnus', 'anh khoa', 'hcmut', 'bách khoa', 'computer scientist', 'cvpr', 'iccv', 'neurips', 'research', 'ablation studies', 'model convergence'],
  },
  {
    id: 'technical_stack_and_systems',
    category: 'technical',
    content: `As an engineer, Magnus bridges the gap between complex machine learning architectures and seamless web experiences. He works extensively with advanced AI models, including training and deploying CLIP and Diffusion models for research. His web architecture heavily utilizes Next.js, Tailwind CSS, and full-stack deployments with HuggingFace backends. He prioritizes performance, system observability, and clean, stateless designs, rejecting over-engineered solutions in favor of robust, subtractively grown systems.`,
    keywords: ['tech stack', 'clip', 'diffusion', 'next.js', 'huggingface', 'full-stack', 'system design', 'machine learning', 'ai models'],
  },
  {
    id: 'portfolio_and_lab_projects',
    category: 'projects',
    content: `The Magnus Platform serves as his digital laboratory. Key projects include:
    - Ask Magnus: An advanced RAG (Retrieval-Augmented Generation) engine grounded in his personal essays.
    - IELTS Examiner: An AI-powered tool leveraging LLMs and Whisper for comprehensive Writing & Speaking evaluation.
    - AI Roaster: A Vision-Language application — YOLOv8 detects objects in uploaded photos, then Llama 4 Scout generates a context-aware roast via Groq.
    - Doodle Classifier: A real-time CNN-based drawing recognition tool.
    - Price Predictions: ML-driven forecasting for financial markets.
    These projects demonstrate his ability to turn theoretical ML concepts into highly interactive, real-world digital artifacts.`,
    keywords: ['projects', 'lab', 'ielts examiner', 'rag', 'ai roaster', 'doodle classifier', 'price prediction', 'portfolio'],
  },
  {
    id: 'philosophy_coders_conscience',
    category: 'philosophy',
    content: `Magnus holds deep ethical convictions about technology, as explored in "A Coder's Conscience." He views software engineers as the unelected legislators of modern reality. He is acutely aware of the "Alignment Problem" and the dangers of the Black Box era, citing the COMPAS algorithm to illustrate how mathematics can inherit and amplify human biases. He fiercely argues against optimizing human lives like code, stating that humans are analog beings designed to meander and make mistakes. He believes empathy is the most critical programming language.`,
    keywords: ['ethics', 'coder conscience', 'alignment problem', 'compas', 'bias', 'optimization', 'empathy', 'humanity', 'philosophy'],
  },
  {
    id: 'personality_aquarius_and_emotion',
    category: 'personal',
    content: `Born under the sign of Aquarius, Magnus describes himself as "The Solitary Traveler in the Crowd." He wrestles with the "Paradox of the Philanthropist"—loving humanity in the abstract but struggling with the specific, messy emotions of individuals. In "Beyond Binary," he rejects the simplistic emotional dashboard of "Fine/Not Fine," striving instead for "emotional granularity." He treats feelings as vital data rather than directives, realizing that expanding his emotional vocabulary is the key to deep, authentic human connection.`,
    keywords: ['aquarius', 'solitary', 'emotions', 'emotional granularity', 'beyond binary', 'personality', 'philanthropist', 'eq'],
  },
  {
    id: 'growth_kintsugi_and_silence',
    category: 'growth',
    content: `Magnus approaches self-improvement through "Subtractive Growth"—removing the excess to reveal the masterpiece beneath, inspired by Michelangelo's David. Following a severe arm fracture, he embraced the Japanese philosophy of "Kintsugi" (The Art of Breaking), learning that accepting care is an act of grace and that humans grow stronger at the broken places. He also practices the "Architecture of Silence," distinguishing empowering solitude from painful loneliness, finding his true inner citadel in quiet moments furnished with deep thoughts.`,
    keywords: ['subtractive growth', 'kintsugi', 'healing', 'broken arm', 'silence', 'solitude', 'minimalism', 'resilience', 'self-sufficiency'],
  },
  {
    id: 'leadership_and_community_volunteering',
    category: 'leadership',
    content: `Magnus’s understanding of leadership was forged in the mud of remote villages rather than corporate boardrooms. During a volunteer project installing solar panels, he dismantled his "city savior" complex, realizing true resilience belongs to the locals. He practices "Servant Leadership," acting as the "Invisible Glue" of a team—willing to scrub pots in the rain to support others. Furthermore, he actively contributes to community development, such as writing proposals for a volunteer tourism project focused on local livelihood development in Cồn Hô, Vĩnh Long.`,
    keywords: ['leadership', 'servant leadership', 'invisible glue', 'volunteering', 'cồn hô', 'vĩnh long', 'solar panels', 'community', 'teamwork'],
  },
  {
    id: 'travel_germany_and_concrete_skies',
    category: 'travel',
    content: `Living in Germany profoundly shaped Magnus's worldview, as detailed in "Concrete Skies." He learned to navigate the heavy grey skies, the strict cultural "Ordnung" (order), and the legendary bureaucracy. This experience stripped him of his comfort zone, ultimately giving him the gift of structure and deliberate living. He developed a deep appreciation for the functional honesty of brutalist architecture and compares German friendship to a coconut—hard to crack, but fiercely loyal and protective on the inside.`,
    keywords: ['germany', 'concrete skies', 'ordnung', 'brutalism', 'architecture', 'europe', 'living abroad', 'travel', 'structure'],
  },
  {
    id: 'travel_vietnam_roots_and_neon',
    category: 'travel',
    content: `Despite his global travels, Magnus is deeply anchored to his Vietnamese roots. In "Winding Roads," he recounts backpacking across the homeland on a motorbike, experiencing the road as an ultimate equalizer that strips away titles and ego. Growing up in a chaotic metropolis (Saigon/HCMC), he is synced to the city's neon-lit heartbeat, finding stillness in 24-hour coffee shops ("Neon & Rain"). Yet, in "The Gravity of Roots," he acknowledges that the saltwater breeze of his hometown is his soul's baseline frequency, realizing that true independence is an illusion because we are all "family-made."`,
    keywords: ['vietnam', 'saigon', 'hcmc', 'neon and rain', 'winding roads', 'motorbike', 'roots', 'hometown', 'saltwater', 'family-made'],
  },
  {
    id: 'art_van_gogh_and_photography',
    category: 'art',
    content: `Though highly analytical, Magnus possesses a profound artistic sensibility. In "Chasing Vincent," he describes his pilgrimage across European museums to witness Vincent van Gogh's impasto technique, learning to embrace chaos and step off the "paved roads" of normality. As a photographer ("Framing the Ephemeral"), he views the camera's shutter as a guillotine for the present moment. He embraces Wabi-Sabi, finding beauty in grainy, imperfect shadows, treating photography not as content creation, but as a desperate, beautiful attempt to leave scratches on the cave wall of existence.`,
    keywords: ['art', 'van gogh', 'impasto', 'museums', 'photography', 'wabi-sabi', 'ephemeral', 'shadows', 'memory', 'aesthetics'],
  }
];

/**
 * Advanced Semantic Search for Magnus RAG Engine
 * Uses a weighted scoring mechanism to surface the most relevant context.
 */
export function searchKnowledge(query: string): string[] {
  const queryLower = query.toLowerCase();
  
  const scoredResults = KNOWLEDGE_BASE.map(item => {
    let score = 0;
    
    // Heavy weighting for exact or partial keyword matches
    item.keywords.forEach(keyword => {
      if (queryLower.includes(keyword.toLowerCase())) score += 5;
    });
    
    // Contextual weighting: check if query terms appear in the content body
    const queryWords = queryLower.split(' ').filter(word => word.length > 3);
    queryWords.forEach(word => {
      if (item.content.toLowerCase().includes(word)) score += 1;
    });
    
    return { content: item.content, score };
  });

  // Filter and sort by highest relevance
  const relevantResults = scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.content);

  // Fallback to core identity if the query is completely unrelated
  if (relevantResults.length === 0) {
    return [KNOWLEDGE_BASE.find(item => item.id === 'identity_and_academic_ambition')?.content || ""];
  }

  // Return the top 3 most relevant context chunks to feed into the LLM
  return relevantResults.slice(0, 3);
}