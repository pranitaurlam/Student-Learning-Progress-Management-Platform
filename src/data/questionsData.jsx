const subjectsData = [
    {
        id: 'dbms',
        name: 'DBMS',
        description: 'Direct challenges from the Polaris DBMS course including Inventory management, Compensation logic, and SQL syntax.',
        iconName: 'FaDatabase',
        color: '#8b5cf6',
        questions: [
            {
                id: 1, title: 'Check Nulls (Polaris DBMS)', code: 'P_DBMS01', difficulty: 'Easy', rating: 700,
                type: 'mcq',
                statement: `In the Polaris DBMS course, what is the correct way to filter records where the \`department\` column is strictly empty (NULL)?`,
                options: ['department IS EMPTY', 'department IS NULL', 'department == NULL', 'department NOT FOUND'],
                correctOption: 1,
                explanation: 'NULL values cannot be compared using equality (=). You must use the "IS NULL" operator.'
            },
            {
                id: 2, title: 'ACID Properties (Polaris DBMS)', code: 'P_DBMS02', difficulty: 'Easy', rating: 800,
                type: 'mcq',
                statement: `Which ACID property ensures that once a transaction has been committed, it will remain so, even in the event of power loss or crashes?`,
                options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
                correctOption: 3,
                explanation: 'Durability guarantees that committed data is saved by the system permanently (e.g., written to non-volatile storage).'
            },
            {
                id: 3, title: 'Normalization (Polaris DBMS)', code: 'P_DBMS03', difficulty: 'Easy', rating: 900,
                type: 'mcq',
                statement: `A table is in Second Normal Form (2NF) if it is in 1NF and:`,
                options: ['It has no multi-valued attributes', 'Every non-prime attribute is fully functionally dependent on the primary key', 'It has no transitive dependencies', 'It contains a foreign key'],
                correctOption: 1,
                explanation: '2NF requires that all non-key attributes are fully dependent on the primary key, meaning no partial dependencies.'
            },
            {
                id: 4, title: 'Primary Key Goal', code: 'P_DBMS04', difficulty: 'Easy', rating: 950,
                type: 'mcq',
                statement: `Which property is NOT a requirement for a column to be designated as a Primary Key?`,
                options: ['Must be unique', 'Cannot contain NULL values', 'Must be a numeric data type', 'Must uniquely identify each row'],
                correctOption: 2,
                explanation: 'While many primary keys are numeric (IDs), they can be strings or other types as long as they are unique and non-null.'
            },
            {
                id: 5, title: 'Aggregate Functions', code: 'P_DBMS05', difficulty: 'Easy', rating: 980,
                type: 'mcq',
                statement: `Which SQL function would you use to find the average value of a numeric column?`,
                options: ['SUM()', 'COUNT()', 'AVG()', 'TOTAL()'],
                correctOption: 2,
                explanation: 'The AVG() function returns the average value of a numeric column.'
            },
            {
                id: 6, title: 'Inventory & Logistics', code: 'POLDB2182D', difficulty: 'Medium', rating: 1200,
                type: 'code',
                statement: `(Polaris: Inventory Task) Write a function \`calculateInventory(item)\` that takes an object \`{Total_Stock, Items_Sold, Box_Capacity}\` and returns an object with:\n1. **Remaining_Stock**: Total minus Sold\n2. **Full_Boxes**: Math.floor(Remaining / Capacity)\n3. **Loose_Items**: Remaining % Capacity`,
                starterCode: `function calculateInventory(item) {\n  const remaining = item.Total_Stock - item.Items_Sold;\n  return {\n    Remaining_Stock: remaining,\n    Full_Boxes: Math.floor(remaining / item.Box_Capacity),\n    Loose_Items: remaining % item.Box_Capacity\n  };\n}`,
                testCases: [
                    { input: '{Total_Stock: 1000, Items_Sold: 150, Box_Capacity: 12}', expected: { Remaining_Stock: 850, Full_Boxes: 70, Loose_Items: 10 } },
                    { input: '{Total_Stock: 500, Items_Sold: 20, Box_Capacity: 10}', expected: { Remaining_Stock: 480, Full_Boxes: 48, Loose_Items: 0 } }
                ]
            },
            {
                id: 7, title: 'Total Compensation', code: 'POLDB2182C', difficulty: 'Medium', rating: 1250,
                type: 'code',
                statement: `(Polaris: Compensation Task) Calculate Monthly and Annual total pay. Return \`{ Monthly_Total, Annual_Total }\` where Annual is Monthly * 12.`,
                starterCode: `function calculateCompensation(salary, bonus) {\n  const monthly = salary + bonus;\n  return {\n    Monthly_Total: monthly,\n    Annual_Total: monthly * 12\n  };\n}`,
                testCases: [
                    { input: '5000, 500', expected: { Monthly_Total: 5500, Annual_Total: 66000 } },
                    { input: '4200, 300', expected: { Monthly_Total: 4500, Annual_Total: 54000 } }
                ]
            },
            {
                id: 8, title: 'The OR Clause Filter', code: 'POLDB2183', difficulty: 'Medium', rating: 1300,
                type: 'code',
                statement: `(Polaris: OR Task) Filter a list of flights. Return rows where \`Origin === "Mumbai"\` OR \`Destination === "Delhi"\`.`,
                starterCode: `function filterFlights(flights) {\n  return flights.filter(f => f.Origin === "Mumbai" || f.Destination === "Delhi");\n}`,
                testCases: [
                    { input: '[{Origin:"Mumbai", Destination:"London"}, {Origin:"Paris", Destination:"Delhi"}, {Origin:"NY", Destination:"London"}]', expected: [{ Origin: "Mumbai", Destination: "London" }, { Origin: "Paris", Destination: "Delhi" }] }
                ]
            },
            {
                id: 9, title: 'The AND Clause Filter', code: 'POLDB2182', difficulty: 'Hard', rating: 1700,
                type: 'code',
                statement: `(Polaris: AND Task) Filter flights where \`gender === "Female"\` AND \`Destination === "Cairo"\`.`,
                starterCode: `function filterFlights(flights) {\n  return flights.filter(f => f.gender === "Female" && f.Destination === "Cairo");\n}`,
                testCases: [
                    { input: '[{gender:"Female", Destination:"Cairo"}, {gender:"Male", Destination:"Cairo"}, {gender:"Female", Destination:"Mumbai"}]', expected: [{ gender: "Female", Destination: "Cairo" }] }
                ]
            },
            {
                id: 10, title: 'Table Schema Definition', code: 'POLDB2151', difficulty: 'Hard', rating: 1900,
                type: 'code',
                statement: `(Polaris: Create Table) Mock a table schema creator. Return an object representing the SQL table structure with columns: \`employee_id\` (INT), \`employee_Name\` (STRING), \`Department\` (STRING).`,
                starterCode: `function createTableSchema() {\n  return {\n    tableName: "employee",\n    columns: [\n      { name: "employee_id", type: "INT" },\n      { name: "employee_Name", type: "STRING" },\n      { name: "Department", type: "STRING" }\n    ]\n  };\n}`,
                testCases: [
                    { input: '', expected: { tableName: "employee", columns: [{ name: "employee_id", type: "INT" }, { name: "employee_Name", type: "STRING" }, { name: "Department", type: "STRING" }] } }
                ]
            },
        ]
    },
    {
        id: 'dsa',
        name: 'DSA',
        description: 'Core Data Structures and Algorithm challenges modeled from the Polaris DSA curriculum.',
        iconName: 'FaProjectDiagram',
        color: '#f97316',
        questions: [
            {
                id: 1, title: 'Time Complexity (Polaris)', code: 'P_DSA01', difficulty: 'Easy', rating: 700,
                type: 'mcq',
                statement: `According to the Polaris DSA guidelines, what is the expected worst-case time complexity of accessing a specific element in a Hash Map (assuming good hash function)?`,
                options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
                correctOption: 2,
                explanation: 'A Hash Map offers O(1) expected time for lookup, insertion, and deletion.'
            },
            {
                id: 2, title: 'Graph Traversal (Polaris)', code: 'P_DSA02', difficulty: 'Easy', rating: 800,
                type: 'mcq',
                statement: `Which data structure is fundamentally used to implement Breadth-First Search (BFS)?`,
                options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
                correctOption: 1,
                explanation: 'BFS explores layer by layer, matching the First-In-First-Out (FIFO) logic of a Queue.'
            },
            {
                id: 3, title: 'Binary Search property', code: 'P_DSA03', difficulty: 'Easy', rating: 900,
                type: 'mcq',
                statement: `To apply Binary Search effectively on an array, the array MUST be:`,
                options: ['Symmetric', 'Positive only', 'Sorted', 'Even length'],
                correctOption: 2,
                explanation: 'Binary search splits the search space in half based on comparison, which requires the elements to be in a sorted order.'
            },
            {
                id: 4, title: 'Bytelandian Coins (Model)', code: 'P_DSA_COIN', difficulty: 'Medium', rating: 1200,
                type: 'code',
                statement: `(Polaris DP Track) Return max profit from exchanging coin N for three coins \`N/2, N/3, N/4\` (rounded down) recursively. (Memoize for large N).`,
                starterCode: `const memo = {};\nfunction getMaxDollars(n) {\n  if (n < 12) return n;\n  if (memo[n]) return memo[n];\n  return memo[n] = Math.max(n, getMaxDollars(Math.floor(n/2)) + getMaxDollars(Math.floor(n/3)) + getMaxDollars(Math.floor(n/4)));\n}`,
                testCases: [
                    { input: '12', expected: 13 },
                    { input: '2', expected: 2 }
                ]
            },
            {
                id: 5, title: 'Subset Sum (Payback)', code: 'P_DSA_SUB', difficulty: 'Medium', rating: 1400,
                type: 'code',
                statement: `(Polaris Recursion) Check if you can pay exactly target sum using a subset of the given array of banknotes. (Return true/false).`,
                starterCode: `function canPay(notes, target) {\n  function dfs(i, t) {\n    if (t === 0) return true;\n    if (i < 0 || t < 0) return false;\n    return dfs(i-1, t-notes[i]) || dfs(i-1, t);\n  }\n  return dfs(notes.length-1, target);\n}`,
                testCases: [
                    { input: '[1, 2, 5, 10], 13', expected: true },
                    { input: '[1, 2, 5, 10], 4', expected: false }
                ]
            },
            {
                id: 6, title: 'Max Weight Difference', code: 'P_DSA_WGHT', difficulty: 'Medium', rating: 1500,
                type: 'code',
                statement: `(Polaris Greedy) Separate N items into two groups of K and N-K to maximize the absolute difference in their sum. Return the difference.`,
                starterCode: `function maxWeightDiff(w, k) {\n  w.sort((a,b) => a-b);\n  let k1 = Math.min(k, w.length - k);\n  let g1 = 0, g2 = 0;\n  w.forEach((val, i) => i < k1 ? g1 += val : g2 += val);\n  return g2 - g1;\n}`,
                testCases: [
                    { input: '[1, 1, 1, 1, 1], 2', expected: 1 },
                    { input: '[8, 4, 5, 2, 10], 2', expected: 17 }
                ]
            },
            {
                id: 7, title: 'Lapindromes Model', code: 'P_DSA_LAPIN', difficulty: 'Medium', rating: 1600,
                type: 'code',
                statement: `(Polaris Strings) Check if a string's left half and right half have the exact same character frequencies. (Ignore exact middle char if odd).`,
                starterCode: `function isLapindrome(s) {\n  let h = Math.floor(s.length/2);\n  let s1 = s.slice(0, h).split('').sort().join('');\n  let s2 = s.slice(-h).split('').sort().join('');\n  return s1 === s2;\n}`,
                testCases: [
                    { input: '"gaga"', expected: true },
                    { input: '"rotor"', expected: true },
                    { input: '"abcde"', expected: false }
                ]
            },
            {
                id: 8, title: 'Max Subarray (Kadane)', code: 'P_DSA_KADN', difficulty: 'Hard', rating: 1800,
                type: 'code',
                statement: `(Polaris DP Track) Find the contiguous subarray with the largest sum and return it.`,
                starterCode: `function maxSubarraySum(arr) {\n  let m = arr[0], c = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    c = Math.max(arr[i], c + arr[i]);\n    m = Math.max(m, c);\n  }\n  return m;\n}`,
                testCases: [
                    { input: '[1, -2, 3, -1, 4]', expected: 6 },
                    { input: '[-1, -2, -3]', expected: -1 }
                ]
            },
            {
                id: 9, title: 'Graph Reversals', code: 'P_DSA_REV', difficulty: 'Hard', rating: 2000,
                type: 'code',
                statement: `(Polaris Graph Track) For a simple mock execution: Given edges, return the number of edges that go from higher number to lower number.`,
                starterCode: `function minReversals(n, edges) {\n  return edges.filter(e => e[0] > e[1]).length;\n}`,
                testCases: [
                    { input: '3, [[1,2], [3,2]]', expected: 1 }
                ]
            },
            {
                id: 10, title: 'Large Factorial', code: 'P_DSA_FACT', difficulty: 'Hard', rating: 2200,
                type: 'code',
                statement: `(Polaris Math) Return N! as a String for large numbers to prevent JS precision overflow.`,
                starterCode: `function factorialLarge(n) {\n  let res = [1];\n  for (let i = 2; i <= n; i++) {\n    let c = 0;\n    for (let j = 0; j < res.length; j++) {\n      let p = res[j] * i + c;\n      res[j] = p % 10; c = Math.floor(p / 10);\n    }\n    while(c) { res.push(c % 10); c = Math.floor(c / 10); }\n  }\n  return res.reverse().join('');\n}`,
                testCases: [
                    { input: '25', expected: "15511210043330985984000000" }
                ]
            },
        ]
    },
    {
        id: 'frontend',
        name: 'ADVANCE FRONTEND (AFD)',
        description: 'Advanced web tech, DOM manipulation, and React internals based on Polaris AFD.',
        iconName: 'FaLaptopCode',
        color: '#3b82f6',
        questions: [
            {
                id: 1, title: 'React Virtual DOM (Polaris)', code: 'P_AFD01', difficulty: 'Easy', rating: 700,
                type: 'mcq',
                statement: `In the Polaris AFD framework module, the concept of Virtual DOM is highlighted. What does it solve?`,
                options: ['Makes the browser smaller', 'Minimizes direct costly manipulations of the real DOM', 'Uses JavaScript instead of CSS', 'Validates form data instantly'],
                correctOption: 1,
                explanation: 'React maintains a Virtual DOM to batch and optimize updates before applying the minimal required changes to the real DOM (which is slow to update).'
            },
            {
                id: 2, title: 'Event Delegation (Polaris)', code: 'P_AFD02', difficulty: 'Easy', rating: 800,
                type: 'mcq',
                statement: `Event delegation relies on which fundamental DOM concept taught in AFD?`,
                options: ['Shadow DOM', 'Event Capturing', 'Event Bubbling', 'Promises'],
                correctOption: 2,
                explanation: 'Event Bubbling allows an event triggered on a child element to bubble up to parent elements, enabling a single listener on the parent to handle events for multiple children.'
            },
            {
                id: 3, title: 'Scope Closures (Polaris)', code: 'P_AFD03', difficulty: 'Easy', rating: 900,
                type: 'mcq',
                statement: `In JavaScript, a closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). This means:`,
                options: ['Inner functions have access to outer function variables', 'Outer functions have access to inner variables', 'Variables cannot be nested', 'Functions must be returned anonymously'],
                correctOption: 0,
                explanation: 'Closures allow inner functions to access outer scope variables even after the outer function has finished executing.'
            },
            {
                id: 4, title: 'React Array Rendering', code: 'P_AFD_RND', difficulty: 'Medium', rating: 1200,
                type: 'code',
                statement: `(Polaris AFD Logic) Return a string of HTML \`<li>\` tags mapping each item to a list item with a unique \`key\`.`,
                starterCode: `function renderList(items) {\n  return items.map((val, idx) => \`<li key="\${idx}">\${val}</li>\`).join('');\n}`,
                testCases: [
                    { input: '["React", "Vue"]', expected: '<li key="0">React</li><li key="1">Vue</li>' }
                ]
            },
            {
                id: 5, title: 'Deep Object Flatten', code: 'P_AFD_FLT', difficulty: 'Medium', rating: 1400,
                type: 'code',
                statement: `(Polaris AFD JS Eval) Flatten an object: \`{ user: { name: 'A' } }\` -> \`{ "user.name": "A" }\`.`,
                starterCode: `function flatten(obj, prefix = "") {\n  let res = {};\n  for (let k in obj) {\n    let p = prefix ? prefix + "." + k : k;\n    if (typeof obj[k] === 'object') Object.assign(res, flatten(obj[k], p));\n    else res[p] = obj[k];\n  }\n  return res;\n}`,
                testCases: [
                    { input: '{a: {b: 1}, c: 2}', expected: { "a.b": 1, "c": 2 } }
                ]
            },
            {
                id: 6, title: 'Hex to RGB Converter', code: 'P_AFD_RGB', difficulty: 'Medium', rating: 1500,
                type: 'code',
                statement: `Convert a standard hex color string (e.g., "#00ff00") to an RGB object \`{r, g, b}\`.`,
                starterCode: `function hexToRgb(hex) {\n  return {\n    r: parseInt(hex.substring(1,3), 16),\n    g: parseInt(hex.substring(3,5), 16),\n    b: parseInt(hex.substring(5,7), 16)\n  };\n}`,
                testCases: [
                    { input: '"#ffffff"', expected: { r: 255, g: 255, b: 255 } }
                ]
            },
            {
                id: 7, title: 'Query String Parsing', code: 'P_AFD_URL', difficulty: 'Medium', rating: 1600,
                type: 'code',
                statement: `Parse a URL query string \`?name=john&age=30\` into an object \`{name: "john", age: "30"}\`.`,
                starterCode: `function parseQuery(str) {\n  let o = {};\n  str.replace('?','').split('&').forEach(p => {\n    let [k,v] = p.split('=');\n    o[k] = v;\n  });\n  return o;\n}`,
                testCases: [
                    { input: '"?user=chef&id=10"', expected: { user: "chef", id: "10" } }
                ]
            },
            {
                id: 8, title: 'Virtual DOM Intersection', code: 'P_AFD_VIS', difficulty: 'Hard', rating: 1800,
                type: 'code',
                statement: `(Polaris Performance) Given V-Nodes with \`yPos\`, return an array of IDs for nodes that overlap with the \`range [min, max]\`.`,
                starterCode: `function getVisibleNodes(nodes, range) {\n  return nodes.filter(n => n.yPos >= range[0] && n.yPos <= range[1]).map(n => n.id);\n}`,
                testCases: [
                    { input: '[{id:1, yPos:10}, {id:2, yPos:100}, {id:3, yPos:200}], [50, 150]', expected: [2] }
                ]
            },
            {
                id: 9, title: 'CSS Specificity Logic', code: 'P_AFD_CSS', difficulty: 'Hard', rating: 1900,
                type: 'code',
                statement: `Return specificity score \`[ID, Class, Tag]\` for a simple space-delimited string.`,
                starterCode: `function getSpecificity(s) {\n  let r = [0, 0, 0];\n  s.split(' ').forEach(p => {\n    if (p[0] === '#') r[0]++;\n    else if (p[0] === '.') r[1]++;\n    else r[2]++;\n  });\n  return r;\n}`,
                testCases: [
                    { input: '"#header .btn span"', expected: [1, 1, 1] }
                ]
            },
            {
                id: 10, title: 'React Lifecycle Diffing', code: 'P_AFD_DIF', difficulty: 'Hard', rating: 2200,
                type: 'code',
                statement: `(Polaris React Diff) Compare old and new VNode lists by 'key'. Output \`{added, removed, stable}\` arrays of keys.`,
                starterCode: `function getDiffKeys(oldN, newN) {\n  let o = oldN.map(x => x.key), n = newN.map(x => x.key);\n  return {\n    added: n.filter(k => !o.includes(k)),\n    removed: o.filter(k => !n.includes(k)),\n    stable: n.filter(k => o.includes(k))\n  };\n}`,
                testCases: [
                    { input: '[{key:1}, {key:2}], [{key:2}, {key:3}]', expected: { added: [3], removed: [1], stable: [2] } }
                ]
            },
        ]
    },
    {
        id: 'ml',
        name: 'FUNDAMENTAL OF MACHINE LEARNING (FOML)',
        description: 'Explore models, calculus for ML, metrics, and core logic aligned with Polaris FOML.',
        iconName: 'FaBrain',
        color: '#10b981',
        questions: [
            {
                id: 1, title: 'Supervised Learning (FOML)', code: 'P_FML01', difficulty: 'Easy', rating: 700,
                type: 'mcq',
                statement: `In the Polaris FOML track, analyzing continuous numerical targets vs predicting categorical classes splits supervised learning into:`,
                options: ['Classification and Clustering', 'Regression and Classification', 'Clustering and Dimensionality Reduction', 'Reinforcement and Heuristics'],
                correctOption: 1,
                explanation: 'Regression predicts continuous numbers (like price), Classification predicts discrete categories (like spam or not).'
            },
            {
                id: 2, title: 'Overfitting Metrics (FOML)', code: 'P_FML02', difficulty: 'Easy', rating: 800,
                type: 'mcq',
                statement: `What generally happens to the training error and validation error when a model overfits, as taught in FOML?`,
                options: ['Both decrease', 'Both increase', 'Training decreases, Validation increases', 'Training increases, Validation decreases'],
                correctOption: 2,
                explanation: 'Overfitting means the model memorizes the training data perfectly (low training error) but fails to generalize (high validation error).'
            },
            {
                id: 3, title: 'Scaling (FOML)', code: 'P_FML03', difficulty: 'Easy', rating: 900,
                type: 'mcq',
                statement: `Which approach scales input features such that their distribution has a mean of 0 and standard deviation of 1?`,
                options: ['Min-Max Scaling', 'MaxAbs Scaling', 'Standardization (Z-score)', 'Logarithmic Scaling'],
                correctOption: 2,
                explanation: 'Standardization (Z-score scaling) shifts features to mean 0 and scales them to variance 1.'
            },
            {
                id: 4, title: 'Mean Absolute Error', code: 'P_FML_MAE', difficulty: 'Medium', rating: 1300,
                type: 'code',
                statement: `(FOML Regression) Calculate Mean Absolute Error (MAE): \`Σ|y - y_pred| / n\`.`,
                starterCode: `function calculateMAE(y, y_p) {\n  return y.reduce((s, val, i) => s + Math.abs(val - y_p[i]), 0) / y.length;\n}`,
                testCases: [
                    { input: '[10, 20], [12, 18]', expected: 2 }
                ]
            },
            {
                id: 5, title: 'Euclidean Metrics', code: 'P_FML_EUC', difficulty: 'Medium', rating: 1400,
                type: 'code',
                statement: `(FOML Distance Metrics) Calculate the Euclidean distance between two 2D points. Round to 2 decimals using Number(val.toFixed(2)).`,
                starterCode: `function euclidean(p1, p2) {\n  let d = Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2);\n  return Number(d.toFixed(2));\n}`,
                testCases: [
                    { input: '[1, 2], [4, 6]', expected: 5 }
                ]
            },
            {
                id: 6, title: 'Categorical One-Hot', code: 'P_FML_OHE', difficulty: 'Medium', rating: 1500,
                type: 'code',
                statement: `(FOML Preprocessing) Map a label string to a binary array based on possible classes.`,
                starterCode: `function getOneHot(label, classes) {\n  return classes.map(c => c === label ? 1 : 0);\n}`,
                testCases: [
                    { input: '"Cat", ["Dog", "Cat", "Fish"]', expected: [0, 1, 0] }
                ]
            },
            {
                id: 7, title: 'Category Encoding', code: 'P_FML_LBL', difficulty: 'Medium', rating: 1600,
                type: 'code',
                statement: `(FOML Preprocessing) Map an array of string labels to zero-indexed integers (alphabetical order).`,
                starterCode: `function labelEncode(arr) {\n  const s = [...new Set(arr)].sort();\n  return arr.map(x => s.indexOf(x));\n}`,
                testCases: [
                    { input: '["Z", "A", "Z"]', expected: [1, 0, 1] }
                ]
            },
            {
                id: 8, title: 'R-Squared Score', code: 'P_FML_R2', difficulty: 'Hard', rating: 1800,
                type: 'code',
                statement: `(FOML Advanced Metrics) Calculate R2 Score. Return Number((1 - (SSR/SST)).toFixed(2)).`,
                starterCode: `function calculateR2(y, yp) {\n  let m = y.reduce((s,v) => s+v, 0) / y.length;\n  let ssr = y.reduce((s,v,i) => s + (v - yp[i])**2, 0);\n  let sst = y.reduce((s,v) => s + (v - m)**2, 0);\n  return Number((1 - ssr/sst).toFixed(2));\n}`,
                testCases: [
                    { input: '[1, 2, 3], [1.1, 1.9, 3.0]', expected: 0.99 }
                ]
            },
            {
                id: 9, title: 'Gradient Descent Step', code: 'P_FML_GRAD', difficulty: 'Hard', rating: 2000,
                type: 'code',
                statement: `(FOML Calculus) Apply a single gradient step for an array of weights. \`w_new = w - learning_rate * grad\`. Fixed precision: 3 decimals.`,
                starterCode: `function updateWeights(weights, grads, lr) {\n  return weights.map((w, i) => Number((w - lr * grads[i]).toFixed(3)));\n}`,
                testCases: [
                    { input: '[0.5, 0.2], [0.1, -0.05], 0.1', expected: [0.49, 0.205] }
                ]
            },
            {
                id: 10, title: 'K-Means Core Logic', code: 'P_FML_KM', difficulty: 'Hard', rating: 2200,
                type: 'code',
                statement: `(FOML Clustering) Return the centroid \`[meanX, meanY]\` for an array of points assigned to a cluster.`,
                starterCode: `function getCentroid(pts) {\n  let x = pts.reduce((s,p) => s+p[0], 0)/pts.length;\n  let y = pts.reduce((s,p) => s+p[1], 0)/pts.length;\n  return [x, y];\n}`,
                testCases: [
                    { input: '[[1, 2], [3, 4], [5, 6]]', expected: [3, 4] }
                ]
            },
        ]
    },
];

export default subjectsData;
