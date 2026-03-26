# Logic Flow Mapper

A robust, recursive "If-Then" logic engine built with React and TypeScript. This application allows users to create infinite nested logic paths and validates the integrity of the graph in real-time, detecting and flagging potential infinite loops (cycles).

## 🚀 Key Features

- **Infinite Recursive Nesting**: Build deeply nested logic structures without performance degradation.
- **Dynamic Node Linking**: Link any node to any other existing node in the system.
- **Real-time Cycle Detection**: Instant validation of the logic graph using graph-traversal algorithms.
- **Visual Feedback**: Offending paths and nodes are visually flagged during a cycle.
- **Premium UI/UX**: Built with a sleek dark-mode aesthetic, micro-animations, and glassmorphism.

## 🛠 Technical Implementation

### Data Structure: Normalised vs. Nested
I chose a **Normalised Data Structure** (Map of nodes) over a deeply nested object for several reasons:
1. **Easy Linking**: Normalisation allows any node to point to any other node (using IDs) without worrying about tree traversal or deep cloning. This is essential for the "Link to existing node" feature.
2. **Efficient Updates**: Updating a single node's condition only requires a shallow update to the top-level map, ensuring $O(1)$ updates regardless of nesting depth.
3. **Graph Algorithms**: Most graph algorithms (like DFS or Tarjan's) are easier to implement on a adjacency-list-like structure provided by a map.

### Cycle Detection Algorithm
The application uses **Tarjan's Strongly Connected Components (SCC) Algorithm** to detect loops:
- It assigns indexes and "low-link" values to each node during a DFS traversal.
- It identifies components where nodes are mutually reachable.
- Any component with more than one node (or a single node pointing to itself) represents a **Logic Loop**.
- This approach is more robust than simple DFS back-edge detection as it can identify precisely which nodes are part of the "offending" cycle cluster.

## 📦 Tech Stack

- **Framework**: React 18+
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (Normalized State)
- **Build Tool**: Vite

## 🛠 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

---
*Created as part of the Frontend Developer Technical Assessment.*
