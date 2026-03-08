import { NextResponse } from 'next/server';

export const revalidate = 86400; // Cache 24 hours

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

// Curated daily rotation (Medium + Hard only)
const CURATED_DAILY_PROBLEMS = [
  'add-two-numbers', // Medium
  'longest-substring-without-repeating-characters', // Medium
  'median-of-two-sorted-arrays', // Hard
  'longest-palindromic-substring', // Medium
  'container-with-most-water', // Medium
  'three-sum', // Medium
  'letter-combinations-of-a-phone-number', // Medium
  'remove-nth-node-from-end-of-list', // Medium
  'generate-parentheses', // Medium
  'merge-k-sorted-lists', // Hard
  'valid-sudoku', // Medium
  'combination-sum', // Medium
  'first-missing-positive', // Hard
  'trapping-rain-water', // Hard
  'jump-game-ii', // Medium
  'permutations', // Medium
  'rotate-image', // Medium
  'group-anagrams', // Medium
  'maximum-subarray', // Medium
  'spiral-matrix', // Medium
  'jump-game', // Medium
  'merge-intervals', // Medium
  'unique-paths', // Medium
  'minimum-path-sum', // Medium
  'edit-distance', // Hard
  'search-in-rotated-sorted-array', // Medium
  'word-search', // Medium
  'binary-tree-level-order-traversal', // Medium
  'construct-binary-tree-from-preorder-and-inorder-traversal', // Medium
  'best-time-to-buy-and-sell-stock-ii', // Medium
  'word-ladder', // Hard
  'course-schedule', // Medium
  'number-of-islands', // Medium
  'lru-cache', // Medium
  'sort-list', // Medium
  'find-minimum-in-rotated-sorted-array', // Medium
];

export async function GET() {
  try {
    // Try to get LeetCode's official daily challenge first
    const officialQuery = `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          link
          question {
            questionId
            questionFrontendId
            title
            titleSlug
            difficulty
            topicTags {
              name
              slug
            }
            content
            codeSnippets {
              lang
              langSlug
              code
            }
          }
        }
      }
    `;

    const response = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query: officialQuery }),
      next: { revalidate: 86400 },
    });

    if (response.ok) {
      const data = await response.json();
      const dailyChallenge = data.data?.activeDailyCodingChallengeQuestion;

      if (dailyChallenge?.question) {
        const question = dailyChallenge.question;
        
        return NextResponse.json({
          success: true,
          source: 'leetcode-official',
          date: dailyChallenge.date,
          challenge: {
            id: question.questionFrontendId,
            title: question.title,
            slug: question.titleSlug,
            difficulty: question.difficulty,
            category: question.topicTags.map((t: any) => t.name).join(', '),
            leetcodeUrl: `https://leetcode.com${dailyChallenge.link}`,
            description: extractDescription(question.content),
            starterCode: {
              python: findCodeSnippet(question.codeSnippets, 'python3') || 
                      findCodeSnippet(question.codeSnippets, 'python') || 
                      '# Write your solution here\n',
              javascript: findCodeSnippet(question.codeSnippets, 'javascript') || 
                          '// Write your solution here\n',
              cpp: findCodeSnippet(question.codeSnippets, 'cpp') || 
                   '// Write your solution here\n',
              java: findCodeSnippet(question.codeSnippets, 'java') || 
                    '// Write your solution here\n',
            },
          },
        });
      }
    }

    // Fallback: Use curated daily rotation
    const dayOfYear = getDayOfYear();
    const problemIndex = dayOfYear % CURATED_DAILY_PROBLEMS.length;
    const problemSlug = CURATED_DAILY_PROBLEMS[problemIndex];

    // Fetch the problem details
    const problemQuery = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          content
          difficulty
          topicTags {
            name
            slug
          }
          codeSnippets {
            lang
            langSlug
            code
          }
        }
      }
    `;

    const problemResponse = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: problemQuery,
        variables: { titleSlug: problemSlug },
      }),
      next: { revalidate: 86400 },
    });

    if (!problemResponse.ok) {
      throw new Error('Failed to fetch curated problem');
    }

    const problemData = await problemResponse.json();
    const question = problemData.data?.question;

    if (!question) {
      throw new Error('Problem not found');
    }

    return NextResponse.json({
      success: true,
      source: 'curated-rotation',
      date: new Date().toISOString().split('T')[0],
      challenge: {
        id: question.questionFrontendId,
        title: question.title,
        slug: question.titleSlug,
        difficulty: question.difficulty,
        category: question.topicTags.map((t: any) => t.name).join(', '),
        leetcodeUrl: `https://leetcode.com/problems/${question.titleSlug}/`,
        description: extractDescription(question.content),
        starterCode: {
          python: findCodeSnippet(question.codeSnippets, 'python3') || 
                  findCodeSnippet(question.codeSnippets, 'python') || 
                  '# Write your solution here\n',
          javascript: findCodeSnippet(question.codeSnippets, 'javascript') || 
                      '// Write your solution here\n',
          cpp: findCodeSnippet(question.codeSnippets, 'cpp') || 
               '// Write your solution here\n',
          java: findCodeSnippet(question.codeSnippets, 'java') || 
                '// Write your solution here\n',
        },
      },
    });
  } catch (error: any) {
    console.error('Daily challenge error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function extractDescription(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 800);
}

function findCodeSnippet(snippets: any[], lang: string): string | null {
  const snippet = snippets.find((s: any) => s.langSlug === lang);
  return snippet ? snippet.code : null;
}
