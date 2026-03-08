// Curated coding problems from various sources
export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    cpp: string;
    java: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export const CODING_PROBLEMS: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Array, Hash Table',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: `def twoSum(nums, target):
    # Write your code here
    pass

# Test
print(twoSum([2,7,11,15], 9))`,
      javascript: `function twoSum(nums, target) {
    // Write your code here
}

// Test
console.log(twoSum([2,7,11,15], 9));`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
}

int main() {
    vector<int> nums = {2,7,11,15};
    vector<int> result = twoSum(nums, 9);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution s = new Solution();
        int[] result = s.twoSum(new int[]{2,7,11,15}, 9);
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}`,
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' },
    ],
  },
  {
    id: '2',
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    difficulty: 'Easy',
    category: 'Math',
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

An integer is a palindrome when it reads the same backward as forward.

For example, \`121\` is a palindrome while \`123\` is not.`,
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.',
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.',
      },
    ],
    constraints: [
      '-2^31 <= x <= 2^31 - 1',
    ],
    starterCode: {
      python: `def isPalindrome(x):
    # Write your code here
    pass

# Test
print(isPalindrome(121))`,
      javascript: `function isPalindrome(x) {
    // Write your code here
}

// Test
console.log(isPalindrome(121));`,
      cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Write your code here
}

int main() {
    cout << (isPalindrome(121) ? "true" : "false") << endl;
    return 0;
}`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isPalindrome(121));
    }
}`,
    },
    testCases: [
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false' },
    ],
  },
  {
    id: '3',
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'Easy',
    category: 'Two Pointers, String',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.',
    ],
    starterCode: {
      python: `def reverseString(s):
    # Modify s in-place
    pass

# Test
s = list("hello")
reverseString(s)
print(''.join(s))`,
      javascript: `function reverseString(s) {
    // Modify s in-place
}

// Test
let s = "hello".split('');
reverseString(s);
console.log(s.join(''));`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    // Modify s in-place
}

int main() {
    vector<char> s = {'h','e','l','l','o'};
    reverseString(s);
    for(char c : s) cout << c;
    cout << endl;
    return 0;
}`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Modify s in-place
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        char[] s = {'h','e','l','l','o'};
        sol.reverseString(s);
        System.out.println(new String(s));
    }
}`,
    },
    testCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'Hannah', expectedOutput: 'hannaH' },
    ],
  },
  {
    id: '4',
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    category: 'Hash Table, String, Sorting',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
    ],
    starterCode: {
      python: `def isAnagram(s, t):
    # Write your code here
    pass

# Test
print(isAnagram("anagram", "nagaram"))`,
      javascript: `function isAnagram(s, t) {
    // Write your code here
}

// Test
console.log(isAnagram("anagram", "nagaram"));`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isAnagram(string s, string t) {
    // Write your code here
}

int main() {
    cout << (isAnagram("anagram", "nagaram") ? "true" : "false") << endl;
    return 0;
}`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.isAnagram("anagram", "nagaram"));
    }
}`,
    },
    testCases: [
      { input: 'anagram\nnagaram', expectedOutput: 'true' },
      { input: 'rat\ncar', expectedOutput: 'false' },
    ],
  },
  {
    id: '5',
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    difficulty: 'Easy',
    category: 'Math, Dynamic Programming',
    description: `The Fibonacci numbers form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

Given \`n\`, calculate \`F(n)\`.`,
    examples: [
      {
        input: 'n = 2',
        output: '1',
        explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.',
      },
      {
        input: 'n = 3',
        output: '2',
        explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.',
      },
      {
        input: 'n = 4',
        output: '3',
        explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.',
      },
    ],
    constraints: [
      '0 <= n <= 30',
    ],
    starterCode: {
      python: `def fib(n):
    # Write your code here
    pass

# Test
print(fib(4))`,
      javascript: `function fib(n) {
    // Write your code here
}

// Test
console.log(fib(4));`,
      cpp: `#include <iostream>
using namespace std;

int fib(int n) {
    // Write your code here
}

int main() {
    cout << fib(4) << endl;
    return 0;
}`,
      java: `class Solution {
    public int fib(int n) {
        // Write your code here
        return 0;
    }
    
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.fib(4));
    }
}`,
    },
    testCases: [
      { input: '0', expectedOutput: '0' },
      { input: '1', expectedOutput: '1' },
      { input: '4', expectedOutput: '3' },
      { input: '10', expectedOutput: '55' },
    ],
  },
];
