const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const sampleProblems = [
  {
    title: 'Two Sum',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Array',
    status: 'Solved',
    link: 'https://leetcode.com/problems/two-sum/',
    notes: 'Used a HashMap to store value-to-index mappings for O(n) time complexity.',
  },
  {
    title: 'Valid Parentheses',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Stack',
    status: 'Solved',
    link: 'https://leetcode.com/problems/valid-parentheses/',
    notes: 'Push opening brackets to stack, check matching closing brackets upon popping.',
  },
  {
    title: 'Binary Search',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Searching',
    status: 'Solved',
    link: 'https://leetcode.com/problems/binary-search/',
    notes: 'Classic two-pointer approach with mid = left + (right - left) / 2 to avoid overflow.',
  },
  {
    title: 'Reverse Linked List',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Linked List',
    status: 'Solved',
    link: 'https://leetcode.com/problems/reverse-linked-list/',
    notes: 'Iterative pointer manipulation using prev, curr, and next pointers in O(n) time.',
  },
  {
    title: 'Maximum Subarray',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    status: 'Solved',
    link: 'https://leetcode.com/problems/maximum-subarray/',
    notes: "Applied Kadane's Algorithm to maintain max ending here and overall max sum.",
  },
  {
    title: 'Merge Two Sorted Lists',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Linked List',
    status: 'Solved',
    link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    notes: 'Created a dummy head node and iteratively attached the smaller element.',
  },
  {
    title: 'Valid Anagram',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'String',
    status: 'Solved',
    link: 'https://leetcode.com/problems/valid-anagram/',
    notes: 'Used a 26-length frequency array to count character occurrences.',
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Array',
    status: 'Solved',
    link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    notes: 'Tracked minPrice seen so far and calculated maxProfit greedily.',
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'String',
    status: 'Unsolved',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    notes: 'Plan to implement a sliding window with a Set to track seen characters.',
  },
  {
    title: 'Number of Islands',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'Graph',
    status: 'Unsolved',
    link: 'https://leetcode.com/problems/number-of-islands/',
    notes: 'Need to implement DFS or BFS traversal to sink connected land cells.',
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codetrack';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems.');

    // Insert sample data
    await Problem.insertMany(sampleProblems);
    console.log(`Successfully seeded ${sampleProblems.length} sample problems!`);

    process.exit(0);
  } catch (error) {
    console.error('Error during data seeding:', error.message);
    process.exit(1);
  }
};

seedData();
