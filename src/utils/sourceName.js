// database stores lowercase ids, the UI shows the proper brand names
const NAMES = {
    codeforces: 'Codeforces',
    geeksforgeeks: 'GeeksforGeeks',
    codechef: 'CodeChef',
    codewars: 'Codewars',
    kattis: 'Kattis',
    atcoder: 'AtCoder',
    leetcode: 'LeetCode',
    hackerrank: 'HackerRank'
};

export function sourceName(id) {
    return NAMES[id] || id;
}